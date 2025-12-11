import { User } from "@/data/mockData";

/**
 * Interface para o serviço de Autenticação
 */
export interface IAuthService {
  /**
   * Realiza login do usuário
   */
  login(email: string, password: string): Promise<AuthResult>;

  /**
   * Realiza logout do usuário
   */
  logout(): Promise<void>;

  /**
   * Obtém o usuário logado atualmente
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Renova o token de autenticação
   */
  refreshToken(): Promise<AuthResult>;

  /**
   * Altera a senha do usuário
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
