"use server"
import axios from "axios"
import fs from "fs"
import path from "path"
import logger from "source/helpers/logger"
import imageToBase64 from "source/plugins/@utils/imageToBase64"
import { UserResponse } from "../types/UserResponse"

async function fetchUserData(login: string, token: string): Promise<UserResponse> {
  try {
    // Read the GraphQL query file
    const queryPath = path.join(__dirname, "queries", "user.x.graphql")
    const query = fs.readFileSync(queryPath, "utf8")

    const response = await axios.post(
      "https://api.github.com/graphql",
      {
        query: query,
        variables: {
          login: login,
          from: new Date(new Date().getFullYear(), 0, 1).toISOString(), // January 1st of current year
          to: new Date().toISOString(), // Current date
          affiliations: ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data: UserResponse = response.data
    if (data.avatarUrl) {
      data.avatarUrl = await imageToBase64(data.avatarUrl)
    }
    return data
  } catch (error) {
    logger({
      message: `Error fetching user data ${error}`,
      level: "error",
      __filename,
    })
    throw new Error("Error fetching user data")
  }
}

export default fetchUserData
