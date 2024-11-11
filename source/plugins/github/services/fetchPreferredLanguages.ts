"use server"
import axios from "axios"
import fs from "fs"
import path from "path"
import logger from "source/helpers/logger"
import { checkIfHasScope } from "./tokenScopes"
import { LanguagesResponse, ProcessedLanguage } from "../types/LanguagesData"

async function fetchPreferredLanguages(login: string, token: string, limit: number = 5): Promise<ProcessedLanguage[]> {
  try {
    // Check if we have the necessary scope
    const hasRepoScope = await checkIfHasScope(token, "repo")

    // Read the GraphQL query file
    const queryPath = path.join(__dirname, "queries", "languages.x.graphql")
    const query = fs.readFileSync(queryPath, "utf8")

    const response = await axios.post<LanguagesResponse>(
      "https://api.github.com/graphql",
      {
        query: query,
        variables: {
          login: login,
          first: 100, // Fetch up to 100 repositories
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Process the languages data
    const languagesMap = new Map<string, { color: string; size: number }>()
    let totalSize = 0

    response.data.data.user.repositories.nodes.forEach((repo) => {
      if (!repo.languages?.edges) return

      repo.languages.edges.forEach((edge) => {
        const { name, color } = edge.node
        const size = edge.size

        if (languagesMap.has(name)) {
          const existing = languagesMap.get(name)!
          languagesMap.set(name, {
            color: existing.color,
            size: existing.size + size,
          })
        } else {
          languagesMap.set(name, { color, size })
        }
        totalSize += size
      })
    })

    // Convert to array and calculate percentages
    const languages: ProcessedLanguage[] = Array.from(languagesMap.entries())
      .map(([name, { color, size }]) => ({
        name,
        color,
        size,
        percentage: (size / totalSize) * 100,
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, limit)

    // Log the scope status and number of languages found
    logger({
      message: `Fetched languages for ${login}. Private repos ${
        hasRepoScope ? "included" : "excluded"
      }. Found ${languages.length} languages.`,
      level: "debug",
      __filename,
    })

    return languages
  } catch (error) {
    logger({
      message: `Error fetching preferred languages: ${error}`,
      level: "error",
      __filename,
    })
    throw new Error("Error fetching preferred languages")
  }
}

export default fetchPreferredLanguages
