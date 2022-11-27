import * as core from '@actions/core'
import * as github from '@actions/github'
import {HttpClient, HttpClientResponse} from '@actions/http-client'

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

    core.debug('Getting Workflow logs')
    const wfURL = await octokit.rest.actions.downloadWorkflowRunLogs()

    core.debug(`Log URL: ${wfURL.headers.location}`)

    core.debug('Creating HTTP Client')
    const httpClient = new HttpClient('gh-http-client', [], {
      headers: {'Conten-Type': 'application/json'}
    })

    if (wfURL.headers.location !== undefined) {
      core.debug('GET logs')
      const res: HttpClientResponse = await httpClient.get(
        wfURL.headers.location
      )
      const body: string = await res.readBody()
      core.debug(body)
    } else {
      core.error("Can't get log access; missing URL")
    }
    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
