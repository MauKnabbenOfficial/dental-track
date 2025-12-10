import { Treatment, TreatmentStage } from "@/data/mockData";
import {
  ITreatmentService,
  ITreatmentStageService,
  TreatmentFilterOptions,
} from "../interfaces/ITreatmentService";
import { PaginatedResult } from "../interfaces/IBaseService";
import { apiClient, buildQueryString } from "../http";

/**
 * Implementação API do serviço de Tratamentos
 */
export const ApiTreatmentService: ITreatmentService = {
  async getAll(): Promise<Treatment[]> {
    return apiClient.get<Treatment[]>("/atendimentos");
  },

  async getById(id: string): Promise<Treatment | undefined> {
    try {
      return await apiClient.get<Treatment>(`/atendimentos/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<Treatment, "id">): Promise<Treatment> {
    return apiClient.post<Treatment>("/atendimentos", data);
  },

  async update(id: string, data: Partial<Treatment>): Promise<Treatment> {
    return apiClient.put<Treatment>(`/atendimentos/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/atendimentos/${id}`);
  },

  async search(
    filters: TreatmentFilterOptions
  ): Promise<PaginatedResult<Treatment>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<Treatment>>(
      `/atendimentos/buscar${query}`
    );
  },

  async getByPatientId(patientId: string): Promise<Treatment[]> {
    return apiClient.get<Treatment[]>(`/atendimentos/paciente/${patientId}`);
  },

  async getByDentistId(dentistId: string): Promise<Treatment[]> {
    return apiClient.get<Treatment[]>(`/atendimentos/dentista/${dentistId}`);
  },

  async getByStatus(status: Treatment["status"]): Promise<Treatment[]> {
    const query = buildQueryString({ status });
    return apiClient.get<Treatment[]>(`/atendimentos${query}`);
  },

  async createWithStages(
    treatment: Omit<Treatment, "id">,
    stages: Omit<TreatmentStage, "id" | "treatmentId">[]
  ): Promise<{ treatment: Treatment; stages: TreatmentStage[] }> {
    return apiClient.post<{ treatment: Treatment; stages: TreatmentStage[] }>(
      "/atendimentos/com-etapas",
      { atendimento: treatment, etapas: stages }
    );
  },
};

/**
 * Implementação API do serviço de Etapas de Tratamentos
 */
export const ApiTreatmentStageService: ITreatmentStageService = {
  async getAll(): Promise<TreatmentStage[]> {
    // Nota: Backend não tem endpoint para obter todas as etapas
    // As etapas são obtidas por tratamento específico via getByTreatmentId()
    return Promise.resolve([]);
  },

  async getById(id: string): Promise<TreatmentStage | undefined> {
    try {
      return await apiClient.get<TreatmentStage>(`/atendimentos/etapas/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<TreatmentStage, "id">): Promise<TreatmentStage> {
    return apiClient.post<TreatmentStage>(
      `/atendimentos/${data.treatmentId}/etapas`,
      data
    );
  },

  async update(
    id: string,
    data: Partial<TreatmentStage>
  ): Promise<TreatmentStage> {
    return apiClient.put<TreatmentStage>(`/atendimentos/etapas/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/atendimentos/etapas/${id}`);
  },

  async getByTreatmentId(treatmentId: string): Promise<TreatmentStage[]> {
    return apiClient.get<TreatmentStage[]>(
      `/atendimentos/${treatmentId}/etapas`
    );
  },

  async updateStatus(
    id: string,
    status: TreatmentStage["status"],
    dateCompleted?: string
  ): Promise<TreatmentStage> {
    return apiClient.patch<TreatmentStage>(
      `/atendimentos/etapas/${id}/status`,
      {
        status,
        dataConclusao: dateCompleted,
      }
    );
  },

  async updateChecklist(
    id: string,
    completedItems: string[]
  ): Promise<TreatmentStage> {
    return apiClient.patch<TreatmentStage>(
      `/atendimentos/etapas/${id}/checklist`,
      {
        itensConcluidos: completedItems,
      }
    );
  },

  async addAttachment(id: string, attachment: string): Promise<TreatmentStage> {
    return apiClient.post<TreatmentStage>(`/atendimentos/etapas/${id}/anexos`, {
      anexo: attachment,
    });
  },

  async removeAttachment(
    id: string,
    attachment: string
  ): Promise<TreatmentStage> {
    return apiClient.delete<TreatmentStage>(
      `/atendimentos/etapas/${id}/anexos/${encodeURIComponent(attachment)}`
    );
  },
};
