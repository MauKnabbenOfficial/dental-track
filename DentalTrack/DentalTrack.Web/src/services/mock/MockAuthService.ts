import { User, users as initialUsers } from "@/data/mockData";
import { IAuthService, AuthResult } from "../interfaces/IAuthService";
import { simulateDelay } from "./mockUtils";

// Chaves de storage para autenticação mock
const AUTH_USER_KEY = "dentaltrack_auth_user";
const AUTH_TOKEN_KEY = "dentaltrack_token";

/**
 * Implementação Mock do serviço de Autenticação
 */
export const MockAuthService: IAuthService = {
  async login(email: string, password: string): Promise<AuthResult> {
    await simulateDelay(500); // Simula tempo de autenticação

    // Credenciais mock
    const validCredentials = [
      { email: "admin@dentaltrack.com", password: "admin", userId: "1" },
      { email: "marina@dentaltrack.com", password: "123456", userId: "2" },
      { email: "joao@dentaltrack.com", password: "123456", userId: "3" },
      { email: "ana@dentaltrack.com", password: "123456", userId: "4" },
    ];

    const credentials = validCredentials.find(
      (c) =>
        c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (!credentials) {
      return {
        success: false,
        error: "Email ou senha inválidos",
      };
    }

    // Busca o usuário
    const storedUsers = localStorage.getItem("dentaltrack_users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : initialUsers;
    const user = users.find((u) => u.id === credentials.userId);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Gera token mock (simples base64)
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    };
    const token = btoa(JSON.stringify(tokenPayload));
    const refreshToken = btoa(
      JSON.stringify({ userId: user.id, type: "refresh" })
    );

    // Salva no storage
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem("dentaltrack_refresh_token", refreshToken);

    return {
      success: true,
      user,
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    };
  },

  async logout(): Promise<void> {
    await simulateDelay(100);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("dentaltrack_refresh_token");
  },

  async getCurrentUser(): Promise<User | null> {
    await simulateDelay(50);
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  },

  async refreshToken(): Promise<AuthResult> {
    await simulateDelay(200);

    const refreshToken = localStorage.getItem("dentaltrack_refresh_token");
    const userStr = localStorage.getItem(AUTH_USER_KEY);

    if (!refreshToken || !userStr) {
      return {
        success: false,
        error: "Sessão expirada. Faça login novamente.",
      };
    }

    try {
      const user: User = JSON.parse(userStr);

      // Gera novo token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const newToken = btoa(JSON.stringify(tokenPayload));

      localStorage.setItem(AUTH_TOKEN_KEY, newToken);

      return {
        success: true,
        user,
        token: newToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      };
    } catch {
      return {
        success: false,
        error: "Erro ao renovar sessão",
      };
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await simulateDelay(300);

    // Mock: apenas simula sucesso se as senhas forem diferentes
    if (currentPassword === newPassword) {
      throw new Error("A nova senha deve ser diferente da atual");
    }

    // Em um cenário real, isso enviaria para a API
    console.log("Senha alterada com sucesso (mock)");
  },
};
