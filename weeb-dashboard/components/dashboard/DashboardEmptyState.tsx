"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Trophy } from "lucide-react"

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

type Variant = {
  id: string
  label: string
  accent: string
  render: "bars" | "wave" | "trophy" | "quote"
}

const VARIANTS: Variant[] = [
  { id: "github", label: "GitHub stats", accent: "#22D3EE", render: "bars" },
  { id: "music", label: "Now playing", accent: "#EC4899", render: "wave" },
  { id: "games", label: "Troféus", accent: "#FBBF24", render: "trophy" },
  { id: "anime", label: "Quote card", accent: "#A78BFA", render: "quote" },
]

function ShowcaseBody({ variant }: { variant: Variant }) {
  if (variant.render === "bars") {
    const heights = [14, 26, 18, 32, 22, 30, 12, 24, 28, 16, 20, 34]
    return (
      <div className="flex items-end gap-1 h-11">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: h, background: i % 3 === 0 ? variant.accent : `${variant.accent}47` }}
          />
        ))}
      </div>
    )
  }
  if (variant.render === "wave") {
    const bars = [6, 14, 22, 30, 20, 26, 12, 18, 28, 16, 10, 24, 20, 8, 30]
    return (
      <div className="flex items-center gap-[3px] h-11">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-sm"
            style={{ height: h, background: variant.accent, opacity: 0.4 + (i % 4) * 0.15 }}
          />
        ))}
      </div>
    )
  }
  if (variant.render === "trophy") {
    return (
      <div className="flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-[11px] border p-2.5 pb-3 bg-white/[0.02]"
            style={{ borderColor: `${variant.accent}40` }}
          >
            <Trophy className="w-4 h-4" style={{ color: variant.accent }} />
            <div className="h-[5px] w-[70%] rounded-full bg-white/10 mt-2" />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="rounded-[11px] border p-3.5 bg-white/[0.02]" style={{ borderColor: `${variant.accent}40` }}>
      <div className="h-2 w-[92%] rounded-full bg-white/10" />
      <div className="h-2 w-[78%] rounded-full bg-white/10 mt-2" />
      <div className="h-2 w-[54%] rounded-full bg-white/10 mt-2 opacity-60" />
    </div>
  )
}

// Preview que roda entre variantes reais (GitHub/música/jogos/anime) para comunicar
// a variedade de plugins sem depender de screenshots reais - mockup deliberado.
function ReadmePreview({ variant, onDotSelect, activeIdx }: { variant: Variant; onDotSelect: (i: number) => void; activeIdx: number }) {
  return (
    <div>
      <div
        className="rounded-lg border overflow-hidden transition-colors duration-500"
        style={{ borderColor: `${variant.accent}33`, background: "#0a0f1e", boxShadow: `0 0 50px ${variant.accent}1a` }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="ml-2 text-[10px] font-mono text-slate-500">preview.svg</span>
          <span
            className="ml-auto text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border transition-colors duration-500"
            style={{ color: variant.accent, borderColor: `${variant.accent}55`, background: `${variant.accent}14` }}
          >
            {variant.label}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 transition-colors duration-500"
              style={{ background: `linear-gradient(135deg, ${variant.accent}, #7C3AED)` }}
            />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-24 rounded-full bg-slate-200/20" />
              <div className="h-1.5 w-16 rounded-full bg-slate-200/10" />
            </div>
          </div>
          <div className="min-h-[44px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <ShowcaseBody variant={variant} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {VARIANTS.map((v, i) => (
          <button
            key={v.id}
            onClick={() => onDotSelect(i)}
            aria-label={v.label}
            className="h-[7px] rounded-full transition-all duration-300"
            style={{ width: i === activeIdx ? 20 : 7, background: i === activeIdx ? v.accent : "rgba(255,255,255,0.14)" }}
          />
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2.5 max-w-[280px] mx-auto leading-relaxed">
        exemplo do SVG gerado - os módulos abaixo são plugins reais do gerador
      </p>
    </div>
  )
}

// Onboarding de tela cheia como uma unica composicao editorial: os passos vivem dentro do
// mesmo bloco narrativo do texto (nao uma segunda secao separada por divisor), o mascote
// tem presenca real atras do preview (sobreposicao controlada), e o fundo reusa o mesmo
// gradiente cyan/violeta + estrelas discretas do login para dar continuidade visual entre
// autenticacao e produto.
export function DashboardEmptyState() {
  const [activeStep, setActiveStep] = useState(0)
  const [variantIdx, setVariantIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setVariantIdx((v) => (v + 1) % VARIANTS.length), 3200)
    return () => clearInterval(t)
  }, [paused])

  const variant = VARIANTS[variantIdx]

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
        className="relative grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-center py-8 lg:py-12"
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

        {/* Preview + mascote com presenca real - sobreposicao controlada, nao decorativo solto */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.img
            src="/sora/sora_main.png"
            alt=""
            className="absolute -right-6 -bottom-10 w-40 md:w-48 h-auto object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)] z-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10 w-full max-w-[340px] -translate-x-4">
            <ReadmePreview variant={variant} activeIdx={variantIdx} onDotSelect={setVariantIdx} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
