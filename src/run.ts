import * as core from '@actions/core'
import * as github from '@actions/github'
import * as semver from 'semver'

export async function run(): Promise<void> {
  try {
    const prefix: string = core.getInput('prefix')
    core.debug(`prefix: ${prefix}`)

    const versionNumberRegexp = `^refs/tags/${prefix}(.+)$`
    const versionNumberMatcher = github.context.ref.match(versionNumberRegexp)
    if (versionNumberMatcher == null) {
      core.setOutput('is_valid', false.toString())
      core.setOutput('is_stable', false.toString())
      return
    }

    const versionNumber = versionNumberMatcher[1]
    if (
      (core.getInput('strict').toLowerCase() === 'true' &&
        semver.valid(versionNumber) == null) ||
      semver.valid(semver.coerce(versionNumber)) == null
    ) {
      core.setOutput('is_valid', false.toString())
      core.setOutput('is_stable', false.toString())
      return
    }

    core.setOutput('is_valid', true.toString())
    core.setOutput('full', `${prefix}${versionNumber}`)

    const major = semver.major(versionNumber)
    core.setOutput('major', `${prefix}${major}`)

    const prerelease = semver.prerelease(versionNumber)
    if (prerelease == null) {
      core.setOutput('is_stable', true.toString())
      core.setOutput('major_prerelease', `${prefix}${major}`)
    } else {
      core.setOutput('is_stable', false.toString())
      core.setOutput('major_prerelease', `${prefix}${major}-${prerelease}`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
