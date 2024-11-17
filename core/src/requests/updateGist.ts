import logger from "source/helpers/logger"
import axios from "axios"

export default async function updateGithubGist(
  gistId: string,
  ghToken: string,
  data: string,
  gistTitle: string,
  filename: string
) {
  logger({ message: "Updating Gist...", level: "info", __filename })

  if (!data || data.length === 0) {
    throw new Error("No data to update Gist with")
  }

  try {
    // Remove all the <!-- --> comments from the html
    const formattedHtml = data.replace(/<!--.*?-->/g, "")

    const response = await axios.patch(
      `https://api.github.com/gists/${gistId}`,
      {
        description: gistTitle,
        files: {
          [filename]: {
            content: formattedHtml,
            filename: filename,
            description: `Updated at ${new Date().toISOString()}`,
            type: "text/plain",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (response.status !== 200) {
      throw new Error(`Error updating Gist: ${response.status} - ${response.statusText}`)
    }

    logger({ message: "Gist updated successfully", level: "success", __filename })
    return response.data
  } catch (error) {
    logger({ message: `Error updating Gist, maybe you should check your token scopes?`, level: "error", __filename })
    throw error
  }
}
