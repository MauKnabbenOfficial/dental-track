import { User } from "@/data/mockData";
import { IAuthService, AuthResult } from "../interfaces/IAuthService";
import { apiClient, TokenManager } from "../http";

/**
 * Interface que representa a resposta da API de login (campos em português)
 */
interface LoginApiResponse {
  sucesso: boolean;
  mensagem?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
    perfilId?: string;
    perfilNome?: string;
    especialidade?: string;
    avatar?: string;
    ativo?: boolean;
    dtCadastro?: string;
  };
  token?: string;
  refreshToken?: string;
  expiraEm?: string;
}

/**
 * Map API user (Portuguese fields) to frontend `User` (alias to `Usuario`).
 * We intentionally avoid normalizing enum/text values here — keep API fields as-is.
 */
export function mapApiUserToUser(
  apiUser: LoginApiResponse["usuario"]
): User | undefined {
  if (!apiUser) return undefined;
  return apiUser as unknown as User;
}

/**
 * Implementação API do serviço de Autenticação
 */
export const ApiAuthService: IAuthService = {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await apiClient.post<LoginApiResponse>(
        "/auth/login",
        { email, senha: password },
        { withAuth: false }
      );

      if (!result.sucesso || !result.token) {
        return {
          success: false,
          error: result.mensagem || "Erro ao fazer login",
        };
      }

      // Mapeia usuário da API para formato do frontend (mantendo campos em PT)
      const user = mapApiUserToUser(result.usuario);

      // Salva tokens
      TokenManager.setToken(result.token);
      if (result.refreshToken) {
        TokenManager.setRefreshToken(result.refreshToken);
      }

      if (user) {
        // Nota: não gravamos mais o usuário autenticado em localStorage;
        // mantemos apenas tokens no storage (TokenManager).
      }

      return {
        success: true,
        user,
        token: result.token,
        refreshToken: result.refreshToken,
        expiresAt: result.expiraEm,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout", {});
    } catch {
      // Ignora erro de logout
    } finally {
      TokenManager.clearTokens();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // Sempre busca do backend quando houver token válido (não usamos cache local)
      if (TokenManager.hasValidToken()) {
        const apiResp = await apiClient.get<any>("/auth/me");
        if (apiResp && apiResp.perfilNome) {
          const user = mapApiUserToUser(apiResp as LoginApiResponse["usuario"]);
          return user ?? null;
        }
        return apiResp as User;
      }

      return null;
    } catch {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    if (!TokenManager.hasValidToken()) {
      // Tenta renovar o token
      const refreshResult = await this.refreshToken();
      return refreshResult.success;
    }
    return true;
  },

  async refreshToken(): Promise<AuthResult> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        return { success: false, error: "No refresh token available" };
      }

      const result = await apiClient.post<{
        user: any;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>("/auth/refresh", { refreshToken }, { withAuth: false });

      // Atualiza tokens
      TokenManager.setToken(result.token);
      TokenManager.setRefreshToken(result.refreshToken);
      // map user if needed
      const mappedUser =
        result.user && result.user.perfilNome
          ? mapApiUserToUser(result.user as LoginApiResponse["usuario"])
          : (result.user as User);
      if (mappedUser) {
        localStorage.setItem(
          "dentaltrack_auth_user",
          JSON.stringify(mappedUser)
        );
      }

      return {
        success: true,
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
      };
    } catch (error: any) {
      TokenManager.clearTokens();
      return {
        success: false,
        error: error.message || "Failed to refresh token",
      };
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
