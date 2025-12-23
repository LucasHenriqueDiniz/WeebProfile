"use client"

import { useEffect } from "react"
import ErrorScreen from "@/components/loading/ErrorScreen"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <ErrorScreen
      title="ERRO"
      message="Algo deu errado. Tente novamente mais tarde."
      showHomeButton={true}
    />
  )
}








