import { RepositoryData, RepositoriesData, RepositoriesResponse } from "./RepositoriesData";
import { UserData } from "./UserData";

interface githubResponse {
  repositoriesData: RepositoriesData | null;
  userData: UserData | null;
}

export type { RepositoryData, RepositoriesData, RepositoriesResponse, githubResponse, UserData };
