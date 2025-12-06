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
    return apiClient.get<Treatment[]>("/treatments");
  },

  async getById(id: string): Promise<Treatment | undefined> {
    try {
      return await apiClient.get<Treatment>(`/treatments/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<Treatment, "id">): Promise<Treatment> {
    return apiClient.post<Treatment>("/treatments", data);
  },

  async update(id: string, data: Partial<Treatment>): Promise<Treatment> {
    return apiClient.put<Treatment>(`/treatments/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/treatments/${id}`);
  },

  async search(
    filters: TreatmentFilterOptions
  ): Promise<PaginatedResult<Treatment>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<Treatment>>(
      `/treatments/search${query}`
    );
  },

  async getByPatientId(patientId: string): Promise<Treatment[]> {
    return apiClient.get<Treatment[]>(`/patients/${patientId}/treatments`);
  },

  async getByDentistId(dentistId: string): Promise<Treatment[]> {
    const query = buildQueryString({ dentistId });
    return apiClient.get<Treatment[]>(`/treatments${query}`);
  },

  async getByStatus(status: Treatment["status"]): Promise<Treatment[]> {
    const query = buildQueryString({ status });
    return apiClient.get<Treatment[]>(`/treatments${query}`);
  },

  async createWithStages(
    treatment: Omit<Treatment, "id">,
    stages: Omit<TreatmentStage, "id" | "treatmentId">[]
  ): Promise<{ treatment: Treatment; stages: TreatmentStage[] }> {
    return apiClient.post<{ treatment: Treatment; stages: TreatmentStage[] }>(
      "/treatments/with-stages",
      { treatment, stages }
    );
  },
};

/**
 * Implementação API do serviço de Etapas de Tratamentos
 */
export const ApiTreatmentStageService: ITreatmentStageService = {
  async getAll(): Promise<TreatmentStage[]> {
    return apiClient.get<TreatmentStage[]>("/treatment-stages");
  },

  async getById(id: string): Promise<TreatmentStage | undefined> {
    try {
      return await apiClient.get<TreatmentStage>(`/treatment-stages/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<TreatmentStage, "id">): Promise<TreatmentStage> {
    return apiClient.post<TreatmentStage>("/treatment-stages", data);
  },

  async update(
    id: string,
    data: Partial<TreatmentStage>
  ): Promise<TreatmentStage> {
    return apiClient.put<TreatmentStage>(`/treatment-stages/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/treatment-stages/${id}`);
  },

  async getByTreatmentId(treatmentId: string): Promise<TreatmentStage[]> {
    return apiClient.get<TreatmentStage[]>(`/treatments/${treatmentId}/stages`);
  },

  async updateStatus(
    id: string,
    status: TreatmentStage["status"],
    dateCompleted?: string
  ): Promise<TreatmentStage> {
    return apiClient.patch<TreatmentStage>(`/treatment-stages/${id}/status`, {
      status,
      dateCompleted,
    });
  },

  async updateChecklist(
    id: string,
    completedItems: string[]
  ): Promise<TreatmentStage> {
    return apiClient.patch<TreatmentStage>(
      `/treatment-stages/${id}/checklist`,
      {
        completedChecklist: completedItems,
      }
    );
  },

  async addAttachment(id: string, attachment: string): Promise<TreatmentStage> {
    return apiClient.post<TreatmentStage>(
      `/treatment-stages/${id}/attachments`,
      {
        attachment,
      }
    );
  },

  async removeAttachment(
    id: string,
    attachment: string
  ): Promise<TreatmentStage> {
    return apiClient.delete<TreatmentStage>(
      `/treatment-stages/${id}/attachments/${encodeURIComponent(attachment)}`
    );
  },
};
