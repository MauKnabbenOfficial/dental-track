import { Treatment, TreatmentStage } from "@/data/mockData";
import { IBaseService, FilterOptions, PaginatedResult } from "./IBaseService";

/**
 * Interface para o serviço de Tratamentos
 */
export interface ITreatmentService extends IBaseService<Treatment> {
  /**
   * Busca tratamentos com filtros e paginação
   */
  search(filters: TreatmentFilterOptions): Promise<PaginatedResult<Treatment>>;

  /**
   * Busca tratamentos por paciente
   */
  getByPatientId(patientId: string): Promise<Treatment[]>;

  /**
   * Busca tratamentos por dentista
   */
  getByDentistId(dentistId: string): Promise<Treatment[]>;

  /**
   * Busca tratamentos por status
   */
  getByStatus(status: Treatment["status"]): Promise<Treatment[]>;

  /**
   * Cria um tratamento completo com suas etapas
   */
  createWithStages(
    treatment: Omit<Treatment, "id">,
    stages: Omit<TreatmentStage, "id" | "treatmentId">[]
  ): Promise<{ treatment: Treatment; stages: TreatmentStage[] }>;
}

/**
 * Interface para o serviço de Etapas de Tratamentos
 */
export interface ITreatmentStageService extends IBaseService<TreatmentStage> {
  /**
   * Busca etapas por tratamento
   */
  getByTreatmentId(treatmentId: string): Promise<TreatmentStage[]>;

  /**
   * Busca etapa por id — alguns endpoints no backend requerem `atendimentoId` no caminho.
   */
  getById(
    id: string,
    atendimentoId?: string
  ): Promise<TreatmentStage | undefined>;

  /**
   * Atualiza status de uma etapa
   */
  updateStatus(
    id: string,
    status: TreatmentStage["status"],
    dateCompleted?: string,
    atendimentoId?: string
  ): Promise<TreatmentStage>;

  /**
   * Atualiza checklist de uma etapa
   */
  updateChecklist(
    id: string,
    completedItems: string[],
    atendimentoId?: string
  ): Promise<TreatmentStage>;

  /**
   * Adiciona anexo a uma etapa
   */
  addAttachment(
    id: string,
    attachment: string,
    atendimentoId?: string
  ): Promise<TreatmentStage>;

  /**
   * Remove anexo de uma etapa
   */
  removeAttachment(
    id: string,
    attachment: string,
    atendimentoId?: string
  ): Promise<TreatmentStage>;
}

export interface TreatmentFilterOptions extends FilterOptions {
  patientId?: string;
  dentistId?: string;
  status?: Treatment["status"];
  dataInicioFrom?: string;
  dataInicioTo?: string;
}
