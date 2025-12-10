export interface EtapaModeloProcedimentoDto {
  Id: string;
  ModeloProcedimentoId: string;
  Nome: string;
  OrdemExibicao: number;
  Descricao: string;
  ItensChecklist: string[];
}

export interface ModeloProcedimentoDto {
  Id: string;
  Nome: string;
  CustoBase: number;
  DuracaoEstimada: string;
  Descricao: string;
  Categoria: string;
  Ativo: boolean;
  DtCadastro: string;
  Etapas?: EtapaModeloProcedimentoDto[];
}

export type ProcedureTemplate = ModeloProcedimentoDto;
export type ProcedureTemplateStage = EtapaModeloProcedimentoDto;

// Usuários (backend: UsuarioDto)
export interface UsuarioDto {
  Id: string;
  id?: string;
  Nome?: string;
  nome?: string;
  Email?: string;
  email?: string;
  PerfilNome?: string;
  perfilNome?: string;
  Especialidade?: string;
  especialidade?: string;
}

// Pacientes (backend: PacienteDto)
export interface PacienteDto {
  Id: string;
  id?: string;
  Nome?: string;
  nome?: string;
  Cpf?: string;
  cpf?: string;
  Telefone?: string;
  telefone?: string;
  DataNascimento?: string;
  dataNascimento?: string;
}

// Atendimentos / Tratamentos (backend: AtendimentoDto)
export interface AtendimentoDto {
  Id: string;
  id?: string;
  PacienteId?: string;
  pacienteId?: string;
  ModeloProcedimentoId?: string;
  modeloProcedimentoId?: string;
  DentistaId?: string;
  dentistaId?: string;
  DataInicio?: string;
  dataInicio?: string;
  CustoTotal?: number;
  custoTotal?: number;
  Observacoes?: string;
  observacoes?: string;
  Status?: string;
  status?: string;
}

// Etapa de Atendimento (backend: possibly EtapaAtendimentoDto)
export interface EtapaAtendimentoDto {
  Id: string;
  id?: string;
  AtendimentoId?: string;
  atendimentoId?: string;
  Nome?: string;
  nome?: string;
  Descricao?: string;
  descricao?: string;
  OrdemExibicao?: number;
  ordemExibicao?: number;
  DataPrevista?: string;
  dataPrevista?: string;
  Concluida?: boolean;
  concluida?: boolean;
}

// Lançamento Financeiro (backend: LancamentoFinanceiroDto)
export interface LancamentoFinanceiroDto {
  Id: string;
  id?: string;
  Valor?: number;
  valor?: number;
  Status?: string;
  status?: string;
  ResponsibleType?: string;
  responsibleType?: string;
  AtendimentoId?: string;
  atendimentoId?: string;
  CreatedBy?: string;
  createdBy?: string;
  PaymentDate?: string;
  paymentDate?: string;
}

// Backwards-compatible aliases (keep existing frontend type names)
export type User = UsuarioDto;
export type Patient = PacienteDto;
export type Treatment = AtendimentoDto;
export type TreatmentStage = EtapaAtendimentoDto;
export type FinancialRecord = LancamentoFinanceiroDto;
