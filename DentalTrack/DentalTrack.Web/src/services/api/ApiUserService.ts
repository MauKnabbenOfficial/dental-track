import { User } from "@/data/mockData";
import { IUserService } from "../interfaces/IUserService";
import { apiClient, buildQueryString } from "../http";

/**
 * Implementação API do serviço de Usuários
 */
export const ApiUserService: IUserService = {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>("/users");
  },

  async getById(id: string): Promise<User | undefined> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<User, "id">): Promise<User> {
    return apiClient.post<User>("/users", data);
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/users/${id}`);
  },

  async getByRole(role: User["role"]): Promise<User[]> {
    const query = buildQueryString({ role });
    return apiClient.get<User[]>(`/users${query}`);
  },

  async getDentists(): Promise<User[]> {
    return this.getByRole("dentist");
  },
};
