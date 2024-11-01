function isNodeEnvironment() {
  // Check if the code is running in Node.js environment or in the browser | this is needed because we cannot use fs in the browser
  const isNodeEnv = typeof process !== "undefined" && process.versions && process.versions.node
  if (isNodeEnv) {
    return true
  } else {
    return false
  }
}

export default isNodeEnvironment
