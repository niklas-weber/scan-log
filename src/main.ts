import * as core from '@actions/core'
import * as github from '@actions/github'
import {HttpClient, HttpClientResponse} from '@actions/http-client'

async function run(): Promise<void> {
  try {
    const errorRegex = new RegExp(core.getInput('error', {required: true}))

    core.debug(String(errorRegex.test('ERROR')))

    const ghToken: string = core.getInput('gh-token', {required: true})

    const octokit = github.getOctokit(ghToken)

    const wfURL = await octokit.rest.actions.downloadWorkflowRunLogs()

    const httpClient = new HttpClient('gh-http-client', [], {
      headers: {'Conten-Type': 'application/json'}
    })

    if (wfURL.headers.location !== undefined) {
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
