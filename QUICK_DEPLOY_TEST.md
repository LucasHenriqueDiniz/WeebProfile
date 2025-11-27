# 🚀 Guia Rápido de Deploy de Teste

Este guia é para fazer um deploy rápido e testar se tudo funciona antes de configurar o cron.

## ✅ Pré-requisitos

1. **Build funcionando localmente**: `pnpm build` deve passar sem erros críticos
2. **Conta no Vercel** (para weeb-dashboard)
3. **Conta no Railway** (para svg-generator)
4. **Projeto Supabase** configurado com:
   - Database URL
   - Service Role Key
   - Anon Key

## 📋 Passo a Passo

### 1. Deploy no Railway (svg-generator) - PRIMEIRO

1. **Criar novo projeto no Railway**
   - Conectar repositório GitHub
   - Selecionar o diretório `svg-generator` (ou raiz do monorepo)

2. **Configurar variáveis de ambiente**:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   NODE_ENV=production
   ```

3. **Configurar build/start** (se não detectar automaticamente):
   - Build: `pnpm --filter @weeb/weeb-plugins build && cd svg-generator && pnpm install && pnpm build`
   - Start: `cd svg-generator && pnpm start`

4. **Aguardar deploy** e copiar a URL (ex: `https://your-app.railway.app`)

### 2. Deploy no Vercel (weeb-dashboard)

1. **Criar novo projeto no Vercel**
   - Conectar repositório GitHub
   - Framework: Next.js
   - Root Directory: `weeb-dashboard`

2. **Configurar variáveis de ambiente**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   SVG_GENERATOR_URL=https://your-app.railway.app  # URL do Railway
   CRON_SECRET=opcional_para_testes
   ```

3. **Build Settings** (verificar):
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

4. **Aguardar deploy**

### 3. Aplicar Migrações no Supabase

1. **Via Drizzle Studio** (recomendado):
   ```bash
   cd weeb-dashboard
   pnpm db:studio
   ```
   - Aplicar migrações manualmente

2. **Ou via SQL direto**:
   - Executar os arquivos em `weeb-dashboard/lib/db/migrations/` no Supabase SQL Editor

### 4. Testar Funcionalidades

#### ✅ Teste 1: Autenticação
1. Acessar `https://your-app.vercel.app/login`
2. Fazer login com GitHub
3. Verificar se redireciona para dashboard

#### ✅ Teste 2: Criar SVG
1. No dashboard, criar novo SVG
2. Configurar plugins (GitHub, LastFM, etc)
3. Configurar essential configs (PAT do GitHub, API key do LastFM)
4. Salvar configuração

#### ✅ Teste 3: Gerar SVG
1. Clicar em "Gerar SVG" ou acessar `/api/svgs/[id]/generate` diretamente
2. Verificar se:
   - Status muda para "generating" → "completed"
   - SVG é salvo no Supabase Storage
   - URL do SVG é retornada

#### ✅ Teste 4: Ver SVG no GitHub
1. Copiar URL do SVG (ex: `https://your-app.vercel.app/api/svg/[id]`)
2. Adicionar no README do GitHub:
   ```markdown
   ![WeebProfile](https://your-app.vercel.app/api/svg/[id])
   ```
3. Verificar se o SVG aparece corretamente

#### ✅ Teste 5: Forçar Regeneração
1. No dashboard, clicar em "Regenerar" ou forçar via API
2. Verificar se o SVG é atualizado

## 🐛 Troubleshooting

### Erro: "SVG Generator service not available"
- Verificar se `SVG_GENERATOR_URL` está correto no Vercel
- Verificar se o Railway está rodando
- Testar URL do Railway diretamente no browser (deve retornar erro 405, mas significa que está online)

### Erro: "Database connection failed"
- Verificar `DATABASE_URL` em ambos (Vercel e Railway)
- Verificar se o Supabase permite conexões externas

### Erro: "Essential configs not found"
- Verificar se RLS está configurado corretamente
- Verificar se está salvando essential configs via API route (usa service_role)

### SVG não aparece no GitHub
- Verificar se o SVG foi gerado (status = "completed")
- Verificar URL do SVG diretamente no browser
- Verificar headers CORS se necessário

## 📝 Notas

- **Cron não é necessário** para testes iniciais
- Você pode forçar geração manualmente via dashboard ou API
- O SVG é gerado sob demanda quando você chama `/api/svgs/[id]/generate`
- O SVG é servido em `/api/svg/[id]` (sem 's' no plural)

## ✅ Checklist de Teste

- [ ] Railway deploy funcionando
- [ ] Vercel deploy funcionando
- [ ] Autenticação funcionando
- [ ] Criar SVG funcionando
- [ ] Configurar essential configs funcionando
- [ ] Gerar SVG funcionando
- [ ] SVG aparece no GitHub README
- [ ] Regeneração manual funcionando

## 🎯 Próximos Passos (Depois dos Testes)

1. Configurar Vercel Cron (se quiser regeneração automática)
2. Adicionar monitoramento/alertas
3. Otimizar performance se necessário
4. Adicionar mais testes automatizados

