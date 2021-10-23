import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    const prefix: string = core.getInput('prefix')
    core.debug(`prefix: ${prefix}`)

    const versionRegexpBase = `^refs/tags/${prefix}(([0-9]+)(\\.[0-9]+)*`
    const versionRegexp = RegExp(`${versionRegexpBase}.*$)`)
    const matcher = github.context.ref.match(versionRegexp)
    if (matcher != null) {
      core.setOutput('is_valid', true.toString())
      core.setOutput('full', prefix + matcher[1])
      core.setOutput('major', prefix + matcher[2])
    } else {
      core.setOutput('is_valid', false.toString())
    }

    const stableRegexp = RegExp(`${versionRegexpBase}$)`)
    if (github.context.ref.match(stableRegexp) != null) {
      core.setOutput('is_stable', true.toString())
    } else {
      core.setOutput('is_stable', false.toString())
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}
