import { ProcessedLanguage } from "./LanguagesData"
import { RepositoriesData } from "./RepositoriesData"
import { UserResponse } from "./UserResponse"

interface GithubDynamicData {
  [key: string]: UserResponse | RepositoriesData | ProcessedLanguage[]
}

interface GithubData extends GithubDynamicData {
  userData: UserResponse
  repositoriesData: RepositoriesData
  languagesData: ProcessedLanguage[]
}

export default GithubData
