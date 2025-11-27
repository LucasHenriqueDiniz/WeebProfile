/**
 * Script para testar se o mock-data está carregando os dados reais corretamente
 * 
 * Execute: npx tsx src/plugins/github/scripts/test-mock-data.ts
 */

import { getMockGithubData } from '../services/mock-data'

async function testMockData() {
  console.log('🧪 Testando carregamento de dados mock...\n')
  
  try {
    const data = await getMockGithubData()
    
    console.log('✅ Dados carregados com sucesso!\n')
    console.log('📊 Resumo dos dados:')
    console.log(`  - User: ${data.user.login} (${data.user.name})`)
    console.log(`  - Followers: ${data.user.followers}`)
    console.log(`  - Following: ${data.user.following}`)
    console.log(`  - Repositories: ${data.repositories?.totalCount || 0}`)
    console.log(`  - Languages: ${data.languages?.length || 0}`)
    console.log(`  - Calendar contributions: ${data.calendar?.totalContributions || 0}`)
    console.log(`  - Starred repos: ${data.starredRepositories?.totalCount || 0}`)
    console.log(`  - Gists: ${data.gists?.totalCount || 0}`)
    console.log(`  - Recent Activity: ${data.recentActivity?.length || 0}`)
    console.log(`  - Notable Contributions: ${data.notableContributions?.length || 0}`)
    console.log(`  - People: ${data.people?.totalCount || 0}`)
    console.log(`  - Avatar URL: ${data.user.avatarUrl.substring(0, 50)}...`)
    
    // Verificar se está usando dados reais (LucasHenriqueDiniz) ou mock (octocat)
    if (data.user.login === 'LucasHenriqueDiniz') {
      console.log('\n✅ Usando dados REAIS do real-data.json!')
    } else if (data.user.login === 'octocat') {
      console.log('\n⚠️  Usando dados MOCK padrão (real-data.json não encontrado ou não carregado)')
    } else {
      console.log(`\n⚠️  Usando dados de outro usuário: ${data.user.login}`)
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao carregar dados:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testMockData()

