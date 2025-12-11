import { Patient } from "@/data/mockData";
import { IBaseService, FilterOptions, PaginatedResult } from "./IBaseService";

/**
 * Interface para o serviço de Pacientes
 */
export interface IPatientService extends IBaseService<Patient> {
  /**
   * Busca pacientes com filtros e paginação
   */
  search(filters: PatientFilterOptions): Promise<PaginatedResult<Patient>>;

  /**
   * Busca paciente por CPF
   */
  getByCpf(cpf: string): Promise<Patient | undefined>;

  /**
   * Busca pacientes por convênio
   */
  getByHealthInsurance(insuranceName: string): Promise<Patient[]>;
}

export interface PatientFilterOptions extends FilterOptions {
  convenioNome?: string;
  cidade?: string;
  estado?: string;
}
