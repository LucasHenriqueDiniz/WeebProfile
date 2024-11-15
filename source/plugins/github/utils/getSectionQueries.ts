import { Queries } from "../services/queries"

export const SECTION_QUERIES = {
  profile: Queries.PROFILE_QUERY,
  repositories: Queries.REPOSITORIES_QUERY,
  activity: Queries.ACTIVITY_QUERY,
  calendar: Queries.CALENDAR_QUERY,
  favorite_languages: Queries.LANGUAGES_QUERY,
  favorite_license: Queries.REPOSITORIES_QUERY,
} as const
