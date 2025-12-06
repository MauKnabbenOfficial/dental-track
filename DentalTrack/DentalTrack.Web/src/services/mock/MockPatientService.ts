import { Patient, patients as initialPatients } from "@/data/mockData";
import {
  IPatientService,
  PatientFilterOptions,
} from "../interfaces/IPatientService";
import { PaginatedResult } from "../interfaces/IBaseService";
import {
  MockStorage,
  simulateDelay,
  filterByText,
  sortBy,
  paginate,
} from "./mockUtils";

const storage = new MockStorage<Patient>(
  "dentaltrack_patients",
  initialPatients
);

/**
 * Implementação Mock do serviço de Pacientes
 */
export const MockPatientService: IPatientService = {
  async getAll(): Promise<Patient[]> {
    await simulateDelay();
    return storage.getAll();
  },

  async getById(id: string): Promise<Patient | undefined> {
    await simulateDelay();
    return storage.getById(id);
  },

  async create(data: Omit<Patient, "id">): Promise<Patient> {
    await simulateDelay();
    return storage.create(data);
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    await simulateDelay();
    return storage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    storage.delete(id);
  },

  async search(
    filters: PatientFilterOptions
  ): Promise<PaginatedResult<Patient>> {
    await simulateDelay();
    let items = storage.getAll();

    // Filtro por texto
    if (filters.search) {
      items = filterByText(items, filters.search, [
        "name",
        "cpf",
        "email",
        "phone",
      ]);
    }

    // Filtro por convênio
    if (filters.healthInsuranceName) {
      items = items.filter(
        (p) => p.healthInsuranceName === filters.healthInsuranceName
      );
    }

    // Filtro por cidade
    if (filters.city) {
      items = items.filter((p) =>
        p.city?.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    // Filtro por estado
    if (filters.state) {
      items = items.filter((p) => p.state === filters.state);
    }

    // Ordenação
    if (filters.sortBy) {
      items = sortBy(items, filters.sortBy as keyof Patient, filters.sortOrder);
    }

    // Paginação
    return paginate(items, filters.page, filters.pageSize);
  },

  async getByCpf(cpf: string): Promise<Patient | undefined> {
    await simulateDelay();
    const cleanCpf = cpf.replace(/\D/g, "");
    return storage.getAll().find((p) => p.cpf.replace(/\D/g, "") === cleanCpf);
  },

  async getByHealthInsurance(insuranceName: string): Promise<Patient[]> {
    await simulateDelay();
    return storage
      .getAll()
      .filter((p) => p.healthInsuranceName === insuranceName);
  },
};
