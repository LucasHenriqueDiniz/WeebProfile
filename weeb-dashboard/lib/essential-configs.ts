/**
 * Utilitários para gerenciar essential configs
 * 
 * Funções para ler/escrever configurações essenciais (API keys, tokens, etc)
 * da tabela essential_configs.
 */

import { db } from './db'
import { essentialConfigs } from './db/schema'
import { eq, and } from 'drizzle-orm'
import type { EssentialConfigs } from './db/types'

/**
 * Obtém todas as configurações essenciais de um usuário
 * 
 * @param userId - ID do usuário
 * @returns Objeto com configurações organizadas por plugin
 */
export async function getUserEssentialConfigs(userId: string): Promise<EssentialConfigs> {
  if (!userId) {
    return {}
  }

  const configs = await db
    .select()
    .from(essentialConfigs)
    .where(eq(essentialConfigs.userId, userId))

  // Converter array de configs para formato EssentialConfigs
  const result: EssentialConfigs = {}
  
  for (const config of configs) {
    if (!result[config.plugin]) {
      result[config.plugin] = {}
    }
    result[config.plugin]![config.key] = config.value
  }

  return result
}

/**
 * Obtém uma configuração específica
 * 
 * @param userId - ID do usuário
 * @param plugin - Nome do plugin ('github', 'lastfm', etc)
 * @param key - Chave da configuração ('pat', 'apiKey', etc)
 * @returns Valor da configuração ou null
 */
export async function getEssentialConfig(
  userId: string,
  plugin: string,
  key: string
): Promise<string | null> {
  if (!userId || !plugin || !key) {
    return null
  }

  const [config] = await db
    .select({ value: essentialConfigs.value })
    .from(essentialConfigs)
    .where(
      and(
        eq(essentialConfigs.userId, userId),
        eq(essentialConfigs.plugin, plugin),
        eq(essentialConfigs.key, key)
      )
    )
    .limit(1)

  return config?.value || null
}

/**
 * Salva ou atualiza uma configuração essencial
 * 
 * @param userId - ID do usuário
 * @param plugin - Nome do plugin
 * @param key - Chave da configuração
 * @param value - Valor da configuração
 */
export async function setEssentialConfig(
  userId: string,
  plugin: string,
  key: string,
  value: string
): Promise<void> {
  if (!userId || !plugin || !key || !value) {
    throw new Error('userId, plugin, key, and value are required')
  }

  // Verificar se já existe
  const [existing] = await db
    .select()
    .from(essentialConfigs)
    .where(
      and(
        eq(essentialConfigs.userId, userId),
        eq(essentialConfigs.plugin, plugin),
        eq(essentialConfigs.key, key)
      )
    )
    .limit(1)

  if (existing) {
    // Atualizar existente
    await db
      .update(essentialConfigs)
      .set({
        value,
        updatedAt: new Date(),
      })
      .where(eq(essentialConfigs.id, existing.id))
  } else {
    // Criar novo
    await db.insert(essentialConfigs).values({
      userId,
      plugin,
      key,
      value,
    })
  }
}

/**
 * Salva múltiplas configurações essenciais de uma vez
 * 
 * @param userId - ID do usuário
 * @param configs - Objeto com configurações organizadas por plugin
 */
export async function setEssentialConfigs(
  userId: string,
  configs: EssentialConfigs
): Promise<void> {
  if (!userId) {
    throw new Error('userId is required')
  }

  // Converter EssentialConfigs para array de (plugin, key, value)
  const configsToSave: Array<{ plugin: string; key: string; value: string }> = []
  
  for (const [plugin, pluginConfigs] of Object.entries(configs)) {
    if (pluginConfigs && typeof pluginConfigs === 'object') {
      for (const [key, value] of Object.entries(pluginConfigs)) {
        if (value && typeof value === 'string') {
          configsToSave.push({ plugin, key, value })
        }
      }
    }
  }

  // Salvar cada configuração (usar upsert via setEssentialConfig)
  for (const { plugin, key, value } of configsToSave) {
    await setEssentialConfig(userId, plugin, key, value)
  }
}

/**
 * Remove uma configuração essencial
 * 
 * @param userId - ID do usuário
 * @param plugin - Nome do plugin
 * @param key - Chave da configuração
 */
export async function deleteEssentialConfig(
  userId: string,
  plugin: string,
  key: string
): Promise<void> {
  if (!userId || !plugin || !key) {
    throw new Error('userId, plugin, and key are required')
  }

  await db
    .delete(essentialConfigs)
    .where(
      and(
        eq(essentialConfigs.userId, userId),
        eq(essentialConfigs.plugin, plugin),
        eq(essentialConfigs.key, key)
      )
    )
}

/**
 * Helper: Obtém o GitHub Classic Token do usuário
 * 
 * @param userId - ID do usuário
 * @returns Classic Token do GitHub ou null se não disponível
 */
export async function getGitHubToken(userId: string): Promise<string | null> {
  return getEssentialConfig(userId, 'github', 'pat')
}

