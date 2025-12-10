// Types - Normalized to match Backend DTOs
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfilId?: string;
  perfilNome: "admin" | "dentist" | "reception"; // normalized enum
  especialidade?: string;
  avatar?: string;
  ativo?: boolean;
  dtCadastro?: string;
}

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  convenioId?: string;
  convenioNome?: string;
  // Address fields
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  ativo?: boolean;
  dtCadastro?: string;
}

export interface ModeloProcedimento {
  id: string;
  nome: string;
  custoBase: number;
  duracaoEstimada: string;
  descricao: string;
  categoria: string;
  ativo?: boolean;
  dtCadastro?: string;
  etapas?: EtapaModeloProcedimento[];
}

export interface EtapaModeloProcedimento {
  id: string;
  modeloProcedimentoId: string;
  nome: string;
  ordemExibicao: number;
  descricao: string;
  itensChecklist: string[];
  dtCadastro?: string;
}

export interface Atendimento {
  id: string;
  pacienteId: string;
  pacienteNome?: string;
  modeloProcedimentoId: string;
  modeloProcedimentoNome?: string;
  dentistaId: string;
  dentistaNome?: string;
  dataInicio: string;
  status: "agendado" | "em_andamento" | "concluido" | "cancelado";
  etapaAtualId?: string;
  custoTotal: number;
  observacoes?: string;
  dtCadastro?: string;
  etapas?: EtapaAtendimento[];
}

export interface EtapaAtendimento {
  id: string;
  atendimentoId: string;
  nome: string;
  status: "pendente" | "em_andamento" | "concluido" | "pulado";
  ordemExibicao: number;
  dataAgendada?: string;
  dataConclusao?: string;
  observacoes?: string;
  anexos?: string[];
  itensChecklist?: string[];
  checklistConcluido?: string[];
  dtCadastro?: string;
}

export interface LancamentoFinanceiro {
  id: string;
  atendimentoId: string;
  pacienteId?: string;
  pacienteNome?: string;
  criadoPorId: string;
  criadoPorNome?: string;
  tipo: "receita" | "despesa";
  valor: number;
  dataLancamento: string;
  dataPagamento?: string;
  descricao: string;
  categoria: string;
  tipoResponsavel: "paciente" | "clinica";
  status: "pendente" | "pago" | "cancelado";
  dtCadastro?: string;
}

// NOTE: Example datasets have been moved to `src/data/examples/mockData.json`.
// The frontend must not use runtime mocks. Keep these types for migration
// and compile-time compatibility only. Remove or replace usages of the
// example arrays with API calls to the backend.

// Aliases de compatibilidade temporários (remover após migração completa)
export type User = Usuario;
export type Patient = Paciente;
export type ProcedureTemplate = ModeloProcedimento;
export type ProcedureTemplateStage = EtapaModeloProcedimento;
export type Treatment = Atendimento;
export type TreatmentStage = EtapaAtendimento;
export type FinancialRecord = LancamentoFinanceiro;

// No runtime exports of example data (mocks removed). See JSON file above.
