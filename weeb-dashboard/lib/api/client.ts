/**
 * API Helpers
 * 
 * Funções auxiliares para fazer requisições HTTP de forma limpa e consistente
 */

export interface ApiError {
  error: string
  message?: string
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
 * @param url - URL da requisição
 * @param options - Opções do fetch
 * @returns Dados da resposta
 * @throws ApiException se a requisição falhar
 */
export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiException(
      response.status,
      data as ApiError,
      data.message || data.error || `HTTP ${response.status}`
    )
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
  async update(data: {
    username?: string
    essentialConfigs?: Record<string, any>
  }) {
    return apiPut<{ profile: any }>("/api/profile", data)
  },

  /**
   * Buscar essential configs do usuário (valores mascarados)
   */
  async getEssentialConfigs(enabledPlugins?: string[]) {
    const params = enabledPlugins && enabledPlugins.length > 0
      ? `?enabledPlugins=${enabledPlugins.join(",")}`
      : ""
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
          [key]: value
        }
      }
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
  create: (data: any) => apiRequest<{ template: any }>("/api/templates", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<{ template: any }>(`/api/templates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<{ success: boolean }>(`/api/templates/${id}`, {
    method: "DELETE",
  }),
  like: (id: string) => apiRequest<{ like: any }>(`/api/templates/${id}/like`, {
    method: "POST",
  }),
  unlike: (id: string) => apiRequest<{ success: boolean }>(`/api/templates/${id}/like`, {
    method: "DELETE",
  }),
}












