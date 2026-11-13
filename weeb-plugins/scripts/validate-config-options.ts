#!/usr/bin/env tsx
/**
 * Acusa opção de config declarada no metadata que nenhum componente lê.
 *
 * O diálogo de seção do wizard monta os campos a partir de `configOptions`. Se a
 * chave não é consumida por componente nenhum, o campo aparece, aceita valor, é
 * salvo no banco -- e não faz absolutamente nada. O usuário mexe e não entende por
 * que a tela não muda.
 *
 * Foi assim que o MyAnimeList ficou com um `statistics_title` que nada lia (o
 * componente usa `statistics_anime_title` e `statistics_manga_title`) e um
 * `last_activity_hide_title` que nenhum componente respeitava.
 *
 * Uso:
 *   tsx scripts/validate-config-options.ts             # falha se achar orfã
 *   tsx scripts/validate-config-options.ts --warn-only # só avisa
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { PLUGINS_METADATA } from "../src/plugins/metadata"

// Mesmo padrão dos outros scripts daqui: são ES modules, sem __dirname.
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/plugins")
const APENAS_AVISO = process.argv.includes("--warn-only")

/**
 * Lê o código que CONSOME config, não o que a declara.
 *
 * plugin.metadata.ts fica de fora: é onde as opções são declaradas, e incluí-lo faria
 * cada chave encontrar a si mesma. types.ts entra, porque às vezes consome config
 * (github_repo lê os banner_* lá); a declaração dele (`chave?: tipo`) não conta, porque
 * só vale acesso -- ver `lida`.
 */
function codigoConsumidor(plugin: string): string {
  const partes: string[] = []

  const andar = (dir: string) => {
    if (!fs.existsSync(dir)) return
    for (const nome of fs.readdirSync(dir)) {
      const p = path.join(dir, nome)
      if (fs.statSync(p).isDirectory()) {
        if (nome !== "previews") andar(p)
        continue
      }
      if (!/\.tsx?$/.test(nome)) continue
      if (/\.test\.tsx?$/.test(nome)) continue
      if (nome === "plugin.metadata.ts") continue
      partes.push(fs.readFileSync(p, "utf8"))
    }
  }

  andar(path.join(RAIZ, plugin))
  return partes.join("\n")
}

const orfas: string[] = []

/**
 * A opção é lida se o código acessa a chave: `.chave`, a chave inteira entre aspas
 * (`["chave"]`, `readOption(config, "chave")`) ou `{ chave }` num destructuring. Substring pura achava `top_artists_period` dentro de um comentário ou
 * de outra chave, e deixava passar opção que ninguém lê.
 */
function lida(codigo: string, chave: string): boolean {
  const k = chave.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`\\.${k}\\b|["'\`]${k}["'\`]|[{,]\\s*${k}\\s*[,}=:]`).test(codigo)
}

for (const [plugin, meta] of Object.entries(PLUGINS_METADATA as Record<string, any>)) {
  const codigo = codigoConsumidor(plugin)

  for (const secao of meta.sections || []) {
    for (const opcao of secao.configOptions || []) {
      if (!lida(codigo, opcao.key)) {
        orfas.push(
          `${plugin}  ${secao.id}.${opcao.key}  (${opcao.type}, default=${JSON.stringify(opcao.defaultValue)})`
        )
      }
    }
  }
}

if (orfas.length === 0) {
  console.log("✅ Toda opção de config declarada é lida por algum componente.")
  process.exit(0)
}

console.log(`\n⚠️  ${orfas.length} opção(ões) de config que nenhum componente lê:\n`)
orfas.forEach((o) => console.log(`   ${o}`))
console.log(
  "\nCada uma vira um campo no wizard que aceita valor e não muda nada.\n" +
    "Ou implemente a leitura no componente, ou remova a opção do metadata.\n"
)

process.exit(APENAS_AVISO ? 0 : 1)
