import { ExtendedFinancialRecord } from "@/contexts/DataContext";
import { financialRecords as initialFinancialRecords } from "@/data/mockData";
import {
  IFinancialService,
  FinancialFilterOptions,
  FinancialSummary,
} from "../interfaces/IFinancialService";
import { PaginatedResult } from "../interfaces/IBaseService";
import {
  MockStorage,
  simulateDelay,
  filterByText,
  sortBy,
  paginate,
} from "./mockUtils";

// Convert initial financial records to extended format
const initialExtendedRecords: ExtendedFinancialRecord[] =
  initialFinancialRecords.map((r) => ({
    ...r,
    status: "paid" as const,
    paymentDate: r.date,
  }));

const storage = new MockStorage<ExtendedFinancialRecord>(
  "dentaltrack_financialRecords",
  initialExtendedRecords
);

/**
 * Implementação Mock do serviço de Lançamentos Financeiros
 */
export const MockFinancialService: IFinancialService = {
  async getAll(): Promise<ExtendedFinancialRecord[]> {
    await simulateDelay();
    return storage.getAll();
  },

  async getById(id: string): Promise<ExtendedFinancialRecord | undefined> {
    await simulateDelay();
    return storage.getById(id);
  },

  async create(
    data: Omit<ExtendedFinancialRecord, "id">
  ): Promise<ExtendedFinancialRecord> {
    await simulateDelay();
    return storage.create(data);
  },

  async update(
    id: string,
    data: Partial<ExtendedFinancialRecord>
  ): Promise<ExtendedFinancialRecord> {
    await simulateDelay();
    return storage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    storage.delete(id);
  },

  async search(
    filters: FinancialFilterOptions
  ): Promise<PaginatedResult<ExtendedFinancialRecord>> {
    await simulateDelay();
    let items = storage.getAll();

    // Filtro por texto
    if (filters.search) {
      items = filterByText(items, filters.search, ["description", "category"]);
    }

    // Filtro por tratamento
    if (filters.treatmentId) {
      items = items.filter((r) => r.treatmentId === filters.treatmentId);
    }

    // Filtro por paciente
    if (filters.patientId) {
      items = items.filter((r) => r.patientId === filters.patientId);
    }

    // Filtro por tipo
    if (filters.type) {
      items = items.filter((r) => r.type === filters.type);
    }

    // Filtro por status
    if (filters.status) {
      items = items.filter((r) => r.status === filters.status);
    }

    // Filtro por responsável
    if (filters.responsibleType) {
      items = items.filter(
        (r) => r.responsibleType === filters.responsibleType
      );
    }

    // Filtro por data
    if (filters.dateFrom) {
      items = items.filter((r) => r.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      items = items.filter((r) => r.date <= filters.dateTo!);
    }

    // Filtro por categoria
    if (filters.category) {
      items = items.filter((r) => r.category === filters.category);
    }

    // Ordenação
    if (filters.sortBy) {
      items = sortBy(
        items,
        filters.sortBy as keyof ExtendedFinancialRecord,
        filters.sortOrder
      );
    } else {
      // Ordenar por data (mais recentes primeiro)
      items = sortBy(items, "date", "desc");
    }

    // Paginação
    return paginate(items, filters.page, filters.pageSize);
  },

  async getByTreatmentId(
    treatmentId: string
  ): Promise<ExtendedFinancialRecord[]> {
    await simulateDelay();
    return storage.getAll().filter((r) => r.treatmentId === treatmentId);
  },

  async getByPatientId(patientId: string): Promise<ExtendedFinancialRecord[]> {
    await simulateDelay();
    return storage.getAll().filter((r) => r.patientId === patientId);
  },

  async getByType(
    type: ExtendedFinancialRecord["type"]
  ): Promise<ExtendedFinancialRecord[]> {
    await simulateDelay();
    return storage.getAll().filter((r) => r.type === type);
  },

  async getByStatus(
    status: ExtendedFinancialRecord["status"]
  ): Promise<ExtendedFinancialRecord[]> {
    await simulateDelay();
    return storage.getAll().filter((r) => r.status === status);
  },

  async updatePaymentStatus(
    id: string,
    status: ExtendedFinancialRecord["status"],
    paymentDate?: string
  ): Promise<ExtendedFinancialRecord> {
    await simulateDelay();
    const updates: Partial<ExtendedFinancialRecord> = { status };

    if (status === "paid" && paymentDate) {
      updates.paymentDate = paymentDate;
    } else if (status !== "paid") {
      updates.paymentDate = undefined;
    }

    return storage.update(id, updates);
  },

  async getTotalsByPeriod(
    startDate: string,
    endDate: string
  ): Promise<FinancialSummary> {
    await simulateDelay();
    const records = storage
      .getAll()
      .filter((r) => r.date >= startDate && r.date <= endDate);

    const summary: FinancialSummary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      pendingIncome: 0,
      pendingExpense: 0,
      paidIncome: 0,
      paidExpense: 0,
    };

    records.forEach((r) => {
      if (r.type === "income") {
        summary.totalIncome += r.amount;
        if (r.status === "paid") {
          summary.paidIncome += r.amount;
        } else if (r.status === "pending") {
          summary.pendingIncome += r.amount;
        }
      } else {
        summary.totalExpense += r.amount;
        if (r.status === "paid") {
          summary.paidExpense += r.amount;
        } else if (r.status === "pending") {
          summary.pendingExpense += r.amount;
        }
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;

    return summary;
  },
};
