// import axios from "axios"

// interface AllCommitsDataResponse {
//   totalCommits: number
//   totalLanguages: {
//     name: string
//     color: string
//     size: number
//   }[]
//   commits: {
//     committedDate: string
//     message: string
//   }[]
//   totalAdditions: number
//   totalDeletions: number
//   totalChangedFiles: number
// }

// interface RecentCommitsDataResponse {
//   totalRecentCommits: number
//   totalRecentAdditions: number
//   totalRecentDeletions: number
//   totalRecentChangedFiles: number
//   commits: {
//     committedDate: string
//     message: string
//   }[]
// }

// async function fetchRepositoryCommitCount(owner: string, repo: string, token: string): Promise<number | null> {
//   const query = `
//     query {
//       repository(owner: "${owner}", name: "${repo}") {
//         ...RepoFragment
//       }
//     }

//     fragment RepoFragment on Repository {
//       name
//       defaultBranchRef {
//         name
//         target {
//           ... on Commit {
//             id
//             history {
//               totalCount
//             }
//             additions
//             deletions
//             changedFiles
//           }
//         }
//       }
//     }
//     `

//   const url = "https://api.github.com/graphql"

//   try {
//     const response = await axios.post(
//       url,
//       { query },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )

//     const repositoryData = response.data.data.repository
//     console.log("Repository data: ", repositoryData.defaultBranchRef)
//     if (repositoryData && repositoryData.defaultBranchRef?.target?.history) {
//       return repositoryData.defaultBranchRef.target.history.totalCount
//     } else {
//       return null // Handle the case where the repository or commit history is not found
//     }
//   } catch (error) {
//     console.error("Error fetching repository commit count:", error)
//     throw new Error("Error fetching repository commit count") // Or handle the error more gracefully in your application
//   }
// }

// interface CommitData {
//   oid: string
//   abbreviatedOid: string
//   messageHeadline: string
//   committedDate: string
// }

// async function fetchRepositoryCommits(
//   owner: string,
//   repo: string,
//   expression: string, // Assuming you'll provide the commit expression (e.g., "main")
//   token: string
// ): Promise<CommitData[] | null> {
//   const query = `
//     query ContributorsCommit {
//       repository(owner: "${owner}", name: "${repo}") {
//         object(expression: "${expression}") {
//           ... on Commit {
//             oid
//             abbreviatedOid
//             messageHeadline
//             committedDate
//           }
//         }
//       }
//     }
//     `

//   const url = "https://api.github.com/graphql"

//   try {
//     const response = await axios.post(
//       url,
//       { query },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )

//     const commitData = response.data.data.repository.object
//     if (commitData) {
//       return [
//         {
//           oid: commitData.oid,
//           abbreviatedOid: commitData.abbreviatedOid,
//           messageHeadline: commitData.messageHeadline,
//           committedDate: commitData.committedDate,
//         },
//       ] // Wrap in an array to maintain consistency with potential future pagination
//     } else {
//       return null // Handle the case where the commit is not found
//     }
//   } catch (error) {
//     console.error("Error fetching repository commits:", error)
//     throw new Error("Error fetching repository commits")
//   }
// }
