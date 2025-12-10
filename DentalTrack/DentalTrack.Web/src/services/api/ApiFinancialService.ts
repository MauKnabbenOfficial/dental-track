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
    return apiClient.get<ExtendedFinancialRecord[]>("/lancamentosfinanceiros");
  },

  async getById(id: string): Promise<ExtendedFinancialRecord | undefined> {
    try {
      return await apiClient.get<ExtendedFinancialRecord>(
        `/lancamentosfinanceiros/${id}`
      );
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(
    data: Omit<ExtendedFinancialRecord, "id">
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.post<ExtendedFinancialRecord>(
      "/lancamentosfinanceiros",
      data
    );
  },

  async update(
    id: string,
    data: Partial<ExtendedFinancialRecord>
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.put<ExtendedFinancialRecord>(
      `/lancamentosfinanceiros/${id}`,
      data
    );
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/lancamentosfinanceiros/${id}`);
  },

  async search(
    filters: FinancialFilterOptions
  ): Promise<PaginatedResult<ExtendedFinancialRecord>> {
    const query = buildQueryString(filters);
    return apiClient.get<PaginatedResult<ExtendedFinancialRecord>>(
      `/lancamentosfinanceiros/buscar${query}`
    );
  },

  async getByTreatmentId(
    treatmentId: string
  ): Promise<ExtendedFinancialRecord[]> {
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/lancamentosfinanceiros/atendimento/${treatmentId}`
    );
  },

  async getByPatientId(patientId: string): Promise<ExtendedFinancialRecord[]> {
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/lancamentosfinanceiros/paciente/${patientId}`
    );
  },

  async getByType(
    type: ExtendedFinancialRecord["type"]
  ): Promise<ExtendedFinancialRecord[]> {
    const query = buildQueryString({ tipo: type });
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/lancamentosfinanceiros${query}`
    );
  },

  async getByStatus(
    status: ExtendedFinancialRecord["status"]
  ): Promise<ExtendedFinancialRecord[]> {
    const query = buildQueryString({ status });
    return apiClient.get<ExtendedFinancialRecord[]>(
      `/lancamentosfinanceiros${query}`
    );
  },

  async updatePaymentStatus(
    id: string,
    status: ExtendedFinancialRecord["status"],
    paymentDate?: string
  ): Promise<ExtendedFinancialRecord> {
    return apiClient.patch<ExtendedFinancialRecord>(
      `/lancamentosfinanceiros/${id}/status-pagamento`,
      {
        status,
        dataPagamento: paymentDate,
      }
    );
  },

  async getTotalsByPeriod(
    dataInicio: string,
    dataFim: string
  ): Promise<FinancialSummary> {
    const query = buildQueryString({ dataInicio, dataFim });
    return apiClient.get<FinancialSummary>(
      `/lancamentosfinanceiros/resumo${query}`
    );
  },
};
