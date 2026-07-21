"use client"

import { Header } from "@/components/layout/Header"
import { motion } from "framer-motion"
import { ReactNode, useEffect, useRef, useState } from "react"
import { ArrowLeft, Columns2, ListFilter, Puzzle, Settings2, Square } from "lucide-react"
import { selectPluginsWithSections } from "@/stores/wizard-selectors"
import { useWizardStore } from "@/stores/wizard-store"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/i18n/use-translations"
import { WizardFooter, type WizardFooterProps } from "./WizardFooter"
import Image from "@/src/compat/next-image"

interface WizardShellProps {
  activeTab: "plugins" | "style"
  onTabChange: (tab: "plugins" | "style") => void
  pluginsList: ReactNode
  pluginDetail: ReactNode
  styleConfig: ReactNode
  preview: ReactNode
  footerProps: WizardFooterProps
  selectedPlugin: string | null
}

// Fluxo mobile/tablet dedicado: nunca 3 colunas espremidas, sempre um passo de cada vez.
type MobileStep = "list" | "detail" | "preview"

export function WizardShell({
  activeTab,
  onTabChange,
  pluginsList,
  pluginDetail,
  styleConfig,
  preview,
  footerProps,
  selectedPlugin,
}: WizardShellProps) {
  const { plugins, pluginsOrder, size, name, setSize } = useWizardStore()
  const t = useTranslations("wizard.plugins")
  const router = useRouter()
  const pluginsWithSections = selectPluginsWithSections({ plugins, pluginsOrder })
  const contentWidth = size === "half" ? 415 : 830
  const [mobileStep, setMobileStep] = useState<MobileStep>("list")
  const detailScrollRef = useRef<HTMLDivElement>(null)

  // Ao trocar de plugin selecionado: volta o painel de detalhe ao topo (novo plugin,
  // novo contexto) e, no mobile, avanca automaticamente para a etapa de configuracao.
  useEffect(() => {
    if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0
    if (selectedPlugin) setMobileStep("detail")
  }, [selectedPlugin])

  const missingCount = footerProps.missingConfigs.length

  const previewArea = (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center justify-between px-4 lg:px-6 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-0.5">
          <button
            onClick={() => setSize("half")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              size === "half" ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Square className="w-3.5 h-3.5" />
            Meia largura
          </button>
          <button
            onClick={() => setSize("full")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              size === "full" ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Columns2 className="w-3.5 h-3.5" />
            Largura completa
          </button>
        </div>
        <span className="text-[11px] font-mono text-slate-500">{contentWidth}px</span>
      </div>

      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* min-h-full (nao items-center no container com overflow-y-auto acima) - centraliza
            quando o conteudo cabe, mas deixa o wrapper crescer com o conteudo quando o SVG e
            mais alto que a area visivel. Centralizar no container com overflow corta o topo
            do conteudo e o torna inacessivel via scroll, fazendo parecer que o header cobre o SVG. */}
        <div className="p-4 lg:p-8 w-full min-h-full flex items-center justify-center">
          {pluginsWithSections.length > 0 ? (
            <div className="w-full max-w-full overflow-x-auto flex justify-center">
              {/* O frame nao declara a propria largura nem padding horizontal - ele so
                  encolhe (w-fit) ao redor do que o LivePreview ja renderiza em 415/830px
                  reais. Antes o frame tinha width:415px + p-4 (16px), então o conteudo
                  interno (tambem fixado em 415px) estourava 17px para fora de cada lado
                  do padding, e a borda visivel nao correspondia aos limites reais do SVG. */}
              <div className="w-fit mx-auto rounded-lg border border-white/10 bg-[#0a0f1e] shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
                {preview}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-5 px-4 text-center"
            >
              <div
                className="relative rounded-lg border border-dashed border-white/10 flex items-center justify-center"
                style={{ width: Math.min(contentWidth, 360), height: 140 }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Image
                    src="/sora/sora_main.png"
                    alt="Sora"
                    width={200}
                    height={200}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                    draggable={false}
                  />
                </motion.div>
              </div>
              <div className="max-w-sm">
                <p className="text-sm font-medium text-foreground mb-1">Seu SVG aparecerá aqui</p>
                <p className="text-sm text-muted-foreground">{t("enablePluginToPreview")}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-dvh bg-[#0a0f1e] relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[radial-gradient(circle,_rgba(6,182,212,0.08),_transparent_65%)]" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[radial-gradient(circle,_rgba(168,85,247,0.07),_transparent_65%)]" />
      </div>

      <Header
        variant="dashboard"
        title={
          <span className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-slate-400 hover:text-slate-200 transition-colors -ml-1 p-1"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {name || "Novo SVG"}
          </span>
        }
        description={pluginsWithSections.length > 0 ? `${pluginsWithSections.length} plugin(s) ativo(s)` : undefined}
        actions={
          <div className="flex items-center gap-2">
            {missingCount > 0 && (
              <span className="hidden sm:inline-flex text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md whitespace-nowrap">
                {missingCount === 1 ? "1 configuração pendente" : `${missingCount} configurações pendentes`}
              </span>
            )}
            <div className="hidden lg:block">
              <WizardFooter {...footerProps} compact />
            </div>
          </div>
        }
      />

      {/* Tab switcher - Plugins/Estilo agora e um controle real do shell, nao escondido
          dentro de uma das colunas. */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 lg:px-6 py-2 border-b border-white/[0.06] bg-white/[0.015]">
        <button
          onClick={() => onTabChange("plugins")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeTab === "plugins" ? "bg-cyan-500/10 text-cyan-300" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Puzzle className="w-3.5 h-3.5" />
          Plugins
        </button>
        <button
          onClick={() => onTabChange("style")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeTab === "style" ? "bg-cyan-500/10 text-cyan-300" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Estilo
        </button>
      </div>

      {/* Mobile/tablet: passos deliberados (Plugins -> Configurar -> Preview), nunca 3
          colunas espremidas nem scroll horizontal como solucao principal. */}
      <div className="lg:hidden flex-shrink-0 flex border-b border-white/[0.06] bg-white/[0.02]">
        {(activeTab === "plugins"
          ? ([
              ["list", "Plugins", Puzzle],
              ["detail", "Configurar", Settings2],
              ["preview", "Preview", ListFilter],
            ] as const)
          : ([
              ["detail", "Estilo", Settings2],
              ["preview", "Preview", ListFilter],
            ] as const)
        ).map(([step, label, Icon]) => (
          <button
            key={step}
            onClick={() => setMobileStep(step)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition-colors",
              mobileStep === step ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400"
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Workspace de tres areas no desktop (plugins | detalhe | preview), duas quando a
          aba Estilo esta ativa (estilo | preview). Larguras fixas por breakpoint em vez de
          grid-template-columns com valores arbitrarios multi-valor, que nao geram regra
          CSS de forma confiavel neste projeto. */}
      <div className="flex-1 flex overflow-hidden">
        {/* As quatro colunas (lista, detalhe, estilo, preview) ficam sempre montadas; a aba
            ativa so alterna qual fica visivel via className. Antes, activeTab==="plugins"
            escolhia entre dois ramos JSX estruturalmente diferentes, entao trocar de aba
            desmontava e remontava o LivePreview inteiro (o SVG "reiniciava" visualmente). */}
        <div className="mx-auto flex w-full max-w-[1700px] overflow-hidden">
          <div
            className={cn(
              "lg:w-64 xl:w-72 lg:flex-shrink-0 lg:border-r border-white/[0.06] lg:overflow-y-auto w-full",
              activeTab === "plugins"
                ? mobileStep === "list"
                  ? "block lg:block"
                  : "hidden lg:block"
                : "hidden"
            )}
          >
            {pluginsList}
          </div>
          <div
            ref={detailScrollRef}
            className={cn(
              "lg:w-[400px] xl:w-[460px] lg:flex-shrink-0 lg:border-r border-white/[0.06] lg:overflow-y-auto w-full",
              activeTab === "plugins"
                ? mobileStep === "detail"
                  ? "block lg:block"
                  : "hidden lg:block"
                : "hidden"
            )}
          >
            {pluginDetail}
          </div>
          <div
            className={cn(
              "lg:w-[460px] xl:w-[600px] lg:flex-shrink-0 lg:border-r border-white/[0.06] lg:overflow-y-auto w-full",
              activeTab === "style"
                ? mobileStep === "detail"
                  ? "block lg:block"
                  : "hidden lg:block"
                : "hidden"
            )}
          >
            <div className="p-4 lg:p-5">{styleConfig}</div>
          </div>
          <div className={cn("flex-1 min-w-0", mobileStep === "preview" ? "block" : "hidden lg:block")}>
            {previewArea}
          </div>
        </div>
      </div>

      {/* Acao principal - persistente no mobile independente do passo ativo. No desktop
          ja vive no header (compact). */}
      <div className="lg:hidden flex-shrink-0 border-t border-white/[0.06] bg-[#0a0f1e] px-4 py-3">
        <WizardFooter {...footerProps} />
      </div>
    </div>
  )
}
