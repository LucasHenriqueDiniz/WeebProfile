import { ActivityData } from "./ActivityData"
import { CalendarData } from "./CalendarData"
import { CodeHabitsData } from "./CodeHabitsData"
import { ProcessedLanguage } from "./LanguagesData"
import { RepositoriesData } from "./RepositoryData"
import { UserResponse } from "./UserResponse"

interface GithubData {
  user: UserResponse
  activity: ActivityData
  calendar: CalendarData
  languages: ProcessedLanguage[]
  repositories: RepositoriesData
  favoriteLicense: {
    name: string
    count: number
  }
  codeHabits: CodeHabitsData
}

export default GithubData
