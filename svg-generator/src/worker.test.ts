import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { D1Database } from "@cloudflare/workers-types"
import worker, { type Env } from "./worker"

/**
 * O `POST /` é o serviço inteiro: tudo o que o dashboard consome passa por aqui.
 * Os testes o invocam direto -- o handler é `fetch(request, env)` e `D1Database` é
 * interface, então workerd só acrescentaria validar o texto de um SELECT.
 */

function db(rows: Array<{ plugin: string; key: string; value: string }> | Error = []): D1Database {
  return {
    prepare: () => ({
      bind: () => ({
        all: async () => {
          if (rows instanceof Error) throw rows
          return { results: rows }
        },
      }),
    }),
  } as unknown as D1Database
}

function env(overrides: Partial<Env> = {}): Env {
  return { DB: db(), SECRETS_ENCRYPTION_KEY: "k", ...overrides } as Env
}

async function post(body: unknown, e: Env = env()) {
  const request = new Request("https://gen/", { method: "POST", body: JSON.stringify(body) })
  const response = await worker.fetch(request, e)
  // O corpo só pode ser lido uma vez; devolvemos as duas formas para o teste
  // poder tanto inspecionar campos quanto varrer o texto inteiro atrás de segredo.
  const text = await response.text()
  return { response, text, body: JSON.parse(text) as any }
}

/** Config mínima que gera de verdade, sem rede: dev usa os dados mock do plugin. */
const validRequest = (extra: Record<string, unknown> = {}) => ({
  style: "default",
  size: "half",
  dev: true,
  plugins: { devto: { enabled: true, sections: ["profile"], username: "someone" } },
  ...extra,
})

beforeEach(() => {
  // Silencia o log estruturado e os console.log herdados da validação/render.
  vi.spyOn(console, "log").mockImplementation(() => {})
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => vi.restoreAllMocks())

describe("POST / — geração", () => {
  it("gera um SVG e devolve as dimensões junto", async () => {
    const { response, body } = await post(validRequest())

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.svg.startsWith("<svg")).toBe(true)
    expect(body.height).toBeGreaterThan(0)
  })

  // O chamador dimensiona o embed no Gist com o width/height do JSON. Se o SVG
  // trouxer outros números no próprio atributo, o card sai cortado ou com sobra.
  it("faz o SVG declarar as mesmas dimensões que o JSON informa", async () => {
    const { body } = await post(validRequest())

    expect(body.svg).toContain(`width="${body.width}"`)
    expect(body.svg).toContain(`height="${body.height}"`)
  })

  it("usa 415px em half e 830px em full", async () => {
    expect((await post(validRequest())).body.width).toBe(415)
    expect((await post(validRequest({ size: "full" }))).body.width).toBe(830)
  })

  // Sempre presentes, não atrás de `debug`: cron e regenerate manual decidem com
  // base nisso se publicam o SVG ou preservam o anterior.
  it("informa degradação de plugin mesmo sem debug pedido", async () => {
    const { body } = await post(validRequest())

    expect(body).toHaveProperty("pluginErrors")
    expect(body.hasErrors).toBe(false)
  })

  it("renderiza vários plugins na ordem pedida", async () => {
    const { body } = await post(
      validRequest({
        plugins: {
          devto: { enabled: true, sections: ["profile"], username: "a" },
          codewars: { enabled: true, sections: ["profile"], username: "b" },
        },
        pluginsOrder: ["codewars", "devto"],
      })
    )

    // Só o corpo: o bloco <style> no topo cita todo plugin registrado, em ordem
    // própria, então procurar o nome no SVG inteiro acharia o CSS, não a render.
    const rendered = body.svg.slice(body.svg.indexOf("</style>"))
    expect(body.success).toBe(true)
    expect(rendered.indexOf('id="codewars-plugin"')).toBeGreaterThan(-1)
    expect(rendered.indexOf('id="codewars-plugin"')).toBeLessThan(rendered.indexOf('id="devto-plugin"'))
  })
})

