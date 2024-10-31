async function fetchRateLimit(token: string) {
  const url = "https://api.github.com/rate_limit";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export default fetchRateLimit;
