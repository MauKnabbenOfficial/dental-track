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
  // MockTreatmentService removed — runtime mocks are disabled.
  // The example data has been moved to `src/data/examples/mockData.json`.
  // This archived copy is kept for reference only.
  async getAll(): Promise<Treatment[]> {
    await simulateDelay();
    return treatmentStorage.getAll();
  },
  // ... (rest of archived implementation omitted for brevity)
} as unknown as ITreatmentService;

export const MockTreatmentStageService: ITreatmentStageService = {
  async getAll(): Promise<TreatmentStage[]> {
    await simulateDelay();
    return stageStorage.getAll();
  },
  async getById(
    id: string,
    atendimentoId?: string
  ): Promise<TreatmentStage | undefined> {
    await simulateDelay();
    return stageStorage.getById(id);
  },
  async create(data: Omit<TreatmentStage, "id">): Promise<TreatmentStage> {
    await simulateDelay();
    return stageStorage.create(data);
  },
  async update(
    id: string,
    data: Partial<TreatmentStage>,
    atendimentoId?: string
  ) {
    await simulateDelay();
    return stageStorage.update(id, data);
  },
  async delete(id: string, atendimentoId?: string): Promise<void> {
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
    status,
    dateCompleted?,
    atendimentoId?: string
  ) {
    await simulateDelay();
    const updates: Partial<TreatmentStage> = { status };
    if (status === "completed" && dateCompleted)
      updates.dateCompleted = dateCompleted;
    return stageStorage.update(id, updates);
  },
  async updateChecklist(
    id: string,
    completedItems: string[],
    atendimentoId?: string
  ) {
    await simulateDelay();
    return stageStorage.update(id, { completedChecklist: completedItems });
  },
  async addAttachment(id: string, attachment: string, atendimentoId?: string) {
    await simulateDelay();
    const stage = stageStorage.getById(id);
    if (!stage) throw new Error("Stage not found");
    const attachments = [...(stage.attachments || []), attachment];
    return stageStorage.update(id, { attachments });
  },
  async removeAttachment(
    id: string,
    attachment: string,
    atendimentoId?: string
  ) {
    await simulateDelay();
    const stage = stageStorage.getById(id);
    if (!stage) throw new Error("Stage not found");
    const attachments = (stage.attachments || []).filter(
      (a) => a !== attachment
    );
    return stageStorage.update(id, { attachments });
  },
};
