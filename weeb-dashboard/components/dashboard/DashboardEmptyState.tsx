"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { getSectionPreview } from "@/lib/config/section-previews"

const STEPS = [
  { title: "Conecte", description: "GitHub, Google ou e-mail. Leva 10 segundos." },
  { title: "Escolha plugins", description: "GitHub, anime, música, jogos e mais de uma dúzia de fontes." },
  { title: "Cole no README", description: "Copie o markdown pronto para o topo do seu perfil." },
]

const stars = [
  { top: "6%", left: "8%", size: 2, opacity: 0.25 },
  { top: "85%", left: "4%", size: 1.5, opacity: 0.2 },
  { top: "12%", left: "94%", size: 2, opacity: 0.2 },
]

// Seções reais, geradas pelo mesmo svg-generator usado em produção (dados mock) -
// nao e mockup, e o proprio produto rodando em modo preview.
type Showcase = { plugin: string; section: string; label: string; accent: string }

const SHOWCASE: Showcase[] = [
  { plugin: "github", section: "calendar", label: "GitHub", accent: "#22D3EE" },
  { plugin: "lastfm", section: "recent_tracks", label: "Last.fm", accent: "#EC4899" },
  { plugin: "myanimelist", section: "statistics_simple", label: "MyAnimeList", accent: "#A78BFA" },
  { plugin: "steam", section: "recent_games", label: "Steam", accent: "#F97316" },
]

// Preview lateral: roda entre seções reais do produto (mesmos SVGs mostrados no
// wizard), nao um mockup desenhado a mao - o que o usuário vê aqui é exatamente
// o que ele vai gerar.
function SectionShowcase({
  item,
  onDotSelect,
  activeIdx,
}: {
  item: Showcase
  onDotSelect: (i: number) => void
  activeIdx: number
}) {
  const src = getSectionPreview(item.plugin, item.section, "terminal")

  return (
    <div className="w-full max-w-[420px]">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span
          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border transition-colors duration-500"
          style={{ color: item.accent, borderColor: `${item.accent}55`, background: `${item.accent}14` }}
        >
          {item.label}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">preview.svg</span>
      </div>

      <div className="relative">
        <div
          className="absolute -inset-4 rounded-[24px] blur-2xl transition-colors duration-700 -z-10"
          style={{ background: `radial-gradient(circle, ${item.accent}26 0%, transparent 70%)` }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={item.plugin + item.section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl overflow-hidden border shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
            style={{ borderColor: `${item.accent}30` }}
          >
            {src && <img src={src} alt={`Preview: ${item.label}`} className="block w-full h-auto" />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {SHOWCASE.map((s, i) => (
          <button
            key={s.plugin + s.section}
            onClick={() => onDotSelect(i)}
            aria-label={s.label}
            className="h-[7px] rounded-full transition-all duration-300"
            style={{ width: i === activeIdx ? 20 : 7, background: i === activeIdx ? s.accent : "rgba(255,255,255,0.14)" }}
          />
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2.5 max-w-[300px] mx-auto leading-relaxed">
        seções reais, geradas com dados de exemplo pelo mesmo motor usado em produção
      </p>
    </div>
  )
}

// Onboarding de tela cheia como uma unica composicao editorial: os passos vivem dentro do
// mesmo bloco narrativo do texto (nao uma segunda secao separada por divisor), o preview
// lateral roda entre seções reais do produto (mesmos SVGs do wizard, nao mockup), e o fundo
// reusa o mesmo gradiente cyan/violeta + estrelas discretas do login para dar continuidade
// visual entre autenticacao e produto.
export function DashboardEmptyState() {
  const [activeStep, setActiveStep] = useState(0)
  const [showcaseIdx, setShowcaseIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setShowcaseIdx((v) => (v + 1) % SHOWCASE.length), 3400)
    return () => clearInterval(t)
  }, [paused])

  const showcase = SHOWCASE[showcaseIdx]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-16 left-1/4 w-[30rem] h-[30rem] bg-[radial-gradient(circle,_rgba(6,182,212,0.09),_transparent_65%)] pointer-events-none" />
      <div className="absolute top-10 right-0 w-[26rem] h-[26rem] bg-[radial-gradient(circle,_rgba(168,85,247,0.08),_transparent_65%)] pointer-events-none" />
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 1.6, s.opacity] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-center py-8 lg:py-12"
      >
        {/* Narrativa - headline, passos e CTA no mesmo bloco editorial */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase font-heading bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Novo por aqui
          </span>
          <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold text-foreground mb-3 leading-[1.08] max-w-lg">
            Seu primeiro card de perfil começa aqui
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Conecte GitHub, anime, música, jogos e mais - gere um SVG dinâmico para o topo do seu README que se
            atualiza sozinho.
          </p>

          {/* Passos - parte da narrativa, ligados por uma linha vertical, nao 3 caixas */}
          <div className="relative space-y-5 mb-8 max-w-sm">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-violet-500/30 to-transparent" />
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative flex gap-3.5 -mx-2 px-2 py-1 rounded-lg cursor-default transition-colors duration-200"
                onMouseEnter={() => setActiveStep(i)}
                style={{ background: activeStep === i ? "rgba(124,58,237,0.08)" : "transparent" }}
              >
                <span
                  className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-semibold transition-colors duration-200"
                  style={
                    activeStep === i
                      ? { background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderColor: "transparent", color: "#fff" }
                      : { background: "#0a0f1e", borderColor: "rgba(34,211,238,0.4)", color: "#67e8f9" }
                  }
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h4 className="font-medium text-sm text-foreground mb-0.5">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Button asChild size="lg" className="gap-2 shadow-[0_0_25px_rgba(56,189,248,0.25)]">
              <Link href="/dashboard/new">
                <Sparkles className="w-4 h-4" />
                Criar meu primeiro SVG
              </Link>
            </Button>
            <span className="text-xs font-mono text-muted-foreground border border-border/60 rounded-full px-3 py-1.5">
              Grátis até 3 SVGs
            </span>
          </div>
        </div>

        {/* Preview - seções reais do produto, escala com o espaço disponível */}
        <div
          className="relative flex items-center justify-center w-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <SectionShowcase item={showcase} activeIdx={showcaseIdx} onDotSelect={setShowcaseIdx} />
        </div>
      </motion.div>
    </div>
  )
}
