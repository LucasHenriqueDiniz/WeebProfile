"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { getSectionPreview } from "@/lib/config/section-previews"

const STEPS = [
  { title: "Conecte", description: "GitHub, Google ou e-mail. Leva 10 segundos." },
  { title: "Escolha plugins", description: "GitHub, anime, música, jogos e mais de uma dúzia de fontes." },
  { title: "Cole no README", description: "Copie o markdown pronto para o topo do seu perfil." },
]

const stars = [
  { top: "10%", left: "6%", size: 2, opacity: 0.3 },
  { top: "82%", left: "92%", size: 1.5, opacity: 0.25 },
  { top: "18%", left: "90%", size: 2, opacity: 0.25 },
]

// Papel de parede decorativo: uma parede de seções reais (mesmos SVGs de preview
// usados no wizard), em grid, jogada em perspectiva/tilt e escurecida atrás do
// conteúdo - a ideia é comunicar "isso tudo é gerado de verdade" com volume, sem
// competir por atenção com o texto. Imagens estáticas (não o PreviewRenderer ao
// vivo): são só papel de parede, não precisam ser interativas nem trocar sozinhas.
const COLLAGE_ITEMS: { plugin: string; section: string; style: "default" | "terminal" }[] = [
  { plugin: "github", section: "calendar", style: "terminal" },
  { plugin: "lastfm", section: "top_artists", style: "default" },
  { plugin: "myanimelist", section: "anime_favorites", style: "terminal" },
  { plugin: "steam", section: "recent_games", style: "default" },
  { plugin: "codewars", section: "rank_honor", style: "terminal" },
  { plugin: "duolingo", section: "current_streak", style: "default" },
  { plugin: "github", section: "favorite_languages", style: "terminal" },
  { plugin: "lastfm", section: "recent_tracks", style: "default" },
  { plugin: "myanimelist", section: "statistics_simple", style: "terminal" },
  { plugin: "stackoverflow", section: "reputation", style: "default" },
  { plugin: "16personalities", section: "personality", style: "terminal" },
  { plugin: "codeforces", section: "rating_rank", style: "default" },
  { plugin: "github", section: "code_habits", style: "default" },
  { plugin: "duolingo", section: "languages_learning", style: "terminal" },
  { plugin: "steam", section: "statistics", style: "terminal" },
  { plugin: "lastfm", section: "top_albums", style: "default" },
]

function PreviewCollageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute left-1/2 top-0 grid w-[170%] grid-cols-4 gap-4 sm:w-[135%] sm:grid-cols-5"
        style={{
          transform: "translateX(-50%) perspective(1000px) rotateX(45deg) rotateZ(-3deg) scale(1.2)",
          transformOrigin: "top center",
        }}
      >
        {COLLAGE_ITEMS.map((item, i) => {
          const src = getSectionPreview(item.plugin, item.section, item.style)
          if (!src) return null
          return (
            <div
              key={`${item.plugin}-${item.section}`}
              className="overflow-hidden rounded-lg border border-white/10 bg-black/40 shadow-2xl"
              style={{ opacity: 0.45 + (i % 3) * 0.1 }}
            >
              <img src={src} alt="" className="block h-auto w-full" />
            </div>
          )
        })}
      </div>

      {/* Vinheta escura - garante legibilidade do texto por cima independente do tema do site */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/60 via-[#05070d]/88 to-[#05070d]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/50 via-transparent to-[#05070d]/50" />
    </div>
  )
}

// Onboarding como um banner imersivo: fundo em perspectiva com seções reais do
// produto (ver PreviewCollageBackground), texto/CTA centralizados por cima. A
// seção fica intencionalmente escura (como o login) independente do tema do
// site - é o mesmo tratamento que o AuthDecoration já usa.
export function DashboardEmptyState() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-2xl px-6 py-16">
      <PreviewCollageBackground />

      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-white"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 1.6, s.opacity] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 max-w-xl text-center"
      >
        <span className="mb-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-transparent">
          Novo por aqui
        </span>
        <h2 className="mb-3 font-heading text-[28px] font-extrabold leading-[1.08] text-white md:text-[36px]">
          Seu primeiro card de perfil começa aqui
        </h2>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
          Conecte GitHub, anime, música, jogos e mais - gere um SVG dinâmico para o topo do seu README que se
          atualiza sozinho.
        </p>

        {/* Passos - lista compacta centralizada, ligados por uma linha vertical */}
        <div className="relative mx-auto mb-8 max-w-sm space-y-4 text-left">
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/30 to-transparent" />
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative -mx-2 flex cursor-default gap-3.5 rounded-lg px-2 py-1 transition-colors duration-200"
              onMouseEnter={() => setActiveStep(i)}
              style={{ background: activeStep === i ? "rgba(124,58,237,0.15)" : "transparent" }}
            >
              <span
                className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-mono font-semibold transition-colors duration-200"
                style={
                  activeStep === i
                    ? { background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderColor: "transparent", color: "#fff" }
                    : { background: "#0a0f1e", borderColor: "rgba(34,211,238,0.4)", color: "#67e8f9" }
                }
              >
                {i + 1}
              </span>
              <div className="pt-1">
                <h4 className="mb-0.5 text-sm font-medium text-white">{step.title}</h4>
                <p className="text-xs leading-relaxed text-white/60">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
            <Link href="/dashboard/new">
              <Sparkles className="h-4 w-4" />
              Criar meu primeiro SVG
            </Link>
          </Button>
          <span className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-xs text-white/60">
            Grátis até 3 SVGs
          </span>
        </div>
      </motion.div>
    </div>
  )
}
