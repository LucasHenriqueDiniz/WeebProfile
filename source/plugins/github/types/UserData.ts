interface UserData {
  avatarUrl: string;
  bio: string;
  company: string;
  createdAt: string;
  email: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  location: string;
  login: string;
  name: string;
  repositoriesContributedTo: {
    totalCount: number;
  };
  gists: {
    totalCount: number;
  };
  packages: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
  sponsorshipsAsMaintainer: {
    totalCount: number;
  };
  sponsorshipsAsSponsor: {
    totalCount: number;
  };
  starredRepositories: {
    totalCount: number;
  };
}

export default UserData;
