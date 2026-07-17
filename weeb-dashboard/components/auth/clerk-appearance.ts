// Aparência do Clerk alinhada ao design system (ver BRAND.md): fundo escuro,
// gradiente cyan/roxo, cartão translúcido combinando com o wrapper decorativo (AuthDecoration).
export const clerkAppearance = {
  variables: {
    colorPrimary: "#06b6d4",
    colorBackground: "transparent",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "rgba(15, 23, 42, 0.7)",
    colorInputText: "#f1f5f9",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none p-0 w-full gap-3",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    footer: "bg-transparent",
    footerAction: "hidden",
    footerActionLink: "text-cyan-400 hover:text-cyan-300 font-medium",
    socialButtons: "gap-2",
    socialButtonsBlockButton:
      "border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100 text-sm font-medium transition py-2",
    socialButtonsBlockButtonText: "text-slate-100 text-sm font-medium",
    dividerRow: "my-2.5",
    dividerLine: "bg-slate-800",
    dividerText: "text-[11px] text-slate-500 bg-slate-950 px-3 py-0.5 rounded-full border border-slate-800",
    formFieldLabel: "text-xs font-medium text-slate-300",
    formFieldInput:
      "rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition",
    formButtonPrimary:
      "rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-sky-500 transition-all hover:scale-[1.01] shadow-[0_0_20px_rgba(56,189,248,0.3)] py-2",
    footerActionText: "text-xs text-slate-500",
    identityPreviewText: "text-slate-200",
    identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
    formResendCodeLink: "text-cyan-400 hover:text-cyan-300",
    otpCodeFieldInput: "border border-slate-800 bg-slate-900/70 text-slate-100",
    formFieldAction: "text-cyan-400 hover:text-cyan-300",
    alternativeMethodsBlockButton: "border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-100",
  },
} as const
