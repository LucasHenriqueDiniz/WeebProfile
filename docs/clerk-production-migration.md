# Migração do Clerk para instância de produção

Escrito em 15/08/2026, depois de o login em produção falhar de forma reproduzível.
Ver a task "Clerk em instância de DEV em produção" no Todoist.

## Por que

`weebprofile-dashboard.pages.dev` roda hoje uma instância **de desenvolvimento** do
Clerk (`pk_test_...`, frontend API `related-cub-30.clerk.accounts.dev`). Confirmado
em runtime: `instanceEnvironmentType === "development"`, e o próprio Clerk avisa no
console que chaves de dev "should not be used when deploying your application to
production".

Instância de dev depende de cookie **cross-site** para `clerk.accounts.dev`. A partir
de um domínio `.pages.dev` isso é cookie de terceiro. O Brave bloqueia por padrão, e o
resultado é: o OAuth do GitHub completa, os cookies chegam ao domínio, e mesmo assim
`Clerk.session` fica `null` e a aplicação devolve para `/login`. Em `localhost` funciona
porque lá é same-site.

Não está provado que quebra em todo navegador — em Chrome padrão provavelmente entra,
e existem 2 perfis no banco. Mas o mesmo bloqueio atinge Safari (ITP) e o Chrome
conforme cookies de terceiros forem eliminados. Instância de produção usa subdomínio
próprio (`clerk.seudominio.com`), o que torna o cookie **first-party** e remove a
dependência inteira.

---

## Bloqueios — ler antes de começar

### 1. Exige domínio próprio. `pages.dev` não serve.

Instância de produção do Clerk pede registros DNS (CNAME `clerk.<domínio>`), e não há
como adicionar DNS em `pages.dev`. É preciso um domínio que você controle.

Você já tem `lucashdo.com` (é o domínio declarado na chave da Steam Web API). Um
subdomínio como `weebprofile.lucashdo.com` resolve.

Propagação de DNS pode levar até 48h.

### 2. Exige credenciais OAuth próprias para GitHub e Google.

Em dev o Clerk empresta credenciais compartilhadas — é por isso que a tela de
consentimento do GitHub diz **"Authorize Clerk Development & Staging Instances"** e
redireciona para `clerk.shared.lcl.dev`, um domínio comum a todas as instâncias dev.

Em produção isso não existe. É preciso criar:

- um **GitHub OAuth App** (Settings → Developer settings → OAuth Apps)
- um **Google OAuth client** (Google Cloud Console → Credentials)

e colar client id/secret de cada um no Clerk. A callback URL de cada um sai do painel
do Clerk depois que o domínio estiver configurado.

### 3. As instâncias são separadas. Os usuários **não** migram.

Este é o item que morde de verdade, e não é óbvio.

`profiles.user_id`, `svgs.user_id` e `plugin_secrets.user_id` guardam o **ID do Clerk**
como texto. Uma instância nova emite IDs novos. Então, no primeiro login na instância de
produção, você volta como usuário inédito — e os dados atuais ficam órfãos:

| tabela           | linhas hoje | o que acontece                                        |
| ---------------- | ----------- | ----------------------------------------------------- |
| `profiles`       | 2           | órfãos, ninguém mais loga como esses IDs              |
| `svgs`           | 3           | órfãos — e as URLs públicas deles já estão em READMEs |
| `plugin_secrets` | 0           | nada a perder                                         |
| `templates`      | —           | conferir antes, mesma questão de `user_id`            |

Os SVGs continuam sendo **servidos** (o `GET /api/svg/[id]` lê do R2 e não exige sessão),
então nada quebra para quem já colou o markdown. Mas você perde a capacidade de editá-los
pelo dashboard, e o cron continua regenerando SVGs de um dono que não existe mais.

**Remapeamento** (fazer depois do primeiro login na instância nova, e não antes):

