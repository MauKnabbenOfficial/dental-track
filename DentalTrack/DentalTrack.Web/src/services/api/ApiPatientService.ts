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
    return apiClient.get<Patient[]>("/pacientes");
  },

  async getById(id: string): Promise<Patient | undefined> {
    try {
      return await apiClient.get<Patient>(`/pacientes/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<Patient, "id">): Promise<Patient> {
    return apiClient.post<Patient>("/pacientes", data);
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    return apiClient.put<Patient>(`/pacientes/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/pacientes/${id}`);
  },

  async search(
    filters: PatientFilterOptions
  ): Promise<PaginatedResult<Patient>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<Patient>>(`/pacientes/buscar${query}`);
  },

  async getByCpf(cpf: string): Promise<Patient | undefined> {
    try {
      const cleanCpf = cpf.replace(/\D/g, "");
      return await apiClient.get<Patient>(`/pacientes/cpf/${cleanCpf}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async getByHealthInsurance(insuranceName: string): Promise<Patient[]> {
    return apiClient.get<Patient[]>(
      `/pacientes/convenio/${encodeURIComponent(insuranceName)}`
    );
  },
};
