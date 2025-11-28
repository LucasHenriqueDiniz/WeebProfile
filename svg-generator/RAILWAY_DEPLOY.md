# Deploy no Railway - Guia Completo

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Repositório GitHub conectado
3. Projeto buildado localmente pelo menos uma vez

## 🚀 Deploy Rápido

### Opção 1: Via Dashboard Railway (Recomendado)

1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `WeebProfile`
5. Railway detecta automaticamente o workspace `svg-generator`
6. Configure as variáveis de ambiente (se necessário)
7. Deploy automático!

### Opção 2: Via Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar projeto
cd svg-generator
railway init

# Deploy
railway up
```

## ⚙️ Configuração

### Variáveis de Ambiente

Railway define automaticamente:
- `PORT` - Porta do servidor (não precisa configurar)
- `NODE_ENV=production` - Em produção

Variáveis opcionais (se necessário):
- `SVG_GENERATOR_PORT` - Porta alternativa (não necessário, Railway usa PORT)

### Build Settings

Railway detecta automaticamente via `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd svg-generator && pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "cd svg-generator && pnpm start"
  }
}
```

## 🔍 Verificação

Após o deploy, você verá:

1. **URL pública** do serviço (ex: `https://svg-generator-production.up.railway.app`)
2. **Logs** em tempo real no dashboard
3. **Status** do serviço (Running/Stopped)

### Testar o Serviço

```bash
curl -X POST https://seu-servico.railway.app \
  -H "Content-Type: application/json" \
  -d '{
    "style": "default",
    "size": "half",
    "plugins": {
      "github": {
        "enabled": true,
        "username": "octocat",
        "sections": ["profile"]
      }
    }
  }'
```

## 🛠️ Desenvolvimento Local

### Rodar Localmente

```bash
# 1. Build do projeto
cd svg-generator
pnpm build

# 2. Rodar servidor
pnpm start

# Ou em modo desenvolvimento (com watch)
pnpm dev:server
```

O servidor estará em `http://localhost:3001`

### Testar Localmente

```bash
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -d '{
    "style": "default",
    "size": "half",
    "plugins": {
      "github": {
        "enabled": true,
        "username": "octocat",
        "sections": ["profile"]
      }
    }
  }'
```

## 📊 Monitoramento

### Logs

Acesse os logs no Railway Dashboard:
- **Deployments** → Selecione deployment → **View Logs**

Ou via CLI:
```bash
railway logs
```

### Métricas

Railway mostra automaticamente:
- CPU usage
- Memory usage
- Network traffic
- Request count

## 🔄 Atualizações

### Deploy Automático

Railway faz deploy automático a cada push na branch conectada.

### Deploy Manual

```bash
railway up
```

## 🐛 Troubleshooting

### Build Fails

1. Verifique que `pnpm` está instalado no Railway (Nixpacks detecta automaticamente)
2. Verifique que `weeb-plugins` está buildado antes
3. Veja os logs: `railway logs`

### Servidor não inicia

1. Verifique que `PORT` está definido (Railway define automaticamente)
2. Verifique os logs para erros
3. Teste localmente primeiro: `pnpm start`

### Erro de dependências

1. Certifique-se que `pnpm-lock.yaml` está commitado
2. Railway usa `pnpm install --frozen-lockfile` automaticamente

## 💰 Custos

### Free Tier

- $5 crédito mensal gratuito
- Sem Puppeteer = muito mais leve
- ~9k requisições/mês = ~$0.58/mês (dentro do free tier)

### Estimativa de Uso

- 1 requisição = ~0.5s CPU
- 9.000 requisições/mês = ~1.25h CPU
- Custo: ~$0.58/mês (bem dentro do free tier)

## 📝 Notas Importantes

- Railway detecta automaticamente o workspace `svg-generator`
- O servidor escuta em `0.0.0.0` quando `RAILWAY_ENVIRONMENT` está definido
- Sem Puppeteer, o serviço é muito mais rápido e leve
- Cálculo de altura é manual e pode ser ajustado em `src/generator/height-calculator.ts`


