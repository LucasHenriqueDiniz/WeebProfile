import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "@/i18n/navigation"
import LoadingScreen from "@/components/loading/LoadingScreen"
import { Header } from "@/components/layout/Header"
import { UserCircle2, BookMarked } from "lucide-react"
import { useEffect } from "react"

export default function NewArtifactChooserPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [authLoading, user, router])

  if (authLoading) return <LoadingScreen />
  if (!user) return null

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header variant="dashboard" title="Create new" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
          <button
            onClick={() => router.push("/dashboard/new/profile")}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:border-primary hover:bg-primary/5"
          >
            <div className="h-40 w-full overflow-hidden border-b border-border bg-muted/40">
              <img
                src="/template-previews/e66831e1-abab-4877-ba6a-92cbd0bd17d6.svg"
                alt="Exemplo de card de perfil"
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-start gap-3 p-6">
              <UserCircle2 className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-base font-semibold text-foreground">Profile</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Build a complete personal stats image combining code, anime, music and gaming plugins.
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => router.push("/dashboard/new/repository")}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:border-primary hover:bg-primary/5"
          >
            <div className="flex h-40 w-full items-center justify-center overflow-hidden border-b border-border bg-muted/40 p-4">
              <img
                src="/previews/github_repo/default/banner.svg"
                alt="Exemplo de card de repositório"
                className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-start gap-3 p-6">
              <BookMarked className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-base font-semibold text-foreground">Repository</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a standalone card for a single GitHub repository.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
