import { describe, it, expect, vi, afterEach } from "vitest"
import { log, hashUserId } from "./log"

const capture = (level: "log" | "warn" | "error") => vi.spyOn(console, level).mockImplementation(() => {})

afterEach(() => vi.restoreAllMocks())

const lastLine = (spy: ReturnType<typeof capture>) => JSON.parse(spy.mock.calls.at(-1)![0] as string)

describe("log", () => {
  it("emits a single JSON line with level and event", () => {
    const spy = capture("log")
    log.info("generate.request", { style: "terminal" })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(lastLine(spy)).toEqual({ level: "info", event: "generate.request", style: "terminal" })
  })

  it("routes warn and error to the matching console method", () => {
    const warn = capture("warn")
    const error = capture("error")

    log.warn("a")
    log.error("b")

    expect(lastLine(warn).level).toBe("warn")
    expect(lastLine(error).level).toBe("error")
  })

  // The reason this module exists. The generator logged the Clerk user id verbatim
  // on every authenticated generation -- a stable identifier that joins directly
  // into plugin_secrets, written to storage that outlives the request.
  it.each(["userId", "user_id", "apiKey", "api_key", "token", "secret", "password", "authorization", "auth"])(
    "redacts %s",
    (key) => {
      const spy = capture("log")
      log.info("event", { [key]: "sensitive-value-12345" })

      const line = lastLine(spy)
      expect(line[key]).toBe("[redacted]")
      expect(JSON.stringify(line)).not.toContain("sensitive-value")
    }
  )

  it("redacts regardless of casing", () => {
    const spy = capture("log")
    log.info("event", { UserId: "abc", APIKEY: "def" })

    const serialised = JSON.stringify(lastLine(spy))
    expect(serialised).not.toContain("abc")
    expect(serialised).not.toContain("def")
  })

  it("leaves non-sensitive fields alone", () => {
    const spy = capture("log")
    log.info("event", { plugins: ["github"], count: 3, user: "a1b2c3" })

    expect(lastLine(spy)).toMatchObject({ plugins: ["github"], count: 3, user: "a1b2c3" })
  })
})

describe("hashUserId", () => {
  it("is stable for the same input", async () => {
    expect(await hashUserId("user_123")).toBe(await hashUserId("user_123"))
  })

  it("differs between users", async () => {
    expect(await hashUserId("user_123")).not.toBe(await hashUserId("user_456"))
  })

  it("does not contain the original id", async () => {
    expect(await hashUserId("user_abc123")).not.toContain("abc123")
  })

  it("is short enough to read in a log line", async () => {
    expect(await hashUserId("user_123")).toHaveLength(12)
  })

  // Passing the hash through the logger must not trip the redaction: it is named
  // `user`, not `userId`, precisely so a correlatable-but-anonymous tag survives.
  it("survives the logger when passed as `user`", async () => {
    const spy = capture("log")
    const user = await hashUserId("user_123")
    log.info("secrets.loaded", { user })

    expect(lastLine(spy).user).toBe(user)
  })
})
