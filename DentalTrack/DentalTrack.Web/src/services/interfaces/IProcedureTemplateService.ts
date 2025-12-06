import { ProcedureTemplate, ProcedureTemplateStage } from "@/data/mockData";
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
  getByTemplateId(templateId: string): Promise<ProcedureTemplateStage[]>;

  /**
   * Reordena etapas (troca posição de duas etapas)
   */
  swapOrder(stageId1: string, stageId2: string): Promise<void>;

  /**
   * Atualiza a ordem de todas as etapas de um template
   */
  reorderStages(templateId: string, stageIds: string[]): Promise<void>;
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
