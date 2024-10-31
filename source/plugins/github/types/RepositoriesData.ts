interface RepositoryData {
  updatedAt: string;
  name: string;
  owner: {
    login: string;
  };
  isFork: boolean;
  forkCount: number;
  watchers: {
    totalCount: number;
  };
  stargazers: {
    totalCount: number;
  };
  releases: {
    totalCount: number;
  };
  deployments: {
    totalCount: number;
  };
  environments: {
    totalCount: number;
  };
  languages: {
    edges: {
      size: number;
      node: {
        color: string;
        name: string;
      };
    }[];
  };
  licenseInfo: {
    name: string;
    spdxId: string;
  };
  issues_open: {
    totalCount: number;
  };
  issues_closed: {
    totalCount: number;
  };
  pr_open: {
    totalCount: number;
  };
  pr_closed: {
    totalCount: number;
  };
  pr_merged: {
    totalCount: number;
  };
}

interface RepositoriesData {
  totalForks: number;
  totalWatchers: number;
  totalStars: number;
  totalReleases: number;
  totalDeployments: number;
  totalEnvironments: number;
  totalLanguages: {
    name: string;
    color: string;
    size: number;
  }[];
  favoriteLicense: { name: string; count: number };
  totalIssuesOpen: number;
  totalIssuesClosed: number;
  totalPRsOpen: number;
  totalPRsClosed: number;
  totalPRsMerged: number;
  repositories: RepositoryData[];
}

interface RepositoriesResponse {
  user: {
    repositories: {
      edges: {
        cursor: string;
      }[];
      nodes: {
        updatedAt: string;
        name: string;
        owner: {
          login: string;
        };
        isFork: boolean;
        forkCount: number;
        watchers: {
          totalCount: number;
        };
        stargazers: {
          totalCount: number;
        };
        releases: {
          totalCount: number;
        };
        deployments: {
          totalCount: number;
        };
        environments: {
          totalCount: number;
        };
        languages: {
          edges: {
            size: number;
            node: {
              color: string;
              name: string;
            };
          }[];
        };
        licenseInfo: {
          name: string;
          spdxId: string;
        };
        issues_open: {
          totalCount: number;
        };
        issues_closed: {
          totalCount: number;
        };
        pr_open: {
          totalCount: number;
        };
        pr_closed: {
          totalCount: number;
        };
        pr_merged: {
          totalCount: number;
        };
      }[];
    };
  };
}

export type { RepositoryData, RepositoriesData, RepositoriesResponse };
