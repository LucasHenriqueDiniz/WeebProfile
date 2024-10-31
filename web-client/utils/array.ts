function arrayIsEmpty(arr: any[]) {
  try {
    return arr.length === 0
  } catch (err) {
    return true
  }
}

export default arrayIsEmpty
