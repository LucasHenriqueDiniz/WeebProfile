#!/usr/bin/env tsx
/**
 * Script para criar 5 templates públicos interessantes no banco de dados
 *
 * Execute: pnpm tsx scripts/create-public-templates.ts
 *
 * Requisitos:
 * - DATABASE_URL configurada no .env
 */

import { config } from "dotenv"
import { resolve } from "path"

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), "weeb-dashboard/.env.local") })
config({ path: resolve(process.cwd(), "weeb-dashboard/.env") })
config({ path: resolve(process.cwd(), ".env") })

import { db } from "../weeb-dashboard/lib/db"
import { templates } from "../weeb-dashboard/lib/db/schema"
import { eq } from "drizzle-orm"

// User ID especial para templates públicos do sistema
const SYSTEM_USER_ID = "system-templates"

// Templates interessantes e realistas que pessoas realmente usariam
const PUBLIC_TEMPLATES = [
  {
    name: "Dev + Anime",
    description: "Perfeito para desenvolvedores otakus: GitHub stats e favoritos do MyAnimeList",
    style: "terminal",
    size: "half",
    theme: "dracula",
    pluginsOrder: "github,myanimelist",
    pluginsConfig: {
      github: {
        enabled: true,
        sections: ["profile", "activity", "repositories", "favorite_languages"],
      },
      myanimelist: {
        enabled: true,
        sections: ["statistics_simple", "anime_favorites", "character_favorites"],
      },
    },
  },
  {
    name: "Music Lover",
    description: "Showcase seu gosto musical e anime favoritos em um perfil elegante",
    style: "default",
    size: "half",
    theme: "purple",
    pluginsOrder: "lastfm,myanimelist",
    pluginsConfig: {
      lastfm: {
        enabled: true,
        sections: ["recent_tracks", "top_artists", "statistics"],
      },
      myanimelist: {
        enabled: true,
        sections: ["statistics", "anime_favorites"],
      },
    },
  },
  {
    name: "Code Master",
    description: "Perfil completo focado em código: GitHub completo com todas as métricas",
    style: "default",
    size: "half",
    theme: "blue",
    pluginsOrder: "github",
    pluginsConfig: {
      github: {
        enabled: true,
        sections: ["profile", "activity", "repositories", "favorite_languages", "code_habits", "top_repositories"],
      },
    },
  },
  {
    name: "Full Weeb Profile",
    description: "O perfil definitivo: GitHub, MyAnimeList e personalidade em um só lugar",
    style: "default",
    size: "half",
    theme: "pink",
    pluginsOrder: "github,myanimelist,16personalities",
    pluginsConfig: {
      github: {
        enabled: true,
        sections: ["profile", "activity", "repositories"],
      },
      myanimelist: {
        enabled: true,
        sections: ["statistics", "anime_favorites", "manga_favorites"],
      },
      "16personalities": {
        enabled: true,
        sections: ["personality"],
      },
    },
  },
  {
    name: "Gaming Dev",
    description: "Combine sua paixão por código e jogos: GitHub stats e perfil Steam",
    style: "terminal",
    size: "half",
    theme: "green",
    pluginsOrder: "github,steam",
    pluginsConfig: {
      github: {
        enabled: true,
        sections: ["profile", "activity", "favorite_languages"],
      },
      steam: {
        enabled: true,
        sections: ["profile", "recent_games", "stats"],
      },
    },
  },
]

async function createPublicTemplates() {
  console.log("🎨 Criando templates públicos...\n")

  try {
    // Deletar templates antigos do sistema se existirem
    const existing = await db.select().from(templates).where(eq(templates.userId, SYSTEM_USER_ID))

    if (existing.length > 0) {
      console.log(`🗑️  Removendo ${existing.length} templates antigos...`)
      for (const template of existing) {
        await db.delete(templates).where(eq(templates.id, template.id))
      }
      console.log("✅ Templates antigos removidos\n")
    }

    // Inserir novos templates
    const createdTemplates = []

    for (const template of PUBLIC_TEMPLATES) {
      console.log(`📝 Criando: ${template.name}`)
      console.log(`   Descrição: ${template.description}`)
      console.log(`   Style: ${template.style}, Theme: ${template.theme}`)
      console.log(`   Plugins: ${template.pluginsOrder}`)

      const [created] = await db
        .insert(templates)
        .values({
          userId: SYSTEM_USER_ID,
          name: template.name,
          description: template.description,
          style: template.style,
          size: template.size,
          theme: template.theme,
          pluginsOrder: template.pluginsOrder,
          pluginsConfig: template.pluginsConfig as any,
          uiConfig: {},
          isPublic: true,
        })
        .returning()

      createdTemplates.push(created)
      console.log(`   ✅ Criado com ID: ${created.id}\n`)
    }

    console.log(`\n✅ Todos os ${createdTemplates.length} templates foram criados com sucesso!`)
    console.log(`\n📋 IDs dos templates criados:`)
    createdTemplates.forEach((t) => {
      console.log(`   - ${t.name}: ${t.id}`)
    })

    return createdTemplates
  } catch (error) {
    console.error("❌ Erro ao criar templates:", error)
    throw error
  }
}

createPublicTemplates()
  .then(() => {
    console.log("\n✅ Script concluído com sucesso!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Erro fatal:", error)
    process.exit(1)
  })
