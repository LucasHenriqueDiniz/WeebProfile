/**
 * Hook para gerenciar profile e essential configs
 * Usa o profile-store para cache e evitar fetches desnecessários
 */

import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { useProfileStore } from "@/stores/profile-store"

interface ProfileConfigData {
  profile: {
    username?: string
  } | null
  essentialConfigs: Record<string, Record<string, boolean>> // Apenas status (true/false), não valores
  missingConfigs: Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }>
  loading: boolean
  error: Error | null
}

export function useProfileConfig(enabledPlugins: string[]): ProfileConfigData {
  const { user } = useAuth()
  const { profile, profileLoading, fetchProfile, getEssentialConfigs } = useProfileStore()
  const [essentialConfigs, setEssentialConfigs] = useState<Record<string, Record<string, boolean>>>({})
  const [missingConfigs, setMissingConfigs] = useState<Array<{ pluginName: string; missingKeys: Array<{ key: string; label: string }> }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      // Buscar profile (já tem cache no store)
      await fetchProfile()

      // Buscar essential configs se houver plugins habilitados
      if (enabledPlugins.length > 0) {
        setLoading(true)
        try {
          const result = await getEssentialConfigs(enabledPlugins)
          setEssentialConfigs(result.essentialConfigs)
          setMissingConfigs(result.missingConfigs)
        } catch (error) {
          console.error("Error loading essential configs:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setEssentialConfigs({})
        setMissingConfigs([])
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, enabledPlugins.join(",")]) // Usar string estável como dependência

  return {
    profile,
    essentialConfigs,
    missingConfigs,
    loading: profileLoading || loading,
    error: null, // Store gerencia erros internamente
  }
}

