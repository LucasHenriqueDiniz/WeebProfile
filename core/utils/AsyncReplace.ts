// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function asyncReplace(str: string, regex: RegExp, asyncFn: (match: string, ...args: any[]) => Promise<string>) {
  const promises: Promise<string>[] = []
  str.replace(regex, (match, ...args) => {
    promises.push(asyncFn(match, ...args))
    return match
  })
  const replacements = await Promise.all(promises)
  return str.replace(regex, () => replacements.shift() as string)
}

export default asyncReplace
