"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Music2, Gamepad2, Trophy, Github as GithubIcon } from "lucide-react"

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

// Miniatura estática representando o resultado (não é screenshot real, é um mockup
// deliberado - evita depender de assets externos e ainda comunica o produto).
function ReadmePreview() {
  return (
    <div className="rounded-lg border border-cyan-500/20 bg-[#0a0f1e] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] font-mono text-slate-500">README.md</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-2 w-24 rounded-full bg-slate-200/20" />
            <div className="h-1.5 w-16 rounded-full bg-slate-200/10" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[GithubIcon, Music2, Gamepad2].map((Icon, i) => (
            <div key={i} className="rounded-md border border-white/5 bg-white/[0.02] p-2 flex flex-col gap-1.5">
              <Icon className="w-3.5 h-3.5 text-cyan-400/70" />
              <div className="h-1.5 w-full rounded-full bg-slate-200/10" />
              <div className="h-1.5 w-2/3 rounded-full bg-slate-200/10" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          <Trophy className="w-3 h-3 text-violet-400/70" />
          <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20" />
        </div>
      </div>
    </div>
  )
}

// Onboarding de tela cheia como uma unica composicao editorial: os passos vivem dentro do
// mesmo bloco narrativo do texto (nao uma segunda secao separada por divisor), o mascote
// tem presenca real atras do preview (sobreposicao controlada), e o fundo reusa o mesmo
// gradiente cyan/violeta + estrelas discretas do login para dar continuidade visual entre
// autenticacao e produto.
export function DashboardEmptyState() {
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
              <div key={step.title} className="relative flex gap-3.5">
                <span className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-[#0a0f1e] border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-mono font-semibold">
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
        <div className="relative flex items-center justify-center">
          <motion.img
            src="/sora/sora_main.png"
            alt=""
            className="absolute -right-6 -bottom-10 w-40 md:w-48 h-auto object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.3)] z-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10 w-full max-w-[340px] -translate-x-4">
            <ReadmePreview />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
