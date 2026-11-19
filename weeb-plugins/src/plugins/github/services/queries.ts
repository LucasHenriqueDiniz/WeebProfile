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
    repositoriesContributedTo(includeUserRepositories: true) {
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

/**
 * No `projects`: GitHub sunset Projects (classic), and asking for it answers `user: null`
 * with a NOT_FOUND error, which took the whole section down for every user.
 */
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
  }
}
`

/**
 * Issues and pull requests by state, for the followup section: one search count per state,
 * the qualifiers built by `followupSearches` in fetchGithub.ts. The idea is the followup
 * plugin of lowlighter/metrics (MIT); the query is written here, not copied.
 */
export const FOLLOWUP_QUERY = `
query userFollowup(
  $issuesOpen: String!
  $issuesClosed: String!
  $prOpen: String!
  $prDraft: String!
  $prMerged: String!
  $prClosed: String!
) {
  issuesOpen: search(query: $issuesOpen, type: ISSUE, first: 0) {
    issueCount
  }
  issuesClosed: search(query: $issuesClosed, type: ISSUE, first: 0) {
    issueCount
  }
  prOpen: search(query: $prOpen, type: ISSUE, first: 0) {
    issueCount
  }
  prDraft: search(query: $prDraft, type: ISSUE, first: 0) {
    issueCount
  }
  prMerged: search(query: $prMerged, type: ISSUE, first: 0) {
    issueCount
  }
  prClosed: search(query: $prClosed, type: ISSUE, first: 0) {
    issueCount
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
        isPrivate
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

/**
 * One page of the user's repositories, for the repositories and favorite_license sections:
 * only the counts they draw. The query asked each of 100 repositories for its languages,
 * releases, deployments, environments and five issue and pull request counts, none of them
 * drawn, and GitHub gave up after 10 s with a 502 for a user with 76 repositories
 * (17/11/2026). This one answers 100 repositories in about 1.5 s.
 */
export const REPOSITORIES_QUERY = `
query userRepositories($login: String!, $privacy: RepositoryPrivacy, $after: String) {
  user(login: $login) {
    repositories(
      first: 100
      after: $after
      ownerAffiliations: [OWNER]
      isFork: false
      orderBy: { field: STARGAZERS, direction: DESC }
      privacy: $privacy
    ) {
      totalCount
      totalDiskUsage
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        stargazerCount
        forkCount
        watchers {
          totalCount
        }
        packages {
          totalCount
        }
        licenseInfo {
          name
        }
      }
    }
    sponsorshipsAsSponsor {
      totalCount
    }
  }
}
`

/**
 * The user's star lists, in GitHub's order (the list a repository was last added to first),
 * and the first repositories of each.
 */
export const STAR_LISTS_QUERY = `
query userStarLists($login: String!) {
  user(login: $login) {
    lists(first: 20) {
      nodes {
        name
        description
        isPrivate
        items(first: 10) {
          totalCount
          nodes {
            ... on Repository {
              isPrivate
              name
              nameWithOwner
              url
              stargazerCount
            }
          }
        }
      }
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
        isPrivate
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
        isPrivate
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
          isPrivate
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
  activity: ACTIVITY_QUERY,
  calendar: CALENDAR_QUERY,
  favorite_languages: LANGUAGES_QUERY,
  starred_repositories: STARRED_REPOSITORIES_QUERY,
  gists: GISTS_QUERY,
  top_repositories: TOP_REPOSITORIES_QUERY,
  introduction: INTRODUCTION_QUERY,
  recent_activity: RECENT_ACTIVITY_QUERY,
  sponsorships: SPONSORSHIPS_QUERY,
  sponsors: SPONSORS_QUERY,
} as const
