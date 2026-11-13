# Migração do Clerk para instância de produção

Escrito em 15/08/2026, depois de o login em produção falhar de forma reproduzível.
Ver a task "Clerk em instância de DEV em produção" no Todoist.

Revisado em 13/11/2026: o checklist não trocava a chave que o **frontend** usa
(`VITE_CLERK_PUBLISHABLE_KEY`), o remapeamento esquecia `templates` e `template_likes`,
e a autenticação do dashboard mudou (PRs #11 e #12), o que muda o sintoma de uma
virada malfeita — ver o passo 7.

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

| tabela              | linhas em 15/08 | o que acontece                                                  |
| ------------------- | --------------- | --------------------------------------------------------------- |
| `profiles`          | 2               | órfãos, ninguém mais loga como esses IDs                        |
| `svgs`              | 3               | órfãos — e as URLs públicas deles já estão em READMEs           |
| `plugin_secrets`    | 0               | nada a perder                                                   |
| `templates`         | —               | o dono deixa de ver e editar os próprios templates              |
| `template_likes`    | —               | os likes antigos deixam de aparecer como "curtido"              |
| `generation_starts` | —               | irrelevante: só guarda a última regeração manual (piso de 20 s) |

Os números são de agosto. Para ver os de hoje, por dono (só leitura):

```bash
cd weeb-dashboard && pnpm exec wrangler d1 execute weebprofile-db --remote --command "
SELECT user_id,
  (SELECT COUNT(*) FROM svgs s WHERE s.user_id = p.user_id) AS svgs,
  (SELECT COUNT(*) FROM plugin_secrets k WHERE k.user_id = p.user_id) AS secrets,
  (SELECT COUNT(*) FROM templates t WHERE t.user_id = p.user_id) AS templates,
  (SELECT COUNT(*) FROM template_likes l WHERE l.user_id = p.user_id) AS likes
FROM profiles p"
```

Os SVGs continuam sendo **servidos** (o `GET /api/svg/[id]` lê do R2 e não exige sessão),
então nada quebra para quem já colou o markdown. Mas você perde a capacidade de editá-los
pelo dashboard, e o cron continua regenerando SVGs de um dono que não existe mais.

**Remapeamento** (fazer depois do primeiro login na instância nova, e não antes):

```sql
-- 1. Descobrir o ID novo: entrar uma vez no dashboard já em produção e rodar
SELECT user_id, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;

-- 2. Apontar os dados antigos para ele. Substituir os dois valores.
--    Rodar logo depois do primeiro login, ANTES de configurar qualquer coisa na conta
--    nova: plugin_secrets é UNIQUE por (user_id, plugin, key) e template_likes por
--    (user_id, template_id), então um segredo ou like já criado com o ID novo faz o
--    UPDATE falhar por conflito.
UPDATE svgs            SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';
UPDATE plugin_secrets  SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';
UPDATE templates       SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';
UPDATE template_likes  SET user_id = '<ID_NOVO>' WHERE user_id = '<ID_ANTIGO>';
DELETE FROM generation_starts WHERE user_id = '<ID_ANTIGO>';

-- 3. O profile antigo vira duplicata: apagar o antigo, não o novo.
--    (profiles.user_id é UNIQUE, então não dá para só dar UPDATE.)
DELETE FROM profiles WHERE user_id = '<ID_ANTIGO>';
```

Salvar os passos 2 e 3 num arquivo e rodar de uma vez, conferindo antes e depois com a
consulta de contagem acima:

```bash
cd weeb-dashboard && pnpm exec wrangler d1 execute weebprofile-db --remote --file remap.sql
```

Testado num D1 local em 13/11/2026: moveu SVGs, segredos, templates e likes para o ID
novo e apagou o perfil antigo. Com um like já feito pela conta nova no mesmo template, o
arquivo falhou com `UNIQUE constraint failed: template_likes.user_id,
template_likes.template_id` e **nada** mudou (localmente o `--file` foi tudo ou nada; não
achei isso garantido para o `--remote` na doc, por isso a contagem antes e depois). Se
acontecer: apagar a linha duplicada da conta nova e rodar de novo.

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

5. **Chaves de produção no Pages.** São duas, e as duas ficam fora do repo, no ambiente
   de produção do projeto `weebprofile-dashboard`:

   ```bash
   cd weeb-dashboard
   pnpm exec wrangler pages secret put CLERK_SECRET_KEY            # sk_live_...
   pnpm exec wrangler pages secret put VITE_CLERK_PUBLISHABLE_KEY  # pk_live_...
   ```

   A `VITE_CLERK_PUBLISHABLE_KEY` é a que o **frontend** usa: o Vite a embute no build
   (`src/main.tsx`). Hoje ela está lá como secret, com a `pk_test_`. Se só a do
   `wrangler.toml` mudar, o navegador continua pegando token da instância de dev.

6. **Trocar a chave pública no `wrangler.toml`.** Ver o checklist de código abaixo.
   Deploy. Esta é a virada.

7. **Verificar.** Entrar em produção, num navegador com bloqueio de cookies de terceiros
   ligado (Brave serve — foi onde falhou). `window.Clerk.session` precisa existir, e uma
   chamada logada (abrir o dashboard) precisa responder 200.

   Se o login funciona mas **toda** chamada da API volta 401, frontend e backend estão
   em instâncias diferentes: o token foi emitido por uma e validado com as chaves da
   outra (`jwk-kid-mismatch`). Conferir que `VITE_CLERK_PUBLISHABLE_KEY`,
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e `CLERK_SECRET_KEY` são todas da instância de
   produção. Se em vez disso aparecer 500, o motivo está no `error_log`
   (`pnpm --filter weeb-dashboard logs:errors`): a autenticação não engole mais erro de
   configuração do Clerk.

8. **Remapear os dados** com o SQL do bloqueio 3.

9. **Enfim testar o Steam** — era o que estava bloqueado por tudo isso.

---

## Checklist de código

O `wrangler.toml` do dashboard usa `[vars]` (topo) para **produção** e `[env.preview]`
para preview. Hoje os dois têm a mesma `pk_test_` literal.

- [ ] `weeb-dashboard/wrangler.toml:40` — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `pk_live_...`
- [ ] `weeb-dashboard/wrangler.toml:45` — `[env.preview]` **continua** com `pk_test_`
- [ ] Pages, produção: `CLERK_SECRET_KEY` → `sk_live_` (passo 5)
- [ ] Pages, produção: `VITE_CLERK_PUBLISHABLE_KEY` → `pk_live_` (passo 5) — fora do repo, fácil de esquecer

Se o domínio mudar junto, estes apontam para `pages.dev` e ficam obsoletos:

- [ ] `svg-generator/wrangler.toml:61` — `DASHBOARD_URL`
- [ ] `weeb-dashboard/.env.example:34` e `AGENTS.md:242` — `NEXT_PUBLIC_SITE_URL`
- [ ] `README.md:19` e `docs/plugins.md:8`
- [ ] `scripts/generate-plugins-doc.ts:87` — regenera `docs/plugins.md`, mudar aqui também
- [ ] `weeb-plugins/src/plugins/websites/services/site-meta.ts:15` — User-Agent

### Preview

O ambiente de preview do Pages (cada PR) não tem `CLERK_SECRET_KEY` nem
`VITE_CLERK_PUBLISHABLE_KEY`, então login nunca funcionou lá — as páginas públicas
funcionam desde o PR #12. Ele também usa o **mesmo D1 de produção**: um PR com bug de
escrita mexe em dados reais. Nenhum dos dois muda com esta migração; ficam anotados.

Não precisa mexer: `functions/api/_shared/return-to.ts` compara **origin** em vez de
prefixo, então acompanha o domínio novo sozinho. O `steam-openid.ts` monta as URLs a
partir do request. Ambos já têm teste.

---

## Rollback

Reverter o `wrangler.toml` para `pk_test_`, refazer os dois `wrangler pages secret put`
do passo 5 (`CLERK_SECRET_KEY` e `VITE_CLERK_PUBLISHABLE_KEY`) com as chaves de dev, e
deployar. A instância de dev continua existindo —
criar a de produção não a destrói.

Se o remapeamento de `user_id` já tiver rodado, ele precisa ser desfeito na mão (trocar
os dois valores do `UPDATE`). Por isso o remapeamento é o **último** passo: até ele, o
rollback é só configuração.
