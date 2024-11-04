import RateLimit from "../types/Rate"

async function fetchRateLimit(token: string): Promise<RateLimit> {
  const url = "https://api.github.com/rate_limit"
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return (await response.json()) as RateLimit
}

export default fetchRateLimit
