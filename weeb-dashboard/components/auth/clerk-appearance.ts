// Aparência do Clerk alinhada ao design system (ver BRAND.md): fundo escuro (#0a0f1e, igual ao
// cartão em AuthDecoration), gradiente purple/pink/cyan da marca, tipografia Sora/Inter.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#06b6d4",
    colorBackground: "transparent",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "rgba(15, 21, 41, 0.7)",
    colorInputText: "#f1f5f9",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontFamily: "var(--font-body)",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none p-0 w-full gap-4",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    // Clerk's own footer ("Secured by Clerk" / dev-mode notice) ships a dot-grid
    // background-image meant for light surfaces and clashes with the dark card - hide it
    // entirely (our own "Não tem conta?" / "Já tem conta?" links live outside this component).
    footer: "hidden",
    socialButtons: "gap-2.5",
    socialButtonsBlockButton:
      "rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-500/40 text-slate-100 text-sm font-medium transition-all py-2.5",
    socialButtonsBlockButtonText: "text-slate-100 text-sm font-medium",
    dividerRow: "my-1",
    dividerLine: "bg-slate-800",
    dividerText: "text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-500 bg-[#0a0f1e] px-3",
    formFieldLabel: "text-xs font-medium text-slate-300",
    formFieldInput:
      "rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition",
    formButtonPrimary:
      "font-heading rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-bold tracking-wide hover:from-cyan-400 hover:to-purple-400 transition-all hover:scale-[1.01] shadow-[0_0_25px_rgba(56,189,248,0.35)] py-2.5",
    identityPreviewText: "text-slate-200",
    identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
    formResendCodeLink: "text-cyan-400 hover:text-cyan-300",
    otpCodeFieldInput: "border border-slate-800 bg-slate-900/60 text-slate-100 rounded-lg",
    formFieldAction: "text-cyan-400 hover:text-cyan-300",
    alternativeMethodsBlockButton:
      "rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-slate-100",
  },
} as const
