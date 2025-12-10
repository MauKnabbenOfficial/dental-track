import { User } from "@/types/backendDtos";
import { IBaseService } from "./IBaseService";

/**
 * Interface para o serviço de Usuários
 */
export interface IUserService extends IBaseService<User> {
  /**
   * Busca usuários por role
   */
  getByRole(role: User["perfilNome"]): Promise<User[]>;

  /**
   * Busca dentistas (atalho para getByRole('dentist'))
   */
  getDentists(): Promise<User[]>;
}
