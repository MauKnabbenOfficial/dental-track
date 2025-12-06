import { User } from "@/data/mockData";
import { IAuthService, AuthResult } from "../interfaces/IAuthService";
import { apiClient, TokenManager } from "../http";

/**
 * Implementação API do serviço de Autenticação
 */
export const ApiAuthService: IAuthService = {
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await apiClient.post<{
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>("/auth/login", { email, password }, { withAuth: false });

      // Salva tokens
      TokenManager.setToken(result.token);
      TokenManager.setRefreshToken(result.refreshToken);
      localStorage.setItem(
        "dentaltrack_auth_user",
        JSON.stringify(result.user)
      );

      return {
        success: true,
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
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
      localStorage.removeItem("dentaltrack_auth_user");
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // Primeiro tenta do cache local
      const cached = localStorage.getItem("dentaltrack_auth_user");
      if (cached) {
        return JSON.parse(cached);
      }

      // Se não tiver cache, busca da API
      if (TokenManager.hasValidToken()) {
        const user = await apiClient.get<User>("/auth/me");
        localStorage.setItem("dentaltrack_auth_user", JSON.stringify(user));
        return user;
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
        user: User;
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>("/auth/refresh", { refreshToken }, { withAuth: false });

      // Atualiza tokens
      TokenManager.setToken(result.token);
      TokenManager.setRefreshToken(result.refreshToken);
      localStorage.setItem(
        "dentaltrack_auth_user",
        JSON.stringify(result.user)
      );

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
