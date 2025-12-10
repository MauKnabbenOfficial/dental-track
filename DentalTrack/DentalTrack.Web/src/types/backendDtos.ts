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
  id?: string;
  nome?: string;
  email?: string;
  perfilNome?: string;
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
  id?: string;
  atendimentoId?: string;
  pacienteId?: string;
  pacienteNome?: string;
  criadoPor?: string;
  tipo?: string;
  valor?: number;
  dataLancamento?: string;
  dataPagamento?: string;
  descricao?: string;
  categoria?: string;
  tipoResponsavel?: string;
  status?: string;
  dtCadastro?: string;
}

// Backwards-compatible aliases (keep existing frontend type names)
export type User = UsuarioDto;
export type Patient = PacienteDto;
export type Treatment = AtendimentoDto;
export type TreatmentStage = EtapaAtendimentoDto;
export type FinancialRecord = LancamentoFinanceiroDto;
