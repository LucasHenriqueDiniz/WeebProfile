"use client"

import { useState } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

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

// Papel de parede decorativo: cards de perfil reais (os mesmos SVGs completos
// mostrados em /templates, não seções isoladas), em grid, levemente inclinados
// e com uma vinheta suave atrás do conteúdo - comunica "isso tudo é gerado de
// verdade" com volume, sem apagar os cards a ponto de virarem borrão.
const TEMPLATE_PREVIEWS = [
  "/template-previews/4b63b29a-d0da-4363-a061-1f61f6dc9a05.svg",
  "/template-previews/97f42207-3990-4faa-ba99-d105b12061eb.svg",
  "/template-previews/6bfb8f10-e367-4c8e-905c-4f209e13f303.svg",
  "/template-previews/a271c6ac-45a6-4df1-a389-579ed24a516b.svg",
  "/template-previews/e66831e1-abab-4877-ba6a-92cbd0bd17d6.svg",
]

// Repete os 5 templates o suficiente pra preencher uma parede de 12 tiles, sem
// dois iguais lado a lado.
const WALL_TILES = [0, 1, 2, 3, 4, 2, 4, 0, 3, 1, 4, 2].map((i) => TEMPLATE_PREVIEWS[i])

function PreviewCollageBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute left-1/2 top-[-6%] grid w-[150%] grid-cols-3 gap-5 sm:w-[122%] sm:grid-cols-4"
        style={{
          // Perspectiva mais suave (distância maior + rotação menor) do que a primeira
          // tentativa - rotateX 45deg com perspective 1000px distorcia demais e ficava
          // estranho. Isso aqui lê como uma prateleira levemente inclinada, não uma parede
          // caindo pra trás.
          transform: "translateX(-50%) perspective(1800px) rotateX(28deg) rotateZ(-4deg) scale(1.05)",
          transformOrigin: "top center",
        }}
      >
        {WALL_TILES.map((src, i) => (
          <div
            key={i}
            className="h-64 overflow-hidden rounded-xl border border-white/15 shadow-2xl sm:h-72"
            style={{ opacity: 0.75 + (i % 3) * 0.08 }}
          >
            <img src={src} alt="" className="block h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>

      {/* Vinheta - só o suficiente pra legibilidade do texto por cima, sem apagar os
          cards (o problema anterior era escurecer demais e virar um borrão ilegível) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070d]/15 via-[#05070d]/45 to-[#05070d]/92" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/55 via-transparent to-[#05070d]/55" />
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
    <div className="relative flex h-full min-h-[600px] items-center justify-center overflow-hidden rounded-2xl px-6 py-16">
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
        className="relative z-10 max-w-xl rounded-2xl border border-white/10 bg-[#05070d]/75 px-6 py-10 text-center shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md sm:px-10"
      >
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Novo por aqui
          </span>
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
