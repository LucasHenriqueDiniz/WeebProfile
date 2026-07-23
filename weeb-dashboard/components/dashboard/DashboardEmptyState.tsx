"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { PreviewRenderer } from "@/components/preview/PreviewRenderer"

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
// nao e mockup, e o proprio produto rodando em modo preview. Uma seção por vez,
// trocando com slide lateral (ver GeneratedCardPreview).
type PoolItem = { plugin: string; section: string; label: string }
type PreviewStyle = "default" | "terminal"

const POOL: PoolItem[] = [
  { plugin: "github", section: "calendar", label: "GitHub · Calendário" },
  { plugin: "lastfm", section: "recent_tracks", label: "Last.fm · Faixas recentes" },
  { plugin: "myanimelist", section: "statistics_simple", label: "MyAnimeList · Estatísticas" },
  { plugin: "steam", section: "recent_games", label: "Steam · Jogos recentes" },
  { plugin: "github", section: "favorite_languages", label: "GitHub · Linguagens favoritas" },
  { plugin: "lastfm", section: "top_artists", label: "Last.fm · Top artistas" },
  { plugin: "codewars", section: "rank_honor", label: "Codewars · Rank" },
  { plugin: "duolingo", section: "current_streak", label: "Duolingo · Streak" },
  { plugin: "myanimelist", section: "anime_bar", label: "MyAnimeList · Animes" },
]

function ThemeTogglePill({ style, onChange }: { style: PreviewStyle; onChange: (s: PreviewStyle) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5 text-[11px] font-mono">
      {(["terminal", "default"] as const).map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className="relative px-2.5 py-1 rounded-full transition-colors duration-200"
          style={{ color: style === s ? "#0a0f1e" : "#8b8a9a" }}
        >
          {style === s && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{s === "terminal" ? "Terminal" : "Default"}</span>
        </button>
      ))}
    </div>
  )
}

// Card unico imitando o SVG real gerado: em vez de screenshots estáticos por seção
// (que ficavam separados em caixinhas com legenda própria - nada a ver com o card
// real), renderiza o mesmo PreviewRenderer usado no Hero e no wizard.
//
// Uma seção real por vez (nao 3 empilhadas): medido ao vivo, 3 plugins simultâneos
// somavam mais de 1200px de conteúdo real (ex: lista de repositórios completa do
// GitHub), muito além de qualquer frame fixo razoável - resultava em conteúdo cortado
// no meio. Com uma seção por vez a altura fica previsível (a maior gira em torno de
// ~310px), então o frame consegue ter width/height fixos de verdade e o conteúdo só
// desliza *dentro* dele - nunca redimensiona o card nem empurra o layout da tela.
const FRAME_WIDTH = 448
const FRAME_HEADER_HEIGHT = 44
const FRAME_CONTENT_HEIGHT = 400
const ROTATE_INTERVAL_MS = 2200

function GeneratedCardPreview() {
  const [style, setStyle] = useState<PreviewStyle>("default")
  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIndex((v) => (v + 1) % POOL.length), ROTATE_INTERVAL_MS)
    return () => clearInterval(t)
  }, [paused])

  const activeItem = POOL[index]

  const pluginsConfig = useMemo(
    () => ({
      plugins: { [activeItem.plugin]: { enabled: true, sections: [activeItem.section] } },
      pluginsOrder: [activeItem.plugin],
    }),
    [activeItem]
  )

  const isDefault = style === "default"

  return (
    <div
      className="relative"
      style={{ width: FRAME_WIDTH }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Glow decorativo atrás da janela, mesma linguagem visual do Hero */}
      <div className="absolute -inset-10 blur-3xl opacity-60 pointer-events-none -z-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-pink-500/15" />

      <div
        className="rounded-2xl overflow-hidden border shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)] transition-colors duration-500"
        style={{
          width: FRAME_WIDTH,
          borderColor: isDefault ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.09)",
          background: isDefault ? "#ffffff" : "#0a0f1e",
        }}
      >
        {/* Barra de título - altura fixa */}
        <div
          className="flex items-center gap-2 px-4 border-b transition-colors duration-500"
          style={{ height: FRAME_HEADER_HEIGHT, borderColor: isDefault ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6259]/80" />
          <span className="w-2 h-2 rounded-full bg-[#FFC02E]/80" />
          <span className="w-2 h-2 rounded-full bg-[#28C840]/80" />
          <span
            className="ml-2 text-[10px] font-mono transition-colors duration-500"
            style={{ color: isDefault ? "#8b8a9a" : "#6b6a7a" }}
          >
            profile.svg
          </span>
          <div className="ml-auto">
            <ThemeTogglePill style={style} onChange={setStyle} />
          </div>
        </div>

        {/* Área de conteúdo - altura fixa, o card nunca cresce/encolhe. overflow-hidden
            é só uma rede de segurança - com uma seção por vez o conteúdo real fica bem
            abaixo do teto fixado. */}
        <div
          className="flex items-center justify-center overflow-hidden p-3.5"
          style={{ height: FRAME_CONTENT_HEIGHT }}
        >
          <PreviewRenderer
            plugins={pluginsConfig.plugins}
            pluginsOrder={pluginsConfig.pluginsOrder}
            style={style}
            size="half"
            width={415}
            hideTerminalHeader
            sectionTransition="slide"
          />
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3 max-w-[360px] mx-auto leading-relaxed">
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
        className="relative grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 lg:gap-16 items-center py-8 lg:py-12"
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

        {/* Preview - card único imitando o SVG real, com 3 seções que vão trocando */}
        <div className="relative flex items-center justify-center w-full">
          <GeneratedCardPreview />
        </div>
      </motion.div>
    </div>
  )
}
