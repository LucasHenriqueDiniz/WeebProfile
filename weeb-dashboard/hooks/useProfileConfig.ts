/**
 * Hook para gerenciar profile e essential configs
 * Usa o profile-store para cache e evitar fetches desnecessários
 */

import { useEffect, useState, useMemo, useRef } from "react"
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
  
  // Criar chave estável e ordenada para evitar re-renders desnecessários
  const enabledPluginsKey = useMemo(() => {
    return [...enabledPlugins].sort().join(",")
  }, [enabledPlugins])
  
  // Usar ref para rastrear se já carregamos os dados iniciais
  const hasLoadedInitialData = useRef(false)
  const lastEnabledPluginsKey = useRef<string>("")

  useEffect(() => {
    // Não fazer queries se não houver usuário autenticado
    if (!user) {
      setEssentialConfigs({})
      setMissingConfigs([])
      hasLoadedInitialData.current = false
      return
    }

    // Se a chave não mudou, não fazer nova query
    if (hasLoadedInitialData.current && lastEnabledPluginsKey.current === enabledPluginsKey) {
      return
    }
    
    // Reset flag when plugins change to force refresh
    if (lastEnabledPluginsKey.current !== enabledPluginsKey) {
      hasLoadedInitialData.current = false
    }

    const loadData = async () => {
      try {
        // Buscar profile apenas uma vez ou se não tiver dados em cache
        // O store já tem lógica de cache, então não precisa forçar
        if (!hasLoadedInitialData.current || !profile) {
          await fetchProfile()
        }

        // Buscar essential configs se houver plugins habilitados
        if (enabledPlugins.length > 0) {
          setLoading(true)
          try {
            const result = await getEssentialConfigs(enabledPlugins)
            setEssentialConfigs(result.essentialConfigs)
            setMissingConfigs(result.missingConfigs)
            lastEnabledPluginsKey.current = enabledPluginsKey
            hasLoadedInitialData.current = true
          } catch (error: any) {
            // Tratar erros de autenticação
            if (error?.status === 401 || error?.message?.includes("Unauthorized")) {
              console.warn("Unauthorized: User session may have expired")
              setEssentialConfigs({})
              setMissingConfigs([])
            } else {
              console.error("Error loading essential configs:", error)
            }
          } finally {
            setLoading(false)
          }
        } else {
          setEssentialConfigs({})
          setMissingConfigs([])
          lastEnabledPluginsKey.current = enabledPluginsKey
          hasLoadedInitialData.current = true
        }
      } catch (error: any) {
        // Tratar erros de autenticação no fetchProfile também
        if (error?.status === 401 || error?.message?.includes("Unauthorized")) {
          console.warn("Unauthorized: User session may have expired")
        } else {
          console.error("Error loading profile:", error)
        }
      }
    }

    loadData()
  }, [user, enabledPluginsKey, enabledPlugins, fetchProfile, getEssentialConfigs, profile])

  return {
    profile,
    essentialConfigs,
    missingConfigs,
    loading: profileLoading || loading,
    error: null, // Store gerencia erros internamente
  }
}

