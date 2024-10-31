export type Theme = "light" | "dark"
export type Language = "en" | "es" | "pt-BR"
export const languageArray = ["en", "es", "pt-BR"]

export interface ActionCode {
  name: string
  on: {
    schedule: string
    workflow_dispatch: boolean
  }
  jobs: {
    weeb_profile: {
      runs_on: string
      steps: {
        name: string
        uses: string
        with: Record<string, string | boolean | number>
      }
    }
  }
}
