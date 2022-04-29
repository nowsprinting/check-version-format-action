import {run} from '../src/run'
import * as process from 'process'
import * as core from '@actions/core'
import * as github from '@actions/github'

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/v1.0.0'}
  ${`v`} | ${'refs/tags/v2.3.4'}
  ${``}  | ${'refs/tags/99.999.9999'}
  ${``}  | ${'refs/tags/99.999.9999+0354f3a'}
`('stable version', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const spy = jest.spyOn(core, 'setOutput')
    await run()

    expect(spy).toHaveBeenCalledWith('is_valid', true.toString())
    expect(spy).toHaveBeenCalledWith('is_stable', true.toString())
  })
})

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/v1.0.0-alpha'}
  ${`v`} | ${'refs/tags/v2.3.4-beta5'}
  ${`v`} | ${'refs/tags/v0.1.0'}
  ${``}  | ${'refs/tags/99.999.9999-SNAPSHOT'}
  ${``}  | ${'refs/tags/99.999.9999-SNAPSHOT+0354f3a'}
`('valid version format but not stable', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const spy = jest.spyOn(core, 'setOutput')
    await run()

    expect(spy).toHaveBeenCalledWith('is_valid', true.toString())
    expect(spy).toHaveBeenCalledWith('is_stable', false.toString())
  })
})

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/v1'}
  ${`v`} | ${'refs/tags/v1.2'}
  ${`v`} | ${'refs/tags/2.3.4-rc3'}
  ${``}  | ${'refs/tags/v2.3.4.5'}
  ${``}  | ${'refs/tags/99.999.9999.99999'}
  ${``}  | ${'refs/heads/master'}
  ${``}  | ${'refs/pull/:prNumber/merge'}
`('invalid version format', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const spy = jest.spyOn(core, 'setOutput')
    await run()

    expect(spy).toHaveBeenCalledWith('is_valid', false.toString())
    expect(spy).toHaveBeenCalledWith('is_stable', false.toString())
  })
})

describe.each`
  prefix | ref                                         | full                              | major   | major_prerelease
  ${`v`} | ${'refs/tags/v1.0.0'}                       | ${'v1.0.0'}                       | ${'v1'} | ${'v1'}
  ${`v`} | ${'refs/tags/v2.3.4'}                       | ${'v2.3.4'}                       | ${'v2'} | ${'v2'}
  ${`v`} | ${'refs/tags/v1.0.0-alpha'}                 | ${'v1.0.0-alpha'}                 | ${'v1'} | ${'v1-alpha'}
  ${`v`} | ${'refs/tags/v2.3.4-beta5'}                 | ${'v2.3.4-beta5'}                 | ${'v2'} | ${'v2-beta5'}
  ${``}  | ${'refs/tags/99.999.9999'}                  | ${'99.999.9999'}                  | ${'99'} | ${'99'}
  ${``}  | ${'refs/tags/99.999.9999-SNAPSHOT'}         | ${'99.999.9999-SNAPSHOT'}         | ${'99'} | ${'99-SNAPSHOT'}
  ${``}  | ${'refs/tags/99.999.9999+0354f3a'}          | ${'99.999.9999+0354f3a'}          | ${'99'} | ${'99'}
  ${``}  | ${'refs/tags/99.999.9999-SNAPSHOT+0354f3a'} | ${'99.999.9999-SNAPSHOT+0354f3a'} | ${'99'} | ${'99-SNAPSHOT'}
`('version string', ({prefix, ref, full, major, major_prerelease}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const spy = jest.spyOn(core, 'setOutput')
    await run()

    expect(spy).toHaveBeenCalledWith('full', full)
    expect(spy).toHaveBeenCalledWith('major', major)
    expect(spy).toHaveBeenCalledWith('major_prerelease', major_prerelease)
  })
})
