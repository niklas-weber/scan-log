import * as core from '@actions/core'
import * as github from '@actions/github'
import {errorCheck} from './errorcheck'

async function run(): Promise<void> {
  try {
    core.debug('Get input for "gh-token"')
    const ghToken: string = core.getInput('gh-token', {required: true})

    core.debug('Get octokit instance')
    const octokit = github.getOctokit(ghToken)

    const repoOwner = core.getInput('repo-owner')
    core.debug(`Repo owner: ${repoOwner}`)

    const repoName = core.getInput('repo-name').replace(`${repoOwner}/`, '')
    core.debug(`Repo name: ${repoName}`)

    core.debug(core.getInput('run-id'))
    core.debug('Getting workflow jobs')
    const resJobs = await octokit.rest.actions.listJobsForWorkflowRun({
      run_id: Number(core.getInput('run-id')),
      owner: repoOwner,
      repo: repoName
    })

    const job = resJobs.data.jobs.filter(
      val => val.name === core.getInput('job-name')
    )

    core.debug(`Job ID: ${job[0].id}`)

    core.debug('Getting workflow logs')
    const errorLogs = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
      job_id: job[0].id,
      owner: core.getInput('repo-owner'),
      repo: core.getInput('repo-name')
    })

    core.info(`Log URL: ${errorLogs.data}`)

    const errorInPrevJob = errorCheck(
      core.getInput('error'),
      String(errorLogs.data)
    )

    if (!errorInPrevJob) {
      core.info('✅ No errors found')
    } else {
      core.setFailed('❌ Error in previous log')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
