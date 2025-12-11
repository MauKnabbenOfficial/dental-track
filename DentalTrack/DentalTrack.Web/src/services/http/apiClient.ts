/**
 * Cliente HTTP configurado para comunicação com a API
 * Centraliza configurações, interceptors, tratamento de erros e autenticação
 */

// Configuração base da API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000");

// Chaves de storage
const TOKEN_KEY = "dentaltrack_token";
const REFRESH_TOKEN_KEY = "dentaltrack_refresh_token";

/**
 * Tipos de erro da API
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/**
 * Configuração de requisição
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withAuth?: boolean;
}

/**
 * Gerenciador de tokens
 */
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasValidToken: (): boolean => {
    const token = TokenManager.getToken();
    if (!token) return false;

    try {
      // Decodifica o JWT para verificar expiração
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Converter para ms
      return Date.now() < exp;
    } catch {
      return false;
    }
  },
};

/**
 * Cria headers padrão para requisições
 */
function createHeaders(config?: RequestConfig): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...config?.headers,
  });

  // Adiciona token de autenticação se necessário
  if (config?.withAuth !== false) {
    const token = TokenManager.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

/**
 * Processa resposta da API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Resposta sem conteúdo
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    let error: ApiError;

    if (isJson) {
      const errorData = await response.json();
      error = {
        status: response.status,
        message: errorData.message || errorData.title || "Erro na requisição",
        errors: errorData.errors,
        traceId: errorData.traceId,
      };
    } else {
      error = {
        status: response.status,
        message: response.statusText || "Erro na requisição",
      };
    }

    // Tratamento especial para 401 (não autorizado)
    if (response.status === 401) {
      TokenManager.clearTokens();
      // Redireciona para login se não estiver na página de login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    throw error;
  }

  if (isJson) {
    return response.json();
  }

  return response.text() as unknown as T;
}

/**
 * Executa requisição com timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw {
        status: 408,
        message: "A requisição excedeu o tempo limite",
      } as ApiError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Cliente HTTP principal
 */
export const apiClient = {
  /**
   * Requisição GET
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: createHeaders(config),
      },
      config?.timeout || API_TIMEOUT
    );
    return handleResponse<T>(response);
  },

  /**
   * Requisição POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: createHeaders(config),
        body: data ? JSON.stringify(data) : undefined,
      },
      config?.timeout || API_TIMEOUT
    );
    return handleResponse<T>(response);
  },

  /**
   * Requisição PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: "PUT",
        headers: createHeaders(config),
        body: data ? JSON.stringify(data) : undefined,
      },
      config?.timeout || API_TIMEOUT
    );
    return handleResponse<T>(response);
  },

  /**
   * Requisição PATCH
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: "PATCH",
        headers: createHeaders(config),
        body: data ? JSON.stringify(data) : undefined,
      },
      config?.timeout || API_TIMEOUT
    );
    return handleResponse<T>(response);
  },

  /**
   * Requisição DELETE
   */
  async delete<T = void>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(
      url,
      {
        method: "DELETE",
        headers: createHeaders(config),
      },
      config?.timeout || API_TIMEOUT
    );
    return handleResponse<T>(response);
  },

  /**
   * Upload de arquivo
   */
  async upload<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    config?: RequestConfig
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers = new Headers(config?.headers);

    // Adiciona token de autenticação
    if (config?.withAuth !== false) {
      const token = TokenManager.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // NÃO definir Content-Type para FormData (o browser define automaticamente)

    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers,
        body: formData,
      },
      config?.timeout || API_TIMEOUT * 2 // Mais tempo para uploads
    );
    return handleResponse<T>(response);
  },
};

/**
 * Helper para construir query string
 */
export function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export default apiClient;
