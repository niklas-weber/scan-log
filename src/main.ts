import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    core.debug('Get input for "error"')
    const errorRegex = new RegExp(core.getInput('error', {required: true}))

    core.debug('Check regex against "ERROR"')
    core.debug(String(errorRegex.test('ERROR')))

    core.debug('Get input for "gh-token"')
    const ghToken: string = core.getInput('gh-token', {required: true})

    core.debug('Get octokit instance')
    const octokit = github.getOctokit(ghToken)

    try {
      core.debug('Getting workflow jobs')
      const resJobs = await octokit.rest.actions.listJobsForWorkflowRun({
        run_id: Number(core.getInput('run-id')),
        owner: core.getInput('repo-owner'),
        repo: core.getInput('repo-name')
      })

      const job = resJobs.data.jobs.filter(
        val => val.name === core.getInput('job-name')
      )

      core.debug(`Job ID: ${job[0].id}`)

      core.debug('Getting workflow logs')
      const errorLogs =
        await octokit.rest.actions.downloadJobLogsForWorkflowRun({
          job_id: job[0].id,
          owner: core.getInput('repo-owner'),
          repo: core.getInput('repo-name')
        })

      core.info(`Log URL: ${errorLogs.data}`)

      const errorInPrevJob: boolean = errorRegex.test(String(errorLogs.data))

      if (!errorInPrevJob) {
        core.info('✅ No errors found')
      } else {
        core.setFailed('❌ Error in previous log')
      }
    } catch (error) {
      if (error instanceof Error) core.setFailed(error.message)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
