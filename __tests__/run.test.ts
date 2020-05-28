import {run} from '../src/run'
import * as process from 'process'
import * as core from '@actions/core'
import * as github from '@actions/github'

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/v1'}
  ${`v`} | ${'refs/tags/v1.2'}
  ${`v`} | ${'refs/tags/v2.3.4'}
  ${``}  | ${'refs/tags/99.999.9999.99999'}
`('stable version', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const setOutputSpy = jest.spyOn(core, 'setOutput')
    await run()

    expect(setOutputSpy).toHaveBeenNthCalledWith(1, 'is_valid', true.toString())
    expect(setOutputSpy).toHaveBeenNthCalledWith(
      2,
      'is_stable',
      true.toString()
    )
  })
})

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/v2-alpha1'}
  ${`v`} | ${'refs/tags/v2.3-beta2'}
  ${`v`} | ${'refs/tags/v2.3.4-rc3'}
  ${``}  | ${'refs/tags/99.999.9999.99999-SNAPSHOT'}
`('valid version format but not stable', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const setOutputSpy = jest.spyOn(core, 'setOutput')
    await run()

    expect(setOutputSpy).toHaveBeenNthCalledWith(1, 'is_valid', true.toString())
    expect(setOutputSpy).toHaveBeenNthCalledWith(
      2,
      'is_stable',
      false.toString()
    )
  })
})

describe.each`
  prefix | ref
  ${`v`} | ${'refs/tags/2.3.4-rc3'}
  ${``}  | ${'refs/tags/v2.3.4.5'}
  ${``}  | ${'refs/heads/master'}
  ${``}  | ${'refs/pull/:prNumber/merge'}
`('invalid version format', ({prefix, ref}) => {
  test(`${ref}`, async () => {
    process.env['INPUT_PREFIX'] = prefix
    github.context.ref = ref

    const setOutputSpy = jest.spyOn(core, 'setOutput')
    await run()

    expect(setOutputSpy).toHaveBeenNthCalledWith(
      1,
      'is_valid',
      false.toString()
    )
    expect(setOutputSpy).toHaveBeenNthCalledWith(
      2,
      'is_stable',
      false.toString()
    )
  })
})
