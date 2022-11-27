import {errorCheck} from '../src/errorcheck'
import {expect, test} from '@jest/globals'
import {readFileSync} from 'fs'

test('check ERROR log; find error', async () => {
  const checkString = 'ERROR'
  const log = readFileSync(`${__dirname}/testLog.txt`).toString()
  expect(errorCheck(checkString, log)).toBe(true)
})

test('check ERROR log; find no error', async () => {
  const checkString = 'ERROR not found'
  const log = readFileSync(`${__dirname}/testLog.txt`).toString()
  expect(errorCheck(checkString, log)).toBe(false)
})
