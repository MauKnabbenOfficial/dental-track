import {
  Treatment,
  TreatmentStage,
  treatments as initialTreatments,
  treatmentStages as initialTreatmentStages,
} from "@/data/mockData";
import {
  ITreatmentService,
  ITreatmentStageService,
  TreatmentFilterOptions,
} from "../interfaces/ITreatmentService";
import { PaginatedResult } from "../interfaces/IBaseService";
import {
  MockStorage,
  simulateDelay,
  filterByText,
  sortBy,
  paginate,
  generateId,
} from "./mockUtils";

// Storage instances
const treatmentStorage = new MockStorage<Treatment>(
  "dentaltrack_treatments",
  initialTreatments
);

const stageStorage = new MockStorage<TreatmentStage>(
  "dentaltrack_treatmentStages",
  initialTreatmentStages
);

/**
 * Implementação Mock do serviço de Tratamentos
 */
export const MockTreatmentService: ITreatmentService = {
  async getAll(): Promise<Treatment[]> {
    await simulateDelay();
    return treatmentStorage.getAll();
  },

  async getById(id: string): Promise<Treatment | undefined> {
    await simulateDelay();
    return treatmentStorage.getById(id);
  },

  async create(data: Omit<Treatment, "id">): Promise<Treatment> {
    await simulateDelay();
    return treatmentStorage.create(data);
  },

  async update(id: string, data: Partial<Treatment>): Promise<Treatment> {
    await simulateDelay();
    return treatmentStorage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    // Também deleta as etapas associadas
    const stages = stageStorage.getAll().filter((s) => s.treatmentId === id);
    stages.forEach((s) => stageStorage.delete(s.id));
    treatmentStorage.delete(id);
  },

  async search(
    filters: TreatmentFilterOptions
  ): Promise<PaginatedResult<Treatment>> {
    await simulateDelay();
    let items = treatmentStorage.getAll();

    // Filtro por texto
    if (filters.search) {
      items = filterByText(items, filters.search, ["notes"]);
    }

    // Filtro por paciente
    if (filters.patientId) {
      items = items.filter((t) => t.patientId === filters.patientId);
    }

    // Filtro por dentista
    if (filters.dentistId) {
      items = items.filter((t) => t.dentistId === filters.dentistId);
    }

    // Filtro por status
    if (filters.status) {
      items = items.filter((t) => t.status === filters.status);
    }

    // Filtro por data de início
    if (filters.startDateFrom) {
      items = items.filter((t) => t.startDate >= filters.startDateFrom!);
    }
    if (filters.startDateTo) {
      items = items.filter((t) => t.startDate <= filters.startDateTo!);
    }

    // Ordenação
    if (filters.sortBy) {
      items = sortBy(
        items,
        filters.sortBy as keyof Treatment,
        filters.sortOrder
      );
    } else {
      // Ordenar por data de início (mais recentes primeiro)
      items = sortBy(items, "startDate", "desc");
    }

    // Paginação
    return paginate(items, filters.page, filters.pageSize);
  },

  async getByPatientId(patientId: string): Promise<Treatment[]> {
    await simulateDelay();
    return treatmentStorage.getAll().filter((t) => t.patientId === patientId);
  },

  async getByDentistId(dentistId: string): Promise<Treatment[]> {
    await simulateDelay();
    return treatmentStorage.getAll().filter((t) => t.dentistId === dentistId);
  },

  async getByStatus(status: Treatment["status"]): Promise<Treatment[]> {
    await simulateDelay();
    return treatmentStorage.getAll().filter((t) => t.status === status);
  },

  async createWithStages(
    treatment: Omit<Treatment, "id">,
    stages: Omit<TreatmentStage, "id" | "treatmentId">[]
  ): Promise<{ treatment: Treatment; stages: TreatmentStage[] }> {
    await simulateDelay();

    // Cria o tratamento
    const newTreatment = treatmentStorage.create(treatment);

    // Cria as etapas
    const newStages: TreatmentStage[] = stages.map((stage) => {
      return stageStorage.create({
        ...stage,
        treatmentId: newTreatment.id,
      });
    });

    // Atualiza o currentStageId com a primeira etapa
    if (newStages.length > 0) {
      const firstStage =
        newStages.find((s) => s.orderIndex === 1) || newStages[0];
      treatmentStorage.update(newTreatment.id, {
        currentStageId: firstStage.id,
      });
      newTreatment.currentStageId = firstStage.id;
    }

    return { treatment: newTreatment, stages: newStages };
  },
};

/**
 * Implementação Mock do serviço de Etapas de Tratamentos
 */
export const MockTreatmentStageService: ITreatmentStageService = {
  async getAll(): Promise<TreatmentStage[]> {
    await simulateDelay();
    return stageStorage.getAll();
  },

  async getById(id: string): Promise<TreatmentStage | undefined> {
    await simulateDelay();
    return stageStorage.getById(id);
  },

  async create(data: Omit<TreatmentStage, "id">): Promise<TreatmentStage> {
    await simulateDelay();
    return stageStorage.create(data);
  },

  async update(
    id: string,
    data: Partial<TreatmentStage>
  ): Promise<TreatmentStage> {
    await simulateDelay();
    return stageStorage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    stageStorage.delete(id);
  },

  async getByTreatmentId(treatmentId: string): Promise<TreatmentStage[]> {
    await simulateDelay();
    return stageStorage
      .getAll()
      .filter((s) => s.treatmentId === treatmentId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },

  async updateStatus(
    id: string,
    status: TreatmentStage["status"],
    dateCompleted?: string
  ): Promise<TreatmentStage> {
    await simulateDelay();
    const updates: Partial<TreatmentStage> = { status };

    if (status === "completed" && dateCompleted) {
      updates.dateCompleted = dateCompleted;
    }

    return stageStorage.update(id, updates);
  },

  async updateChecklist(
    id: string,
    completedItems: string[]
  ): Promise<TreatmentStage> {
    await simulateDelay();
    return stageStorage.update(id, { completedChecklist: completedItems });
  },

  async addAttachment(id: string, attachment: string): Promise<TreatmentStage> {
    await simulateDelay();
    const stage = stageStorage.getById(id);
    if (!stage) throw new Error("Stage not found");

    const attachments = [...(stage.attachments || []), attachment];
    return stageStorage.update(id, { attachments });
  },

  async removeAttachment(
    id: string,
    attachment: string
  ): Promise<TreatmentStage> {
    await simulateDelay();
    const stage = stageStorage.getById(id);
    if (!stage) throw new Error("Stage not found");

    const attachments = (stage.attachments || []).filter(
      (a) => a !== attachment
    );
    return stageStorage.update(id, { attachments });
  },
};