```sql
-- 1. Descobrir o ID novo: entrar uma vez no dashboard já em produção e rodar
SELECT user_id, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;

-- 2. Apontar os dados antigos para ele. Substituir os dois valores.
UPDATE svgs            SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';
UPDATE plugin_secrets  SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';

-- 3. O profile antigo vira duplicata: apagar o antigo, não o novo.
--    (profiles.user_id é UNIQUE, então não dá para só dar UPDATE.)
DELETE FROM profiles WHERE user_id = '<ID_ANTIGO>';
```

Com 2 perfis e 3 SVGs isso é trivial. Fica caro se esperarmos crescer.

---

## Passo a passo

Ordem importa: os passos 1–4 podem rodar com produção intacta. Só o passo 6 troca o
ambiente de fato.

1. **Registrar o domínio no Cloudflare Pages.** Custom domain em
   `weebprofile-dashboard` → `weebprofile.lucashdo.com` (ou o que escolher).
   Verificar que o site responde no domínio novo antes de mexer no Clerk.

2. **Criar a instância de produção no Clerk.** Painel do Clerk → alternar para
   Production. Dá para clonar as configurações de dev, mas **conexões SSO, integrações
   e Paths não vêm junto** — refazer à mão.

3. **DNS.** Adicionar os CNAMEs que o painel do Clerk listar (Domains). Esperar
   propagar. Confirmar no próprio painel que os registros aparecem como verificados.

4. **OAuth próprio.** Criar o GitHub OAuth App e o Google OAuth client (ver bloqueio 2)
   e cadastrar as credenciais no Clerk. A tela de consentimento deve passar a dizer o
   nome da **sua** aplicação, não "Clerk Development & Staging Instances" — esse é o
   sinal de que deu certo.

5. **Secret de produção.** A chave secreta é `sk_live_...`:

   ```bash
   cd weeb-dashboard && npx wrangler pages secret put CLERK_SECRET_KEY
   ```

6. **Trocar as chaves públicas no `wrangler.toml`.** Ver o checklist de código abaixo.
   Deploy. Esta é a virada.

7. **Verificar.** Entrar em produção, num navegador com bloqueio de cookies de terceiros
   ligado (Brave serve — foi onde falhou). `window.Clerk.session` precisa existir.

8. **Remapear os dados** com o SQL do bloqueio 3.

9. **Enfim testar o Steam** — era o que estava bloqueado por tudo isso.

---

## Checklist de código

O `wrangler.toml` do dashboard usa `[vars]` (topo) para **produção** e `[env.preview]`
para preview. Hoje os dois têm a mesma `pk_test_` literal.

- [ ] `weeb-dashboard/wrangler.toml:40` — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `pk_live_...`
- [ ] `weeb-dashboard/wrangler.toml:45` — `[env.preview]` **continua** com `pk_test_`
- [ ] `wrangler pages secret put CLERK_SECRET_KEY` com `sk_live_` (produção)

Se o domínio mudar junto, estes apontam para `pages.dev` e ficam obsoletos:

- [ ] `svg-generator/wrangler.toml:51` — `DASHBOARD_URL`
- [ ] `weeb-dashboard/.env.example:34` e `AGENTS.md:242` — `NEXT_PUBLIC_SITE_URL`
- [ ] `README.md:19` e `docs/plugins.md:8`
- [ ] `scripts/generate-plugins-doc.ts:87` — regenera `docs/plugins.md`, mudar aqui também
- [ ] `weeb-plugins/src/plugins/websites/services/site-meta.ts:15` — User-Agent

Não precisa mexer: `functions/api/_shared/return-to.ts` compara **origin** em vez de
prefixo, então acompanha o domínio novo sozinho. O `steam-openid.ts` monta as URLs a
partir do request. Ambos já têm teste.

---

## Rollback

Reverter o `wrangler.toml` para `pk_test_`, refazer o `wrangler pages secret put
CLERK_SECRET_KEY` com a chave de dev, e deployar. A instância de dev continua existindo —
criar a de produção não a destrói.

Se o remapeamento de `user_id` já tiver rodado, ele precisa ser desfeito na mão (trocar
os dois valores do `UPDATE`). Por isso o remapeamento é o **último** passo: até ele, o
rollback é só configuração.
