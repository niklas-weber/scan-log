export function errorCheck(errorString: string, checkString: string): boolean {
  const regex = new RegExp(errorString)
  return regex.test(checkString)
}
