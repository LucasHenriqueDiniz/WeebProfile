export const REPOSITORY_CARD_QUERY = `
query repositoryCard($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    name
    nameWithOwner
    description
    url
    owner {
      login
      avatarUrl
    }
    primaryLanguage {
      name
      color
    }
    stargazerCount
    forkCount
    licenseInfo {
      name
      spdxId
    }
    repositoryTopics(first: 10) {
      nodes {
        topic {
          name
        }
      }
    }
    languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
      totalSize
      edges {
        size
        node {
          name
          color
        }
      }
    }
  }
}
`
