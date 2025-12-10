import { ProcedureTemplate, ProcedureTemplateStage } from "@/data/mockData";
import { StageTemplate } from "@/contexts/DataContext";
import {
  IProcedureTemplateService,
  IProcedureTemplateStageService,
  IStageTemplateService,
} from "../interfaces/IProcedureTemplateService";
import { apiClient, buildQueryString } from "../http";
import { toast } from "sonner";

/**
 * Implementação API do serviço de Templates de Procedimentos
 */
export const ApiProcedureTemplateService: IProcedureTemplateService = {
  async getAll(): Promise<ProcedureTemplate[]> {
    try {
      const res = await apiClient.get<ProcedureTemplate[]>(
        "/modelosprocedimentos"
      );
      // Diagnostic (only in dev)
      if (import.meta.env.DEV) {
        try {
          if (Array.isArray(res))
            toast.info(`Diagnóstico: Modelos carregados: ${res.length}`);
        } catch (e) {}
      }
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("ApiProcedureTemplateService.getAll error:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<ProcedureTemplate | undefined> {
    try {
      return await apiClient.get<ProcedureTemplate>(
        `/modelosprocedimentos/${id}`
      );
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(
    data: Omit<ProcedureTemplate, "id">
  ): Promise<ProcedureTemplate> {
    return apiClient.post<ProcedureTemplate>("/modelosprocedimentos", data);
  },

  async update(
    id: string,
    data: Partial<ProcedureTemplate>
  ): Promise<ProcedureTemplate> {
    return apiClient.put<ProcedureTemplate>(
      `/modelosprocedimentos/${id}`,
      data
    );
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/modelosprocedimentos/${id}`);
  },

  async getByCategory(category: string): Promise<ProcedureTemplate[]> {
    const query = buildQueryString({ categoria: category });
    return apiClient.get<ProcedureTemplate[]>(`/modelosprocedimentos${query}`);
  },

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>("/modelosprocedimentos/categorias");
  },
};

/**
 * Implementação API do serviço de Etapas de Templates de Procedimentos
 */
export const ApiProcedureTemplateStageService: IProcedureTemplateStageService =
  {
    async getAll(): Promise<ProcedureTemplateStage[]> {
      try {
        const res = await apiClient.get<ProcedureTemplateStage[]>(
          "/modelosetapas"
        );
        // Diagnostic (only in dev)
        if (import.meta.env.DEV) {
          try {
            if (Array.isArray(res))
              toast.info(`Diagnóstico: Etapas totais: ${res.length}`);
          } catch (e) {}
        }
        return res;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("ApiProcedureTemplateStageService.getAll error:", error);
        throw error;
      }
    },

    async getById(id: string): Promise<ProcedureTemplateStage | undefined> {
      try {
        return await apiClient.get<ProcedureTemplateStage>(
          `/modelosetapas/${id}`
        );
      } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
      }
    },

    async create(
      data: Omit<ProcedureTemplateStage, "id">
    ): Promise<ProcedureTemplateStage> {
      // Backend expects the modeloProcedimentoId path param and DTO fields
      const modeloId = (data as any).modeloProcedimentoId;
      return apiClient.post<ProcedureTemplateStage>(
        `/modelosprocedimentos/${modeloId}/etapas`,
        data
      );
    },

    async update(
      id: string,
      data: Partial<ProcedureTemplateStage>
    ): Promise<ProcedureTemplateStage> {
      return apiClient.put<ProcedureTemplateStage>(
        `/modelosetapas/${id}`,
        data
      );
    },

    async delete(id: string): Promise<void> {
      return apiClient.delete(`/modelosetapas/${id}`);
    },

    async getByTemplateId(
      modeloProcedimentoId: string
    ): Promise<ProcedureTemplateStage[]> {
      try {
        const res = await apiClient.get<ProcedureTemplateStage[]>(
          `/modelosprocedimentos/${modeloProcedimentoId}/etapas`
        );
        // Diagnostic (only in dev)
        if (import.meta.env.DEV) {
          try {
            if (Array.isArray(res))
              toast.info(
                `Diagnóstico: Etapas do modelo ${modeloProcedimentoId}: ${res.length}`
              );
          } catch (e) {}
        }
        return res;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "ApiProcedureTemplateStageService.getByTemplateId error:",
          error
        );
        throw error;
      }
    },

    async swapOrder(stageId1: string, stageId2: string): Promise<void> {
      // Nota: Backend não tem endpoint de swap, apenas de reordenação
      // Esta função não faz nada por enquanto
      return Promise.resolve();
    },

    async reorderStages(
      modeloProcedimentoId: string,
      stageIds: string[]
    ): Promise<void> {
      return apiClient.patch(
        `/modelosprocedimentos/${modeloProcedimentoId}/etapas/reordenar`,
        {
          idsEtapas: stageIds,
        }
      );
    },
  };

/**
 * Implementação API do serviço de Templates de Etapas
 */
export const ApiStageTemplateService: IStageTemplateService = {
  async getAll(): Promise<StageTemplate[]> {
    return apiClient.get<StageTemplate[]>("/modelosetapas");
  },

  async getById(id: string): Promise<StageTemplate | undefined> {
    try {
      return await apiClient.get<StageTemplate>(`/modelosetapas/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<StageTemplate, "id">): Promise<StageTemplate> {
    return apiClient.post<StageTemplate>("/modelosetapas", data);
  },

  async update(
    id: string,
    data: Partial<StageTemplate>
  ): Promise<StageTemplate> {
    return apiClient.put<StageTemplate>(`/modelosetapas/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/modelosetapas/${id}`);
  },

  async searchByName(name: string): Promise<StageTemplate[]> {
    const query = buildQueryString({ nome: name });
    return apiClient.get<StageTemplate[]>(`/modelosetapas/buscar${query}`);
  },
};
