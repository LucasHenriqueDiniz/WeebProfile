import logger from "core/utils/logger"
// @TODO - transform in axios because its already in the project
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
    // remove all the <!-- --> comments from the html
    const formattedHtml = data.replace(/<!--.*?-->/g, "")

    const gistApiUrl = `https://api.github.com/gists/${gistId}`
    const response = await fetch(gistApiUrl, {
      method: "PATCH",
      headers: {
        Authorization: `token ${ghToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: gistTitle,
        files: {
          github_profile_charts: {
            content: formattedHtml,
            filename: filename,
            description: `Updated at ${new Date().toISOString()}`,
            type: "text/plain",
          },
        },
      }),
    })

    if (response.status !== 200) {
      throw new Error(`Error updating Gist: ${response.status} - ${response.statusText}`)
    } else {
      logger({ message: "Gist updated successfully", level: "success", __filename })
    }
  } catch (error) {
    logger({ message: `Error updating Gist\n${error}`, level: "error", __filename })
  }
}
