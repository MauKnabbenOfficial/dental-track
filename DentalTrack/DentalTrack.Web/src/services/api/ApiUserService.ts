import { User } from "@/data/mockData";
import { IUserService } from "../interfaces/IUserService";
import { apiClient, buildQueryString } from "../http";
import { mapApiUserToUser } from "./ApiAuthService";

interface ApiUser {
  id: string;
  nome: string;
  email: string;
  perfilId?: string;
  perfilNome?: string;
  especialidade?: string;
  avatar?: string;
  ativo?: boolean;
  dtCadastro?: string;
}

/**
 * Implementação API do serviço de Usuários
 */
export const ApiUserService: IUserService = {
  async getAll(): Promise<User[]> {
    const data = await apiClient.get<ApiUser[]>("/usuarios");
    return data.map((u) => mapApiUserToUser(u as any) as User);
  },

  async getById(id: string): Promise<User | undefined> {
    try {
      const data = await apiClient.get<ApiUser>(`/usuarios/${id}`);
      return mapApiUserToUser(data as any);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<User, "id">): Promise<User> {
    // send as-is; assume backend accepts similar payload for creation
    return apiClient.post<User>("/usuarios", data);
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
      )
    ) {
      throw new Error("O ID fornecido não é um GUID válido.");
    }

    const updated = await apiClient.put<ApiUser>(`/usuarios/${id}`, data);
    return mapApiUserToUser(updated as any) as User;
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/usuarios/${id}`);
  },

  async getByRole(role: User["role"]): Promise<User[]> {
    const data = await apiClient.get<ApiUser[]>(`/usuarios/perfil/${role}`);
    return data.map((u) => mapApiUserToUser(u as any) as User);
  },

  async getDentists(): Promise<User[]> {
    const data = await apiClient.get<ApiUser[]>("/usuarios/dentistas");
    return data.map((u) => mapApiUserToUser(u as any) as User);
  },
};
