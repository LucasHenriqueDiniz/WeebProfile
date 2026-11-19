/**
 * Mock data for the chess plugin: a Lichess-like account, so it needs no avatar.
 */

import type { ChessData } from "../types"

export function getMockChessData(): ChessData {
  return {
    platform: "lichess",
    username: "example",
    profileUrl: "https://lichess.org/@/example",
    profile: {
      name: "Example Player",
      title: "FM",
      country: "BR",
      joined: "2016-03-14T12:00:00.000Z",
      playTimeSeconds: 1_874_520,
    },
    ratings: [
      { control: "bullet", rating: 2412, best: 2530, games: 8312 },
      { control: "blitz", rating: 2286, best: 2351, games: 4120 },
      { control: "rapid", rating: 2190, best: 2244, games: 612 },
      { control: "classical", rating: 2050, best: 2050, games: 14, provisional: true },
      { control: "daily", games: 0 },
      { control: "puzzle", rating: 2604, games: 3911 },
    ],
    results: { win: 6950, draw: 701, loss: 5407 },
    recentGames: [
      {
        url: "https://lichess.org/AFQEZyJN",
        date: "2026-11-18T21:14:00.000Z",
        control: "bullet",
        result: "win",
        color: "white",
        opponent: { name: "amazzzingbalalaika", rating: 2398 },
      },
      {
        url: "https://lichess.org/3M4Rq5YT/black",
        date: "2026-11-18T20:51:00.000Z",
        control: "blitz",
        result: "loss",
        color: "black",
        opponent: { name: "Zhigalko_Sergei", title: "GM", rating: 2903 },
      },
      {
        url: "https://lichess.org/PlVtgcLv",
        date: "2026-11-17T18:02:00.000Z",
        control: "blitz",
        result: "draw",
        color: "white",
        opponent: { name: "chessmaster_88", rating: 2271 },
      },
      {
        url: "https://lichess.org/HqjDTU4A/black",
        date: "2026-11-16T09:41:00.000Z",
        control: "rapid",
        result: "win",
        color: "black",
        opponent: { name: "knight_rider", rating: 2177 },
      },
      {
        url: "https://lichess.org/Xy12Ab34",
        date: "2026-11-15T22:27:00.000Z",
        control: "bullet",
        result: "win",
        color: "white",
        opponent: { name: "pawnstorm", rating: 2330 },
      },
    ],
  }
}
