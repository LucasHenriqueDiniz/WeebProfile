// Layout específico para o wizard - sem sidebar
export default function NewSvgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Retornar children diretamente sem wrapper de sidebar
  return <>{children}</>
}





