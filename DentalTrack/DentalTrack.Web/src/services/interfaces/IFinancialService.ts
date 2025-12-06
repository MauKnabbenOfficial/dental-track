import { ExtendedFinancialRecord } from "@/contexts/DataContext";
import { IBaseService, FilterOptions, PaginatedResult } from "./IBaseService";

/**
 * Interface para o serviço de Lançamentos Financeiros
 */
export interface IFinancialService
  extends IBaseService<ExtendedFinancialRecord> {
  /**
   * Busca lançamentos com filtros e paginação
   */
  search(
    filters: FinancialFilterOptions
  ): Promise<PaginatedResult<ExtendedFinancialRecord>>;

  /**
   * Busca lançamentos por tratamento
   */
  getByTreatmentId(treatmentId: string): Promise<ExtendedFinancialRecord[]>;

  /**
   * Busca lançamentos por paciente
   */
  getByPatientId(patientId: string): Promise<ExtendedFinancialRecord[]>;

  /**
   * Busca lançamentos por tipo (receita/despesa)
   */
  getByType(
    type: ExtendedFinancialRecord["type"]
  ): Promise<ExtendedFinancialRecord[]>;

  /**
   * Busca lançamentos por status
   */
  getByStatus(
    status: ExtendedFinancialRecord["status"]
  ): Promise<ExtendedFinancialRecord[]>;

  /**
   * Atualiza status do pagamento
   */
  updatePaymentStatus(
    id: string,
    status: ExtendedFinancialRecord["status"],
    paymentDate?: string
  ): Promise<ExtendedFinancialRecord>;

  /**
   * Calcula totais por período
   */
  getTotalsByPeriod(
    startDate: string,
    endDate: string
  ): Promise<FinancialSummary>;
}

export interface FinancialFilterOptions extends FilterOptions {
  treatmentId?: string;
  patientId?: string;
  type?: ExtendedFinancialRecord["type"];
  status?: ExtendedFinancialRecord["status"];
  responsibleType?: ExtendedFinancialRecord["responsibleType"];
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  pendingIncome: number;
  pendingExpense: number;
  paidIncome: number;
  paidExpense: number;
}
