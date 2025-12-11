import { ProcedureTemplate, ProcedureTemplateStage } from "@/types/backendDtos";
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

    async getById(
      id: string,
      modeloProcedimentoId?: string
    ): Promise<ProcedureTemplateStage | undefined> {
      try {
        if (modeloProcedimentoId) {
          return await apiClient.get<ProcedureTemplateStage>(
            `/modelosprocedimentos/${modeloProcedimentoId}/etapas/${id}`
          );
        }
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
      const modeloId =
        (data as any).ModeloProcedimentoId ||
        (data as any).modeloProcedimentoId;
      // show a dev toast so the developer sees the outgoing attempt
      if (import.meta.env.DEV) {
        try {
          toast.info(`Enviando etapa para backend (modeloId=${modeloId})...`);
        } catch {}
      }
      try {
        const res = await apiClient.post<ProcedureTemplateStage>(
          `/modelosprocedimentos/${modeloId}/etapas`,
          data
        );
        if (import.meta.env.DEV) {
          try {
            toast.success(`Etapa enviada (modeloId=${modeloId})`);
          } catch {}
        }
        return res;
      } catch (error) {
        // show an error toast in dev so it's visible
        try {
          // @ts-ignore
          toast.error(
            `Falha ao enviar etapa (modeloId=${modeloId}): ${
              (error as any)?.message || JSON.stringify(error)
            }`
          );
        } catch {}
        throw error;
      }
    },

    async update(
      id: string,
      data: Partial<ProcedureTemplateStage>,
      modeloProcedimentoId?: string
    ): Promise<ProcedureTemplateStage> {
      if (modeloProcedimentoId) {
        return apiClient.put<ProcedureTemplateStage>(
          `/modelosprocedimentos/${modeloProcedimentoId}/etapas/${id}`,
          data
        );
      }
      return apiClient.put<ProcedureTemplateStage>(
        `/modelosetapas/${id}`,
        data
      );
    },

    async delete(id: string, modeloProcedimentoId?: string): Promise<void> {
      if (modeloProcedimentoId) {
        return apiClient.delete(
          `/modelosprocedimentos/${modeloProcedimentoId}/etapas/${id}`
        );
      }
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
      return apiClient.patch(`/modelosprocedimentos/etapas/trocar-ordem`, {
        idsEtapas: [stageId1, stageId2],
      });
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
  async getAll(): Promise<any[]> {
    return apiClient.get<any[]>("/modelosetapas");
  },

  async getById(id: string): Promise<any | undefined> {
    try {
      return await apiClient.get<any>(`/modelosetapas/${id}`);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  async create(data: Omit<any, "id">): Promise<any> {
    return apiClient.post<any>("/modelosetapas", data);
  },

  async update(id: string, data: Partial<any>): Promise<any> {
    return apiClient.put<any>(`/modelosetapas/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/modelosetapas/${id}`);
  },

  async searchByName(name: string): Promise<any[]> {
    const query = buildQueryString({ nome: name });
    return apiClient.get<any[]>(`/modelosetapas/buscar${query}`);
  },
};
