import fs from "fs"
import path from "path"

// Função helper para ler os arquivos GraphQL
function loadGraphQLQuery(filename: string): string {
  return fs.readFileSync(path.join(__dirname, "queries", `${filename}.graphql`), "utf8")
}

// Exportando todas as queries
export const Queries = {
  ACTIVITY_QUERY: loadGraphQLQuery("activity"),
  CALENDAR_QUERY: loadGraphQLQuery("calendar"),
  LANGUAGES_QUERY: loadGraphQLQuery("languages"),
  PROFILE_QUERY: loadGraphQLQuery("profile"),
  REPOSITORIES_QUERY: loadGraphQLQuery("repositories"),
}