describe("POST / — rejeição de entrada", () => {
  it("rejeita corpo que não é JSON", async () => {
    const request = new Request("https://gen/", { method: "POST", body: "isto não é json" })
    const response = await worker.fetch(request, env())

    expect(response.status).toBe(400)
    expect(((await response.json()) as any).error).toMatch(/Invalid JSON/)
  })

  it("exige style e size", async () => {
    expect((await post({ plugins: {} })).response.status).toBe(400)
    expect((await post({ style: "default", plugins: {} })).response.status).toBe(400)
  })

  it("recusa gerar um SVG sem nenhum plugin ligado", async () => {
    const { response, body } = await post(validRequest({ plugins: {} }))

    expect(response.status).toBe(400)
    expect(body.error).toMatch(/at least one plugin/i)
  })

  it("recusa plugin ligado sem nenhuma seção", async () => {
    const { response } = await post(validRequest({ plugins: { devto: { enabled: true, sections: [] } } }))

    expect(response.status).toBe(400)
  })

  // Sem isto o plugin falharia lá adiante com erro de API de terceiro, e o usuário
  // não teria como saber que o que faltava era a configuração dele.
  it("nomeia o que falta em vez de deixar o plugin falhar depois", async () => {
    const { response, body } = await post(
      validRequest({ plugins: { github: { enabled: true, sections: ["profile"] } } })
    )

    expect(response.status).toBe(400)
    expect(body.code).toBe("MISSING_REQUIRED_SECRETS")
    expect(body.missing[0].pluginName).toBe("github")
    expect(body.missing[0].missingSecrets.map((s: any) => s.key)).toEqual(["pat"])
    expect(body.missing[0].missingFields.map((f: any) => f.field)).toEqual(["username"])
  })
})

describe("POST / — segredos", () => {
  const SEGREDO = "ghp_valor_que_nunca_pode_sair_daqui"

  // AGENTS.md: essentialConfig/plugin_secrets nunca podem ser serializados numa
  // resposta HTTP. `debug` e `mock` são as duas portas que devolvem a config.
  it("não devolve o valor do segredo nem com debug ligado", async () => {
    const { text } = await post(
      validRequest({
        debug: true,
        essentialConfigs: { github: { pat: SEGREDO } },
        plugins: { github: { enabled: true, sections: ["profile"], username: "someone" } },
      })
    )

    expect(text).not.toContain(SEGREDO)
  })

  it("não devolve o valor do segredo nem com mock ligado", async () => {
    const { text } = await post(
      validRequest({
        mock: true,
        essentialConfigs: { steam: { steamid: SEGREDO } },
        plugins: { steam: { enabled: true, sections: ["profile"] } },
      })
    )

    expect(text).not.toContain(SEGREDO)
  })

  it("busca os segredos do usuário no D1 quando vem userId", async () => {
    const spy = vi.fn(async () => ({ results: [] }))
    const fakeDb = { prepare: () => ({ bind: () => ({ all: spy }) }) } as unknown as D1Database

    await post(validRequest({ userId: "user_1" }), env({ DB: fakeDb }))

    expect(spy).toHaveBeenCalled()
  })

  // D1 fora do ar não é "usuário sem segredos". Sem esta distinção o gerador
  // acusaria segredo faltando que nunca chegou a ser consultado.
  it("responde 503 D1_UNREACHABLE quando o banco falha", async () => {
    const { response, body } = await post(
      validRequest({ userId: "user_1" }),
      env({ DB: db(new Error("D1_ERROR: connection lost")) })
    )

    expect(response.status).toBe(503)
    expect(body.code).toBe("D1_UNREACHABLE")
  })

  it("responde 503 em vez de ler plugin_secrets sem chave de decifragem", async () => {
    const { response, body } = await post(
      validRequest({ userId: "user_1" }),
      env({ SECRETS_ENCRYPTION_KEY: undefined as never })
    )

    expect(response.status).toBe(503)
    expect(body.code).toBe("D1_UNREACHABLE")
  })

  it("não devolve detalhe do erro do D1 contendo o userId", async () => {
    const { text } = await post(
      validRequest({ userId: "user_clerk_abc123" }),
      env({ DB: db(new Error("D1_ERROR: connection lost")) })
    )

    expect(text).not.toContain("user_clerk_abc123")
  })

  // Credencial da aplicação, não do usuário: vale mesmo sem userId, e é isso que
  // permite ao plugin Steam funcionar sem pedir chave a ninguém.
  it("injeta a STEAM_API_KEY da aplicação sem exigir userId", async () => {
    const { response } = await post(
      validRequest({
        plugins: { steam: { enabled: true, sections: ["profile"] } },
        essentialConfigs: { steam: { steamid: "76561198000000000" } },
      }),
      env({ STEAM_API_KEY: "chave_da_aplicacao" })
    )

    // Sem a injeção o Steam cairia na validação de segredo obrigatório.
    expect(response.status).toBe(200)
  })
})

