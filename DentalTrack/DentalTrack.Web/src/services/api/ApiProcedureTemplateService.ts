import { ProcedureTemplate, ProcedureTemplateStage } from "@/data/mockData";
import { StageTemplate } from "@/contexts/DataContext";
import {
  IProcedureTemplateService,
  IProcedureTemplateStageService,
  IStageTemplateService,
} from "../interfaces/IProcedureTemplateService";
import { apiClient, buildQueryString } from "../http";

/**
 * Implementação API do serviço de Templates de Procedimentos
 */
export const ApiProcedureTemplateService: IProcedureTemplateService = {
  async getAll(): Promise<ProcedureTemplate[]> {
    return apiClient.get<ProcedureTemplate[]>("/procedure-templates");
  },

  async getById(id: string): Promise<ProcedureTemplate | undefined> {
    try {
      return await apiClient.get<ProcedureTemplate>(
        `/procedure-templates/${id}`
      );
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(
    data: Omit<ProcedureTemplate, "id">
  ): Promise<ProcedureTemplate> {
    return apiClient.post<ProcedureTemplate>("/procedure-templates", data);
  },

  async update(
    id: string,
    data: Partial<ProcedureTemplate>
  ): Promise<ProcedureTemplate> {
    return apiClient.put<ProcedureTemplate>(`/procedure-templates/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/procedure-templates/${id}`);
  },

  async getByCategory(category: string): Promise<ProcedureTemplate[]> {
    const query = buildQueryString({ category });
    return apiClient.get<ProcedureTemplate[]>(`/procedure-templates${query}`);
  },

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>("/procedure-templates/categories");
  },
};

/**
 * Implementação API do serviço de Etapas de Templates de Procedimentos
 */
export const ApiProcedureTemplateStageService: IProcedureTemplateStageService =
  {
    async getAll(): Promise<ProcedureTemplateStage[]> {
      return apiClient.get<ProcedureTemplateStage[]>(
        "/procedure-template-stages"
      );
    },

    async getById(id: string): Promise<ProcedureTemplateStage | undefined> {
      try {
        return await apiClient.get<ProcedureTemplateStage>(
          `/procedure-template-stages/${id}`
        );
      } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
      }
    },

    async create(
      data: Omit<ProcedureTemplateStage, "id">
    ): Promise<ProcedureTemplateStage> {
      return apiClient.post<ProcedureTemplateStage>(
        "/procedure-template-stages",
        data
      );
    },

    async update(
      id: string,
      data: Partial<ProcedureTemplateStage>
    ): Promise<ProcedureTemplateStage> {
      return apiClient.put<ProcedureTemplateStage>(
        `/procedure-template-stages/${id}`,
        data
      );
    },

    async delete(id: string): Promise<void> {
      return apiClient.delete(`/procedure-template-stages/${id}`);
    },

    async getByTemplateId(
      templateId: string
    ): Promise<ProcedureTemplateStage[]> {
      return apiClient.get<ProcedureTemplateStage[]>(
        `/procedure-templates/${templateId}/stages`
      );
    },

    async swapOrder(stageId1: string, stageId2: string): Promise<void> {
      return apiClient.post("/procedure-template-stages/swap-order", {
        stageId1,
        stageId2,
      });
    },

    async reorderStages(templateId: string, stageIds: string[]): Promise<void> {
      return apiClient.post(
        `/procedure-templates/${templateId}/reorder-stages`,
        { stageIds }
      );
    },
  };

/**
 * Implementação API do serviço de Templates de Etapas
 */
export const ApiStageTemplateService: IStageTemplateService = {
  async getAll(): Promise<StageTemplate[]> {
    return apiClient.get<StageTemplate[]>("/stage-templates");
  },

  async getById(id: string): Promise<StageTemplate | undefined> {
    try {
      return await apiClient.get<StageTemplate>(`/stage-templates/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<StageTemplate, "id">): Promise<StageTemplate> {
    return apiClient.post<StageTemplate>("/stage-templates", data);
  },

  async update(
    id: string,
    data: Partial<StageTemplate>
  ): Promise<StageTemplate> {
    return apiClient.put<StageTemplate>(`/stage-templates/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/stage-templates/${id}`);
  },

  async searchByName(name: string): Promise<StageTemplate[]> {
    const query = buildQueryString({ search: name });
    return apiClient.get<StageTemplate[]>(`/stage-templates${query}`);
  },
};
