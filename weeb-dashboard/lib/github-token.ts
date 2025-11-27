/**
 * Utilitário para obter GitHub Classic Token
 * 
 * Obtém o Classic Token da tabela essential_configs.
 * O Classic Token deve ser configurado pelo usuário através do ProfileConfigModal.
 */

import { db } from './db'
import { essentialConfigs } from './db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * Obtém o GitHub Classic Token do usuário
 * 
 * @param userId - ID do usuário (obrigatório)
 * @returns Classic Token do GitHub ou null se não disponível
 */
export async function getGitHubToken(userId: string): Promise<string | null> {
  if (!userId) {
    return null
  }

  // Buscar Classic Token da tabela essential_configs
  const [config] = await db
    .select({ value: essentialConfigs.value })
    .from(essentialConfigs)
    .where(
      and(
        eq(essentialConfigs.userId, userId),
        eq(essentialConfigs.plugin, 'github'),
        eq(essentialConfigs.key, 'pat')
      )
    )
    .limit(1)
  
  return config?.value || null
}

