"use client"

// Layout para páginas de teste - sem sidebar, igual ao /dashboard/new
export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Retornar children diretamente sem wrapper de sidebar
  return <>{children}</>
}


