export interface GithubUser {
  login: string
  avatar_url: string
  name: string
}

async function fetchGithubUser(username: string): Promise<GithubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)

    if (!response.ok) {
      throw new Error("Error fetching user")
    }

    const data = await response.json()
    return data as GithubUser
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default fetchGithubUser
