import { describe, expect, it } from "vitest"
import { parseChessIdentity, profileUrl } from "./identity"

describe("parseChessIdentity", () => {
  it.each([
    ["https://lichess.org/@/penguingim1", "lichess", "penguingim1"],
    ["lichess.org/@/DrNykterstein", "lichess", "DrNykterstein"],
    ["https://lichess.org/@/thibault/perf/blitz", "lichess", "thibault"],
    ["lichess.org/thibault", "lichess", "thibault"],
    ["lichess:thibault", "lichess", "thibault"],
    ["Lichess.org: thibault", "lichess", "thibault"],
    ["https://www.chess.com/member/Hikaru", "chesscom", "Hikaru"],
    ["chess.com/member/hikaru/", "chesscom", "hikaru"],
    ["https://www.chess.com/pt-BR/member/gothamchess", "chesscom", "gothamchess"],
    ["https://www.chess.com/stats/live/blitz/hikaru", "chesscom", "hikaru"],
    ["chess.com:MagnusCarlsen", "chesscom", "MagnusCarlsen"],
    ["chesscom:magnus_carlsen", "chesscom", "magnus_carlsen"],
  ])("%s → %s %s", (input, platform, username) => {
    expect(parseChessIdentity(input)).toEqual({ platform, username })
  })

  it.each([
    "thibault", // no site: the same name can be two people
    "https://example.com/@/thibault",
    "https://lichess.org/",
    "lichess:",
    "lichess:a b",
    "lichess:../etc",
    "chess.com:x",
    42,
    undefined,
  ])("rejects %j", (input) => {
    expect(parseChessIdentity(input)).toBeNull()
  })

  it("builds each site's profile link", () => {
    expect(profileUrl({ platform: "lichess", username: "thibault" })).toBe("https://lichess.org/@/thibault")
    expect(profileUrl({ platform: "chesscom", username: "hikaru" })).toBe("https://www.chess.com/member/hikaru")
  })
})
