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

    const versionNumber: string = versionNumberMatcher[1] // TODO: non-strict mode (use semver.coerce)
    if (semver.valid(versionNumber) == null) {
      core.setOutput('is_valid', false.toString())
      core.setOutput('is_stable', false.toString())
      return
    }

    core.setOutput('is_valid', true.toString())
    core.setOutput('full', `${prefix}${versionNumber}`)
    core.setOutput('full_without_prefix', `${versionNumber}`)

    const major = semver.major(versionNumber)
    core.setOutput('major', `${prefix}${major}`)
    core.setOutput('major_without_prefix', `${major}`)

    const minor = semver.minor(versionNumber)
    core.setOutput('minor', `${minor}`)

    const patch = semver.patch(versionNumber)
    core.setOutput('patch', `${patch}`)

    const prerelease = semver.prerelease(versionNumber)
    if (prerelease == null) {
      if (major !== 0) {
        core.setOutput('is_stable', true.toString())
      } else {
        core.setOutput('is_stable', false.toString())
      }
      core.setOutput('prerelease', ``)
      core.setOutput('major_prerelease', `${prefix}${major}`)
      core.setOutput('major_prerelease_without_prefix', `${major}`)
    } else {
      core.setOutput('is_stable', false.toString())
      core.setOutput('prerelease', `${prerelease}`)
      core.setOutput('major_prerelease', `${prefix}${major}-${prerelease}`)
      core.setOutput(
        'major_prerelease_without_prefix',
        `${major}-${prerelease}`
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
