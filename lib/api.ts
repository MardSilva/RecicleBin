const API_BASE_URL = "/api"

export interface Coleta {
  id: number
  dia_semana: string
  tipo_coleta: string
  observacao?: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.error || "Erro na API")
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(0, "Erro de conexão com o servidor")
  }
}

export const api = {
  getSemana: async (): Promise<Coleta[]> => {
    const response = await fetchApi<ApiResponse<Coleta[]>>("/semana")
    return response.data || []
  },

  getDia: async (diaSemana: string): Promise<Coleta> => {
    const response = await fetchApi<ApiResponse<Coleta>>(`/dia/${encodeURIComponent(diaSemana)}`)
    if (!response.data) {
      throw new ApiError(404, "Dia não encontrado")
    }
    return response.data
  },

  updateDia: async (diaSemana: string, tipoColeta: string, observacao?: string): Promise<Coleta> => {
    const response = await fetchApi<ApiResponse<Coleta>>(`/dia/${encodeURIComponent(diaSemana)}`, {
      method: "PUT",
      body: JSON.stringify({
        tipo_coleta: tipoColeta,
        observacao: observacao || null,
      }),
    })

    if (!response.data) {
      throw new ApiError(500, "Erro ao atualizar coleta")
    }

    return response.data
  },
}
