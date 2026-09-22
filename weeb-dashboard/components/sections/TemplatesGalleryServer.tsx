import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { TemplateCard } from "@/components/templates/TemplateCard"
import type { Template } from "@/types/template"

interface TemplatesGalleryServerProps {
  templates: Template[]
}

export function TemplatesGalleryServer({ templates }: TemplatesGalleryServerProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          Featured Templates
        </h2>
        <p className="text-lg text-muted-foreground">Discover amazing profiles created by our community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Special card: View all templates */}
        <div>
          <Link href="/templates">
            <Card className="h-full cursor-pointer hover:shadow-2xl transition-all group border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm relative overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center space-y-6 z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 mx-auto shadow-lg shadow-purple-500/25">
                      <Sparkles className="w-10 h-10 text-white drop-shadow-sm" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Explore {templates.length + 10}+ Templates
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                        Browse our complete collection and find your perfect profile
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Regular template cards */}
        {templates.map((template, index) => (
          <TemplateCard key={template.id} template={template} variant="hero" index={index + 1} />
        ))}
      </div>
    </section>
  )
}
