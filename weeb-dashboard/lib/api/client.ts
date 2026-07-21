/**
 * API Helpers
 *
 * Funções auxiliares para fazer requisições HTTP de forma limpa e consistente
 */

export interface ApiError {
  error: string
  message?: string
  code?: string
  retryable?: boolean
}

type ClerkBrowserClient = {
  session?: {
    getToken: () => Promise<string | null>
  }
}

async function getClerkAuthorizationHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {}

  const clerk = (window as Window & { Clerk?: ClerkBrowserClient }).Clerk
  const token = await clerk?.session?.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    message?: string
  ) {
    super(message || data.message || data.error || "API Error")
    this.name = "ApiException"
  }
}

/**
 * Faz uma requisição HTTP e retorna os dados parseados
 *
 * @param url - URL da requisição (relativa, será convertida para absoluta)
 * @param options - Opções do fetch
 * @returns Dados da resposta
 * @throws ApiException se a requisição falhar
 */
export async function apiRequest<T = any>(url: string, options?: RequestInit): Promise<T> {
  // Converter URL relativa para absoluta se necessário
  // Isso evita problemas com locale prefix nas rotas de API
  // As rotas de API sempre começam com /api e devem usar URLs absolutas
  let absoluteUrl = url.startsWith("http")
    ? url
    : url.startsWith("/api")
      ? typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : url // No servidor, manter relativa (Next.js resolve corretamente)
      : url

  // Debug: log da URL que está sendo chamada
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("[API] Requesting:", absoluteUrl)
  }

  let response: Response
  try {
    const authorization = await getClerkAuthorizationHeader()
    response = await fetch(absoluteUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authorization,
        ...options?.headers,
      },
    })
  } catch (error) {
    // Se o fetch falhou completamente (ECONNREFUSED, network error, etc)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorCode = (error as any)?.code || ""

    throw new ApiException(
      0,
      {
        error: "Network error",
        message: errorMessage,
        code: errorCode,
      },
      `Failed to fetch: ${errorMessage}`
    )
  }

  // Verificar se a resposta é JSON antes de tentar parsear
  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    // Se não for JSON, pode ser HTML (erro 404, etc)
    const text = await response.text()
    console.error("[API] Non-JSON response received:", {
      url: absoluteUrl,
      status: response.status,
      contentType,
      preview: text.substring(0, 200),
    })
    throw new ApiException(
      response.status,
      { error: "Invalid response format", message: `Expected JSON but got ${contentType}` },
      `API returned non-JSON response (status: ${response.status})`
    )
  }

  const data = (await response.json()) as ApiError

  if (!response.ok) {
    throw new ApiException(response.status, data as ApiError, data.message || data.error || `HTTP ${response.status}`)
  }

  return data as T
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "GET" })
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(url: string, body?: any): Promise<T> {
  return apiRequest<T>(url, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(url: string, body?: any): Promise<T> {
  return apiRequest<T>(url, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(url: string): Promise<T> {
  return apiRequest<T>(url, { method: "DELETE" })
}

/**
 * Profile API helpers
 */
export const profileApi = {
  /**
   * Buscar perfil do usuário
   */
  async get() {
    return apiGet<{ profile: any }>("/api/profile")
  },

  /**
   * Atualizar perfil do usuário
   */
  async update(data: { username?: string; essentialConfigs?: Record<string, any> }) {
    return apiPut<{ profile: any }>("/api/profile", data)
  },

  /**
   * Buscar essential configs do usuário (valores mascarados)
   */
  async getEssentialConfigs(enabledPlugins?: string[]) {
    const params = enabledPlugins && enabledPlugins.length > 0 ? `?enabledPlugins=${enabledPlugins.join(",")}` : ""
    return apiGet<{
      essentialConfigs: Record<string, any>
      missingConfigs: Array<{ pluginName: string; missingKeys: any[] }>
    }>(`/api/profile/essential-configs${params}`)
  },

  /**
   * Atualizar uma essential config específica
   */
  async updateEssentialConfig(plugin: string, key: string, value: string) {
    return apiPut<{ success: boolean }>("/api/profile", {
      essentialConfigs: {
        [plugin]: {
          [key]: value,
        },
      },
    })
  },
}

/**
 * SVG API helpers
 */
export const svgApi = {
  /**
   * Listar SVGs do usuário
   */
  async list() {
    return apiGet<{ svgs: any[] }>("/api/svgs")
  },

  /**
   * Criar novo SVG
   */
  async create(data: any) {
    return apiPost<{ svg: any; created: boolean }>("/api/svgs", data)
  },

  /**
   * Buscar SVG específico
   */
  async get(id: string) {
    return apiGet<{ svg: any }>(`/api/svgs/${id}`)
  },

  /**
   * Atualizar SVG
   */
  async update(id: string, data: any) {
    return apiPut<{ svg: any }>(`/api/svgs/${id}`, data)
  },

  /**
   * Gerar SVG
   * @param id - ID do SVG
   * @param force - Se true, força a geração mesmo com cooldown ativo
   */
  async generate(id: string, force: boolean = false) {
    return apiPost<{ success: boolean; svg: any }>(`/api/svgs/${id}/generate`, { force })
  },

  /**
   * Deletar SVG
   */
  async delete(id: string) {
    return apiDelete<{ success: boolean }>(`/api/svgs/${id}`)
  },
}

export const templateApi = {
  list: () => apiRequest<{ templates: any[] }>("/api/templates"),
  get: (id: string) => apiRequest<{ template: any }>(`/api/templates/${id}`),
  create: (data: any) =>
    apiRequest<{ template: any }>("/api/templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<{ template: any }>(`/api/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/templates/${id}`, {
      method: "DELETE",
    }),
  like: (id: string) =>
    apiRequest<{ like: any }>(`/api/templates/${id}/like`, {
      method: "POST",
    }),
  unlike: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/templates/${id}/like`, {
      method: "DELETE",
    }),
}
