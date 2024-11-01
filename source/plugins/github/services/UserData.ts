import axios from "axios"
import { UserData } from "../types"
import isNodeEnvironment from "plugins/@utils/isNodeEnv"
import imageToBase64 from "source/plugins/@utils/imageToBase64"

async function fetchUserData(login: string, token: string): Promise<UserData> {
  const UserQuery = `
query BaseUser {
  user(login: "${login}") {
    databaseId
    name
    login
    location
    createdAt
    avatarUrl
    company
    followers {
        totalCount
    }
    following {
        totalCount
    }
    repositoriesContributedTo(includeUserRepositories: true) {
      totalCount
    }0
    gists {
      totalCount
    }
    packages {
      totalCount
    }
    repositories {
      totalCount
    }
    sponsorshipsAsMaintainer {
      totalCount
    }
    sponsorshipsAsSponsor {
      totalCount
    }
    starredRepositories {
      totalCount
    }
  }
}
`
  try {
    const isNodeEnv = isNodeEnvironment()
    let url = "https://api.github.com/graphql"
    if (!isNodeEnv) {
      url = "https://cors-anywhere.herokuapp.com/https://api.github.com/graphql"
    }

    const response = await axios.post(
      url,
      { query: UserQuery },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = response.data.data.user
    if (data.avatarUrl) {
      data.avatarUrl = await imageToBase64(data.avatarUrl)
    }
    return data
  } catch (error) {
    console.error(error)
    throw new Error("Error fetching user data")
  }
}

export default fetchUserData
