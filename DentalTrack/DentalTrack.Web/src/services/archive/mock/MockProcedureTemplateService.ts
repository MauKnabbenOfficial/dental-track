import {
  ProcedureTemplate,
  ProcedureTemplateStage,
  procedureTemplates as initialProcedureTemplates,
  procedureTemplateStages as initialProcedureTemplateStages,
} from "@/data/mockData";
import { StageTemplate } from "@/contexts/DataContext";
import {
  // MockProcedureTemplateService removed — runtime mocks are disabled.
  // The example data has been moved to `src/data/examples/mockData.json`.
  // This archived copy is kept for reference only.
  export {};
  },
];

const stageTemplateStorage = new MockStorage<StageTemplate>(
  "dentaltrack_stageTemplates",
  initialStageTemplates
);

/**
 * Implementação Mock do serviço de Templates de Procedimentos
 */
export const MockProcedureTemplateService: IProcedureTemplateService = {
  async getAll(): Promise<ProcedureTemplate[]> {
    await simulateDelay();
    return templateStorage.getAll();
  },

  async getById(id: string): Promise<ProcedureTemplate | undefined> {
    await simulateDelay();
    return templateStorage.getById(id);
  },

  async create(
    data: Omit<ProcedureTemplate, "id">
  ): Promise<ProcedureTemplate> {
    await simulateDelay();
    return templateStorage.create(data);
  },

  async update(
    id: string,
    data: Partial<ProcedureTemplate>
  ): Promise<ProcedureTemplate> {
    await simulateDelay();
    return templateStorage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    templateStorage.delete(id);
  },

  async getByCategory(category: string): Promise<ProcedureTemplate[]> {
    await simulateDelay();
    return templateStorage.getAll().filter((t) => t.category === category);
  },

  async getCategories(): Promise<string[]> {
    await simulateDelay();
    const templates = templateStorage.getAll();
    return [...new Set(templates.map((t) => t.category))];
  },
};

/**
 * Implementação Mock do serviço de Etapas de Templates de Procedimentos
 */
export const MockProcedureTemplateStageService: IProcedureTemplateStageService =
  {
    async getAll(): Promise<ProcedureTemplateStage[]> {
      await simulateDelay();
      return stageStorage.getAll();
    },

    async getById(id: string): Promise<ProcedureTemplateStage | undefined> {
      await simulateDelay();
      return stageStorage.getById(id);
    },

    async create(
      data: Omit<ProcedureTemplateStage, "id">
    ): Promise<ProcedureTemplateStage> {
      await simulateDelay();
      return stageStorage.create(data);
    },

    async update(
      id: string,
      data: Partial<ProcedureTemplateStage>
    ): Promise<ProcedureTemplateStage> {
      await simulateDelay();
      return stageStorage.update(id, data);
    },

    async delete(id: string): Promise<void> {
      await simulateDelay();
      stageStorage.delete(id);
    },

    async getByTemplateId(
      templateId: string
    ): Promise<ProcedureTemplateStage[]> {
      await simulateDelay();
      return stageStorage
        .getAll()
        .filter((s) => s.templateId === templateId)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    },

    async swapOrder(stageId1: string, stageId2: string): Promise<void> {
      await simulateDelay();
      const stage1 = stageStorage.getById(stageId1);
      const stage2 = stageStorage.getById(stageId2);

      if (!stage1 || !stage2) {
        throw new Error("Stages not found");
      }

      const order1 = stage1.orderIndex;
      const order2 = stage2.orderIndex;

      stageStorage.update(stageId1, { orderIndex: order2 });
      stageStorage.update(stageId2, { orderIndex: order1 });
    },

    async reorderStages(templateId: string, stageIds: string[]): Promise<void> {
      await simulateDelay();
      stageIds.forEach((id, index) => {
        stageStorage.update(id, { orderIndex: index + 1 });
      });
    },
  };

/**
 * Implementação Mock do serviço de Templates de Etapas
 */
export const MockStageTemplateService: IStageTemplateService = {
  async getAll(): Promise<StageTemplate[]> {
    await simulateDelay();
    return stageTemplateStorage.getAll();
  },

  async getById(id: string): Promise<StageTemplate | undefined> {
    await simulateDelay();
    return stageTemplateStorage.getById(id);
  },

  async create(data: Omit<StageTemplate, "id">): Promise<StageTemplate> {
    await simulateDelay();
    return stageTemplateStorage.create(data);
  },

  async update(
    id: string,
    data: Partial<StageTemplate>
  ): Promise<StageTemplate> {
    await simulateDelay();
    return stageTemplateStorage.update(id, data);
  },

  async delete(id: string): Promise<void> {
    await simulateDelay();
    stageTemplateStorage.delete(id);
  },

  async searchByName(name: string): Promise<StageTemplate[]> {
    await simulateDelay();
    return filterByText(stageTemplateStorage.getAll(), name, ["name"]);
  },
};
