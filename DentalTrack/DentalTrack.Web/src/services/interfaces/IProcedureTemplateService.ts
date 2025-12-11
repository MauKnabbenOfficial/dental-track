import { ProcedureTemplate, ProcedureTemplateStage } from "@/types/backendDtos";
import { IBaseService } from "./IBaseService";
import { StageTemplate } from "@/contexts/DataContext";

/**
 * Interface para o serviço de Templates de Procedimentos
 */
export interface IProcedureTemplateService
  extends IBaseService<ProcedureTemplate> {
  /**
   * Busca templates por categoria
   */
  getByCategory(category: string): Promise<ProcedureTemplate[]>;

  /**
   * Lista todas as categorias disponíveis
   */
  getCategories(): Promise<string[]>;
}

/**
 * Interface para o serviço de Etapas de Templates de Procedimentos
 */
export interface IProcedureTemplateStageService
  extends IBaseService<ProcedureTemplateStage> {
  /**
   * Busca etapas por template
   */
  getByTemplateId(
    modeloProcedimentoId: string
  ): Promise<ProcedureTemplateStage[]>;

  /**
   * Busca etapa por id — alguns endpoints no backend requerem `modeloProcedimentoId` no caminho.
   */
  getById(
    id: string,
    modeloProcedimentoId?: string
  ): Promise<ProcedureTemplateStage | undefined>;

  /**
   * Atualiza uma etapa — quando disponível, o `modeloProcedimentoId` será usado na URL aninhada.
   */
  update(
    id: string,
    data: Partial<ProcedureTemplateStage>,
    modeloProcedimentoId?: string
  ): Promise<ProcedureTemplateStage>;

  /**
   * Exclui uma etapa — quando disponível, o `modeloProcedimentoId` será usado na URL aninhada.
   */
  delete(id: string, modeloProcedimentoId?: string): Promise<void>;

  /**
   * Reordena etapas (troca posição de duas etapas)
   */
  swapOrder(stageId1: string, stageId2: string): Promise<void>;

  /**
   * Atualiza a ordem de todas as etapas de um template
   */
  reorderStages(
    modeloProcedimentoId: string,
    stageIds: string[]
  ): Promise<void>;
}

/**
 * Interface para o serviço de Templates de Etapas (reutilizáveis)
 */
export interface IStageTemplateService extends IBaseService<StageTemplate> {
  /**
   * Busca templates por nome (parcial)
   */
  searchByName(name: string): Promise<StageTemplate[]>;
}
