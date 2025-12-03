# Configuração de Variáveis de Ambiente no Vercel

## 📋 Variáveis Necessárias

Configure as seguintes variáveis de ambiente no painel do Vercel:

### Variáveis Públicas (acessíveis no browser)

Estas variáveis precisam do prefixo `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase

### Variáveis Privadas (apenas servidor)

Estas variáveis NÃO devem ter o prefixo `NEXT_PUBLIC_`:

- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role do Supabase
- `DATABASE_URL` - URL de conexão PostgreSQL (geralmente a mesma do Supabase)
- `SVG_GENERATOR_URL` - URL do serviço svg-generator (ex: `https://your-svg-generator.railway.app`)
- `CRON_SECRET` - (Opcional) Secret para proteger cron jobs

## 🔧 Como Configurar no Vercel

1. Acesse o painel do Vercel: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Key**: Nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Valor da variável
   - **Environment**: Selecione **Production**, **Preview** e **Development** conforme necessário
5. Clique em **Save**

## ⚠️ Importante

- **NUNCA** adicione o prefixo `NEXT_PUBLIC_` em variáveis privadas (como `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- Variáveis com `NEXT_PUBLIC_` são expostas no código JavaScript do cliente
- Variáveis sem `NEXT_PUBLIC_` são apenas acessíveis no servidor (API routes, Server Components)

## 🔍 Verificar se as Variáveis Estão Configuradas

Após configurar, faça um novo deploy. As variáveis serão carregadas automaticamente.

Se ainda houver problemas, verifique:

1. Se os nomes das variáveis estão exatamente corretos (case-sensitive)
2. Se as variáveis estão habilitadas para o ambiente correto (Production/Preview/Development)
3. Se você fez um novo deploy após adicionar as variáveis

## 📝 Exemplo de Valores

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
SVG_GENERATOR_URL=https://your-svg-generator.railway.app
CRON_SECRET=your-random-secret-key-here
```
