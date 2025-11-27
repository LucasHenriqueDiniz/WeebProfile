import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SvgTestState {
  codeWidth: number // Largura do painel de código em porcentagem (0-100)
  setCodeWidth: (width: number) => void
  resetCodeWidth: () => void
}

export const useSvgTestStore = create<SvgTestState>()(
  persist(
    (set) => ({
      codeWidth: 50, // 50% de largura para código, 50% para imagem
      setCodeWidth: (width) => set({ codeWidth: Math.max(20, Math.min(80, width)) }), // Limite entre 20% e 80%
      resetCodeWidth: () => set({ codeWidth: 50 }),
    }),
    {
      name: "svg-test-preferences",
    }
  )
)

