// Aparência do Clerk alinhada ao design system (ver BRAND.md): fundo escuro (#0a0f1e, igual ao
// cartão em AuthDecoration), gradiente purple/pink/cyan da marca, tipografia Sora/Inter.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#06b6d4",
    colorBackground: "transparent",
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorInputBackground: "hsl(var(--muted) / 0.6)",
    colorInputText: "hsl(var(--foreground))",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontFamily: "var(--font-body)",
  },
  elements: {
    rootBox: "w-full",
    // Clerk renders card INSIDE a separate cardBox wrapper that ships its own default
    // box-shadow/border-radius/overflow-hidden (a full modal elevation) - zeroing only
    // `card` (the inner element) left this outer wrapper's shadow forming an invisible
    // panel around the whole form. Both must be neutralized.
    cardBox: "shadow-none bg-transparent border-0 rounded-none overflow-visible",
    card: "bg-transparent shadow-none p-0 w-full gap-4",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    // Clerk's own footer ("Secured by Clerk" / dev-mode notice) ships a dot-grid
    // background-image meant for light surfaces and clashes with the dark card - hide it
    // entirely (our own "Não tem conta?" / "Já tem conta?" links live outside this component).
    footer: "hidden",
    socialButtons: "gap-2.5",
    socialButtonsBlockButton:
      "rounded-xl border border-border bg-muted/60 hover:bg-accent hover:border-cyan-500/40 text-foreground text-sm font-medium transition-all py-2.5",
    socialButtonsBlockButtonText: "text-foreground text-sm font-medium",
    dividerRow: "my-1",
    dividerLine: "bg-border",
    dividerText: "text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground bg-background px-3",
    formFieldLabel: "text-xs font-medium text-muted-foreground",
    formFieldInput:
      "rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition",
    formButtonPrimary:
      "font-heading rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-bold tracking-wide hover:from-cyan-400 hover:to-purple-400 transition-all hover:scale-[1.01] shadow-[0_0_25px_rgba(56,189,248,0.35)] py-2.5",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
    formResendCodeLink: "text-cyan-400 hover:text-cyan-300",
    otpCodeFieldInput: "border border-border bg-muted/60 text-foreground rounded-lg",
    formFieldAction: "text-cyan-400 hover:text-cyan-300",
    alternativeMethodsBlockButton:
      "rounded-xl border border-border bg-muted/60 hover:bg-accent text-foreground",
  },
} as const
