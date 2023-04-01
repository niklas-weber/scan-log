# Check logs from previous jobs for Errors
This action uses a regex to search through the logs of previous job. If the provided error string was found this action will return with a failed state.
This comes in handy when a task does not exit with an error status even if something failes.

## Usage
```yaml
  check-error:
    needs: errornous-job
    steps:
      - uses: niklas-weber/scan-log
        with:
          error: 'ERROR Code'
          gh-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.run_id }}
          job-name: errornous-job
          repo-name: repo #Optional; defaults to current repo
          repo-owner: repo_owner #Optional; defaults to current repo owner
```
