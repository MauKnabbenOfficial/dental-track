import { Patient } from "@/data/mockData";
import {
  IPatientService,
  PatientFilterOptions,
} from "../interfaces/IPatientService";
import { PaginatedResult } from "../interfaces/IBaseService";
import { apiClient, buildQueryString } from "../http";

/**
 * Implementação API do serviço de Pacientes
 */
export const ApiPatientService: IPatientService = {
  async getAll(): Promise<Patient[]> {
    return apiClient.get<Patient[]>("/patients");
  },

  async getById(id: string): Promise<Patient | undefined> {
    try {
      return await apiClient.get<Patient>(`/patients/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<Patient, "id">): Promise<Patient> {
    return apiClient.post<Patient>("/patients", data);
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    return apiClient.put<Patient>(`/patients/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/patients/${id}`);
  },

  async search(
    filters: PatientFilterOptions
  ): Promise<PaginatedResult<Patient>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<Patient>>(`/patients/search${query}`);
  },

  async getByCpf(cpf: string): Promise<Patient | undefined> {
    try {
      const cleanCpf = cpf.replace(/\D/g, "");
      return await apiClient.get<Patient>(`/patients/cpf/${cleanCpf}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async getByHealthInsurance(insuranceName: string): Promise<Patient[]> {
    const query = buildQueryString({ healthInsuranceName: insuranceName });
    return apiClient.get<Patient[]>(`/patients${query}`);
  },
};
