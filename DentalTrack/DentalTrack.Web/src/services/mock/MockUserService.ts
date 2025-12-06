import { User, users as initialUsers } from "@/data/mockData";
import { IUserService } from "../interfaces/IUserService";
import { MockStorage, simulateDelay } from "./mockUtils";

const storage = new MockStorage<User>("dentaltrack_users", initialUsers);

/**
 * Implementação Mock do serviço de Usuários
 */
export const MockUserService: IUserService = {
  async getAll(): Promise<User[]> {
    await simulateDelay();
    return storage.getAll();
  },

  async getById(id: string): Promise<User | undefined> {
    await simulateDelay();
    return storage.getById(id);
  },

  async create(data: Omit<User, "id">): Promise<User> {
    await simulateDelay();
    return storage.create(data);
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    await simulateDelay();
    return storage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    storage.delete(id);
  },

  async getByRole(role: User["role"]): Promise<User[]> {
    await simulateDelay();
    return storage.getAll().filter((user) => user.role === role);
  },

  async getDentists(): Promise<User[]> {
    return this.getByRole("dentist");
  },
};
