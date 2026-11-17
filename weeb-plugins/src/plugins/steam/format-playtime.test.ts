import { describe, expect, it } from "vitest"
import { formatPlaytime } from "./format-playtime"

describe("formatPlaytime", () => {
  it("shows minutes under an hour instead of 0h", () => {
    expect(formatPlaytime(0)).toBe("0m")
    expect(formatPlaytime(51)).toBe("51m")
  })

  it("shows whole hours under a day", () => {
    expect(formatPlaytime(60)).toBe("1h")
    expect(formatPlaytime(119)).toBe("1h")
    expect(formatPlaytime(23 * 60 + 59)).toBe("23h")
  })

  it("shows days and the hours left over", () => {
    expect(formatPlaytime(24 * 60)).toBe("1d 0h")
    expect(formatPlaytime((852 * 24 + 23) * 60 + 10)).toBe("852d 23h")
  })
})
