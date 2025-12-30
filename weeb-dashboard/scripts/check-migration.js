/**
 * Verifica se a migração de regeneração foi aplicada corretamente
 */

const postgres = require('postgres')
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada')
  process.exit(1)
}

async function checkMigration() {
  const sql = postgres(DATABASE_URL, {
    max: 1,
    ssl: DATABASE_URL.includes("supabase") ? "require" : false,
  })

  try {
    console.log('🔍 Verificando se as colunas de regeneração foram adicionadas...')

    const result = await sql`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'svgs'
        AND column_name IN ('updated_at', 'next_regeneration_at', 'last_payload_hash', 'fail_count', 'last_error', 'is_paused')
      ORDER BY column_name
    `

    const expectedColumns = ['updated_at', 'next_regeneration_at', 'last_payload_hash', 'fail_count', 'last_error', 'is_paused']
    const foundColumns = result.map(row => row.column_name)

    console.log('📋 Colunas encontradas:', foundColumns.join(', '))

    const missing = expectedColumns.filter(col => !foundColumns.includes(col))

    if (missing.length === 0) {
      console.log('✅ Todas as colunas de regeneração foram adicionadas com sucesso!')

      // Verificar índices
      console.log('🔍 Verificando índices...')
      const indexResult = await sql`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'svgs'
          AND indexname LIKE '%regeneration%'
        ORDER BY indexname
      `

      if (indexResult.length > 0) {
        console.log('✅ Índices encontrados:')
        indexResult.forEach(idx => console.log(`  - ${idx.indexname}`))
      } else {
        console.log('⚠️ Nenhum índice de regeneração encontrado')
      }

    } else {
      console.log('❌ Colunas faltando:', missing.join(', '))
    }

  } catch (error) {
    console.error('❌ Erro ao verificar migração:', error.message)
  } finally {
    await sql.end()
  }
}

checkMigration().catch(console.error)
