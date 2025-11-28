/**
 * GraphQL Queries para GitHub API
 */

export const PROFILE_QUERY = `
query userProfile($login: String!) {
  user(login: $login) {
    name
    login
    avatarUrl
    createdAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            color
            contributionCount
            date
          }
        }
      }
    }
    repositoriesContributedTo {
      totalCount
    }
  }
}
`

export const CALENDAR_QUERY = `
query userCalendar($login: String!, $from: DateTime, $to: DateTime) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            color
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}
`

export const ACTIVITY_QUERY = `
query userActivity($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      totalRepositoriesWithContributedCommits
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      restrictedContributionsCount
    }
    repositoriesContributedTo(includeUserRepositories: true) {
      totalCount
    }
    issueComments {
      totalCount
    }
    organizations {
      totalCount
    }
    following {
      totalCount
    }
    sponsorshipsAsSponsor {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    watching {
      totalCount
    }
    pullRequests(states: OPEN) {
      totalCount
    }
    issues(states: OPEN) {
      totalCount
    }
    gists {
      totalCount
    }
    projects {
      totalCount
    }
  }
}
`

export const LANGUAGES_QUERY = `
query userLanguages($login: String!) {
  user(login: $login) {
    repositories(
      first: 100
      ownerAffiliations: [OWNER]
      isFork: false
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      nodes {
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
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
  }
}
`

export const REPOSITORIES_QUERY = `
query userRepositories($login: String!, $privacy: RepositoryPrivacy) {
  user(login: $login) {
    repositories(
      first: 100
      ownerAffiliations: [OWNER]
      isFork: false
      orderBy: { field: UPDATED_AT, direction: DESC }
      privacy: $privacy
    ) {
      nodes {
        updatedAt
        name
        description
        url
        owner {
          login
        }
        isFork
        forkCount
        watchers {
          totalCount
        }
        stargazers {
          totalCount
        }
        releases {
          totalCount
        }
        deployments {
          totalCount
        }
        environments {
          totalCount
        }
        languages(first: 8) {
          edges {
            size
            node {
              color
              name
            }
          }
        }
        licenseInfo {
          name
          spdxId
        }
        issues_open: issues(states: OPEN) {
          totalCount
        }
        issues_closed: issues(states: CLOSED) {
          totalCount
        }
        pr_open: pullRequests(states: OPEN) {
          totalCount
        }
        pr_closed: pullRequests(states: CLOSED) {
          totalCount
        }
        pr_merged: pullRequests(states: MERGED) {
          totalCount
        }
      }
      totalDiskUsage
    }
    contributionsCollection {
      totalCommitContributions
      totalRepositoriesWithContributedCommits
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
    }
  }
}
`

export const STARRED_REPOSITORIES_QUERY = `
query userStarredRepositories($login: String!) {
  user(login: $login) {
    starredRepositories(first: 20, orderBy: {field: STARRED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        nameWithOwner
        description
        url
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
        updatedAt
      }
    }
  }
}
`

export const GISTS_QUERY = `
query userGists($login: String!) {
  user(login: $login) {
    gists(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        url
        files {
          name
          language {
            name
          }
        }
        updatedAt
        stargazerCount
      }
    }
  }
}
`

export const TOP_REPOSITORIES_QUERY = `
query userTopRepositories($login: String!) {
  user(login: $login) {
    topRepositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
      nodes {
        name
        nameWithOwner
        description
        url
        stargazerCount
        forkCount
        primaryLanguage {
          name
          color
        }
        updatedAt
      }
    }
  }
}
`

export const INTRODUCTION_QUERY = `
query userIntroduction($login: String!) {
  user(login: $login) {
    bio
    location
    company
    websiteUrl
    twitterUsername
  }
}
`

export const RECENT_ACTIVITY_QUERY = `
query userRecentActivity($login: String!) {
  user(login: $login) {
    contributionsCollection {
      commitContributionsByRepository(maxRepositories: 10) {
        repository {
          name
          nameWithOwner
          url
        }
        contributions {
          totalCount
        }
      }
    }
  }
}
`

export const SPONSORSHIPS_QUERY = `
query userSponsorships($login: String!) {
  user(login: $login) {
    sponsorshipsAsSponsor(first: 20) {
      totalCount
      nodes {
        sponsorable {
          ... on User {
            login
            name
            avatarUrl
          }
          ... on Organization {
            login
            name
            avatarUrl
          }
        }
        tier {
          name
          monthlyPriceInDollars
        }
      }
    }
  }
}
`

export const SPONSORS_QUERY = `
query userSponsors($login: String!) {
  user(login: $login) {
    sponsors(first: 20) {
      totalCount
      nodes {
        ... on User {
          login
          name
          avatarUrl
        }
        ... on Organization {
          login
          name
          avatarUrl
        }
      }
    }
  }
}
`

export const FOLLOWERS_QUERY = `
query userFollowers($login: String!, $max: Int!) {
  user(login: $login) {
    followers(first: $max) {
      totalCount
      nodes {
        login
        name
        avatarUrl
      }
    }
  }
}
`

export const REPOSITORY_CONTRIBUTORS_QUERY = `
query repositoryContributors($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 100) {
            nodes {
              author {
                user {
                  login
                  name
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const REPOSITORY_STARGAZERS_QUERY = `
query repositoryStargazers($owner: String!, $repo: String!, $max: Int!) {
  repository(owner: $owner, name: $repo) {
    stargazers(first: $max) {
      totalCount
      nodes {
        login
        name
        avatarUrl
      }
    }
  }
}
`

export const REPOSITORY_WATCHERS_QUERY = `
query repositoryWatchers($owner: String!, $repo: String!, $max: Int!) {
  repository(owner: $owner, name: $repo) {
    watchers(first: $max) {
      totalCount
      nodes {
        login
        name
        avatarUrl
      }
    }
  }
}
`

export const FEATURED_REPOSITORIES_QUERY = `
query featuredRepositories($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    name
    nameWithOwner
    description
    url
    createdAt
    stargazerCount
    forkCount
    issues {
      totalCount
    }
    pullRequests {
      totalCount
    }
    primaryLanguage {
      name
      color
    }
    licenseInfo {
      name
      spdxId
    }
  }
}
`

export const SECTION_QUERIES = {
  profile: PROFILE_QUERY,
  repositories: REPOSITORIES_QUERY,
  activity: ACTIVITY_QUERY,
  calendar: CALENDAR_QUERY,
  favorite_languages: LANGUAGES_QUERY,
  favorite_license: REPOSITORIES_QUERY,
  starred_repositories: STARRED_REPOSITORIES_QUERY,
  gists: GISTS_QUERY,
  top_repositories: TOP_REPOSITORIES_QUERY,
  introduction: INTRODUCTION_QUERY,
  recent_activity: RECENT_ACTIVITY_QUERY,
  sponsorships: SPONSORSHIPS_QUERY,
  sponsors: SPONSORS_QUERY,
} as const

