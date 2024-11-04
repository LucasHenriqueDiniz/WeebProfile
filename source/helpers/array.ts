import logger from "./logger"

export function isArrayEmpty(arr: unknown[] | null | undefined): boolean {
  if (arr === null || arr === undefined) {
    return true
  }

  try {
    return arr.length === 0
  } catch (err) {
    logger({
      message: `Error checking if array is empty: ${err}`,
      level: "error",
      __filename,
    })
    return true
  }
}
