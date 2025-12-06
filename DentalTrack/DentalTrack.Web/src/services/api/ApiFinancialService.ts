import { ExtendedFinancialRecord } from "@/contexts/DataContext";
import {
  IFinancialService,
  FinancialFilterOptions,
  FinancialSummary,
} from "../interfaces/IFinancialService";
import { PaginatedResult } from "../interfaces/IBaseService";
import { apiClient, buildQueryString } from "../http";

/**
 * Implementação API do serviço de Lançamentos Financeiros
 */
export const ApiFinancialService: IFinancialService = {
  async getAll(): Promise<ExtendedFinancialRecord[]> {
    return apiClient.get<ExtendedFinancialRecord[]>("/financial-records");
  },

  async getById(id: string): Promise<ExtendedFinancialRecord | undefined> {
    try {
      return await apiClient.get<ExtendedFinancialRecord>(
        `/financial-records/${id}`
      );
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(
    data: Omit<ExtendedFinancialRecord, "id">
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.post<ExtendedFinancialRecord>("/financial-records", data);
  },

  async update(
    id: string,
    data: Partial<ExtendedFinancialRecord>
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.put<ExtendedFinancialRecord>(
      `/financial-records/${id}`,
      data
    );
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/financial-records/${id}`);
  },

  async search(
    filters: FinancialFilterOptions
  ): Promise<PaginatedResult<ExtendedFinancialRecord>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<ExtendedFinancialRecord>>(
      `/financial-records/search${query}`
    );
  },

  async getByTreatmentId(
    treatmentId: string
  ): Promise<ExtendedFinancialRecord[]> {
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/treatments/${treatmentId}/financial-records`
    );
  },

  async getByPatientId(patientId: string): Promise<ExtendedFinancialRecord[]> {
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/patients/${patientId}/financial-records`
    );
  },

  async getByType(
    type: ExtendedFinancialRecord["type"]
  ): Promise<ExtendedFinancialRecord[]> {
    const query = buildQueryString({ type });
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/financial-records${query}`
    );
  },

  async getByStatus(
    status: ExtendedFinancialRecord["status"]
  ): Promise<ExtendedFinancialRecord[]> {
    const query = buildQueryString({ status });
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/financial-records${query}`
    );
  },

  async updatePaymentStatus(
    id: string,
    status: ExtendedFinancialRecord["status"],
    paymentDate?: string
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.patch<ExtendedFinancialRecord>(
      `/financial-records/${id}/payment-status`,
      {
        status,
        paymentDate,
      }
    );
  },

  async getTotalsByPeriod(
    startDate: string,
    endDate: string
  ): Promise<FinancialSummary> {
    const query = buildQueryString({ startDate, endDate });
    return apiClient.get<FinancialSummary>(
      `/financial-records/summary${query}`
    );
  },
};
