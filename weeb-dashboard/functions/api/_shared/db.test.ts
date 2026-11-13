import { describe, it, expect, vi } from "vitest"
import { D1_MAX_BOUND_PARAMETERS, queryInChunks } from "./db"

// Stands in for D1, which refuses a statement binding more than 100 parameters with
// "too many SQL variables".
const d1Query = (reserved = 0) =>
  vi.fn(async (chunk: number[]) => {
    if (chunk.length + reserved > D1_MAX_BOUND_PARAMETERS) throw new Error("D1_ERROR: too many SQL variables")
    return chunk.map((n) => ({ n }))
  })

describe("queryInChunks", () => {
  it("never binds more than D1's limit, and returns every row in order", async () => {
    const ids = Array.from({ length: 250 }, (_, i) => i)
    const query = d1Query()

    const rows = await queryInChunks(ids, query)

    expect(query.mock.calls.map(([chunk]) => chunk.length)).toEqual([100, 100, 50])
    expect(rows.map((r) => r.n)).toEqual(ids)
  })

  it("leaves room for the statement's other parameters", async () => {
    const ids = Array.from({ length: 150 }, (_, i) => i)
    const query = d1Query(1)

    await queryInChunks(ids, query, 1)

    expect(Math.max(...query.mock.calls.map(([chunk]) => chunk.length))).toBe(99)
  })

  it("runs no query for an empty list", async () => {
    const query = d1Query()

    expect(await queryInChunks([], query)).toEqual([])
    expect(query).not.toHaveBeenCalled()
  })
})