describe("POST / — saneamento de entrada", () => {
  it("remove markup do terminalHeaderText e limita o tamanho", async () => {
    const { body } = await post(
      validRequest({
        style: "terminal",
        terminalHeaderText: "<script>alerta</script>" + "a".repeat(100),
      })
    )

    expect(body.svg).not.toContain("<script>")
  })

  it("aceita fontFamily longa sem quebrar a geração", async () => {
    const { response } = await post(validRequest({ fontFamily: "x".repeat(200) }))

    expect(response.status).toBe(200)
  })
})

describe("rotas", () => {
  it("responde GET /test para checagem de vida", async () => {
    const response = await worker.fetch(new Request("https://gen/test"), env())

    expect(response.status).toBe(200)
    expect(await response.text()).toMatch(/running/i)
  })

  it("rejeita GET na raiz", async () => {
    const response = await worker.fetch(new Request("https://gen/"), env())

    expect(response.status).toBe(405)
  })

  it("responde ao preflight CORS", async () => {
    const response = await worker.fetch(new Request("https://gen/", { method: "OPTIONS" }), env())

    expect(response.status).toBe(200)
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
  })
})

describe("scheduled() — cron", () => {
  /** ctx.waitUntil devolve a promessa para o teste poder esperar o trabalho real. */
  function ctx() {
    const pending: Promise<unknown>[] = []
    return { ctx: { waitUntil: (p: Promise<unknown>) => pending.push(p) } as never, pending }
  }

  async function run(e: Env) {
    const { ctx: c, pending } = ctx()
    await worker.scheduled({} as never, e, c)
    await Promise.all(pending)
  }

  /**
   * Uma Response nova por chamada. Reaproveitar o mesmo objeto faz a segunda
   * leitura lançar "Body has already been read", o que aqui seria indistinguível
   * do dashboard fora do ar -- o loop encerraria cedo e o teste mentiria.
   */
  const respondingWith = (processed: number) =>
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ processed })) as never)

  it("não chama o dashboard sem CRON_SECRET configurado", async () => {
    const spy = vi.spyOn(globalThis, "fetch")

    await run(env())

    expect(spy).not.toHaveBeenCalled()
  })

  it("autentica a chamada ao dashboard com o CRON_SECRET", async () => {
    const spy = respondingWith(0)

    await run(env({ CRON_SECRET: "segredo", DASHBOARD_URL: "https://dash" }))

    const init = spy.mock.calls[0]![1] as RequestInit
    expect(String(spy.mock.calls[0]![0])).toBe("https://dash/api/cron/generate-svgs")
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer segredo")
  })

  // O endpoint gera no máximo 50 por chamada. Um lote cheio significa que pode
  // haver mais na fila, então o cron insiste; um lote parcial encerra.
  it("insiste enquanto vier lote cheio e para no primeiro parcial", async () => {
    let call = 0
    const spy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response(JSON.stringify({ processed: ++call < 3 ? 50 : 7 })) as never)

    await run(env({ CRON_SECRET: "s" }))

    expect(spy).toHaveBeenCalledTimes(3)
  })

  it("para depois de 20 lotes cheios em vez de girar sem fim", async () => {
    const spy = respondingWith(50)

    await run(env({ CRON_SECRET: "s" }))

    expect(spy).toHaveBeenCalledTimes(20)
  })

  it("desiste no primeiro erro de rede em vez de repetir 20 vezes", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))

    await run(env({ CRON_SECRET: "s" }))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
