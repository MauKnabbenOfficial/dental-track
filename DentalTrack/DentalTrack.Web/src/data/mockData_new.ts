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

// Mock Data
export const usuarios: Usuario[] = [
  {
    id: "1",
    nome: "Dr. Carlos Silva",
    perfilNome: "admin",
    email: "carlos@dentaltrack.com",
    especialidade: "Implantodontia",
  },
  {
    id: "2",
    nome: "Dra. Marina Santos",
    perfilNome: "dentist",
    email: "marina@dentaltrack.com",
    especialidade: "Ortodontia",
  },
  {
    id: "3",
    nome: "Dr. Roberto Lima",
    perfilNome: "dentist",
    email: "roberto@dentaltrack.com",
    especialidade: "Endodontia",
  },
  {
    id: "4",
    nome: "Ana Paula Costa",
    perfilNome: "reception",
    email: "ana@dentaltrack.com",
  },
  {
    id: "5",
    nome: "Juliana Mendes",
    perfilNome: "reception",
    email: "juliana@dentaltrack.com",
  },
];

export const pacientes: Paciente[] = [
  {
    id: "1",
    nome: "João Pedro Oliveira",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-1234",
    email: "joao@email.com",
    dataNascimento: "1985-03-15",
    convenioId: "UNIMED12345",
    convenioNome: "Unimed",
    cep: "01310-100",
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Apto 45",
    bairro: "Jardins",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-01-10",
  },
  {
    id: "2",
    nome: "Maria Fernanda Silva",
    cpf: "234.567.890-11",
    telefone: "(11) 98888-5678",
    email: "maria@email.com",
    dataNascimento: "1990-07-22",
    convenioNome: "Particular",
    cep: "01310-200",
    logradouro: "Av. Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-02-15",
  },
  {
    id: "3",
    nome: "Carlos Eduardo Souza",
    cpf: "345.678.901-22",
    telefone: "(11) 97777-9012",
    email: "carlos@email.com",
    dataNascimento: "1978-11-08",
    convenioId: "AMIL67890",
    convenioNome: "Amil",
    cep: "01305-100",
    logradouro: "Rua Augusta",
    numero: "500",
    complemento: "Sala 12",
    bairro: "Consolação",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-03-01",
  },
  {
    id: "4",
    nome: "Ana Beatriz Costa",
    cpf: "456.789.012-33",
    telefone: "(11) 96666-3456",
    email: "ana.b@email.com",
    dataNascimento: "1995-01-30",
    convenioNome: "Bradesco Saúde",
    cep: "01426-001",
    logradouro: "Rua Oscar Freire",
    numero: "200",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-03-20",
  },
  {
    id: "5",
    nome: "Roberto Almeida",
    cpf: "567.890.123-44",
    telefone: "(11) 95555-7890",
    email: "roberto@email.com",
    dataNascimento: "1982-06-12",
    convenioNome: "Particular",
    cep: "01419-002",
    logradouro: "Alameda Santos",
    numero: "800",
    bairro: "Cerqueira César",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-04-05",
  },
  {
    id: "6",
    nome: "Fernanda Lima",
    cpf: "678.901.234-55",
    telefone: "(11) 94444-1234",
    email: "fernanda@email.com",
    dataNascimento: "1988-09-25",
    convenioId: "SULAMERICA11111",
    convenioNome: "SulAmérica",
    cep: "01414-001",
    logradouro: "Rua Haddock Lobo",
    numero: "350",
    complemento: "Bloco B",
    bairro: "Jardim Paulista",
    cidade: "São Paulo",
    estado: "SP",
    dtCadastro: "2024-04-18",
  },
];

export const modelosProcedimentos: ModeloProcedimento[] = [
  {
    id: "1",
    nome: "Implante Dentário Unitário",
    custoBase: 3500,
    duracaoEstimada: "3-6 meses",
    descricao: "Procedimento cirúrgico para substituição de dente perdido",
    categoria: "Implantodontia",
  },
  {
    id: "2",
    nome: "Tratamento de Canal",
    custoBase: 800,
    duracaoEstimada: "1-3 sessões",
    descricao: "Remoção da polpa dentária infectada",
    categoria: "Endodontia",
  },
  {
    id: "3",
    nome: "Aparelho Ortodôntico Fixo",
    custoBase: 4000,
    duracaoEstimada: "18-36 meses",
    descricao: "Correção do alinhamento dentário",
    categoria: "Ortodontia",
  },
  {
    id: "4",
    nome: "Extração de Siso",
    custoBase: 450,
    duracaoEstimada: "1 sessão",
    descricao: "Remoção cirúrgica do terceiro molar",
    categoria: "Cirurgia",
  },
  {
    id: "5",
    nome: "Clareamento Dental",
    custoBase: 1200,
    duracaoEstimada: "2-4 sessões",
    descricao: "Procedimento estético para branqueamento",
    categoria: "Estética",
  },
  {
    id: "6",
    nome: "Profilaxia Completa",
    custoBase: 180,
    duracaoEstimada: "1 sessão",
    descricao: "Limpeza profissional e aplicação de flúor",
    categoria: "Preventivo",
  },
  {
    id: "7",
    nome: "Restauração em Resina",
    custoBase: 250,
    duracaoEstimada: "1 sessão",
    descricao: "Restauração estética de cavidades",
    categoria: "Dentística",
  },
  {
    id: "8",
    nome: "Prótese Total",
    custoBase: 2800,
    duracaoEstimada: "4-6 semanas",
    descricao: "Prótese removível completa",
    categoria: "Prótese",
  },
];

export const etapasModeloProcedimento: EtapaModeloProcedimento[] = [
  // Implante Dentário
  {
    id: "1",
    modeloProcedimentoId: "1",
    nome: "Consulta Inicial e Avaliação",
    ordemExibicao: 1,
    descricao: "Avaliação clínica e radiográfica",
    itensChecklist: [
      "Anamnese completa",
      "Exame clínico",
      "Solicitação de exames",
    ],
  },
  {
    id: "2",
    modeloProcedimentoId: "1",
    nome: "Exames de Imagem",
    ordemExibicao: 2,
    descricao: "Tomografia e radiografias",
    itensChecklist: [
      "Tomografia computadorizada",
      "Radiografia panorâmica",
      "Análise óssea",
    ],
  },
  {
    id: "3",
    modeloProcedimentoId: "1",
    nome: "Planejamento Cirúrgico",
    ordemExibicao: 3,
    descricao: "Definição do plano de tratamento",
    itensChecklist: [
      "Guia cirúrgico",
      "Escolha do implante",
      "Orçamento aprovado",
    ],
  },
  {
    id: "4",
    modeloProcedimentoId: "1",
    nome: "Cirurgia de Implante",
    ordemExibicao: 4,
    descricao: "Instalação do implante",
    itensChecklist: [
      "Checklist pré-operatório",
      "Anestesia",
      "Instalação",
      "Sutura",
    ],
  },
  {
    id: "5",
    modeloProcedimentoId: "1",
    nome: "Período de Osseointegração",
    ordemExibicao: 5,
    descricao: "Aguardar cicatrização (3-6 meses)",
    itensChecklist: ["Acompanhamento mensal", "Raio-X de controle"],
  },
  {
    id: "6",
    modeloProcedimentoId: "1",
    nome: "Reabertura e Moldagem",
    ordemExibicao: 6,
    descricao: "Segunda fase cirúrgica",
    itensChecklist: ["Reabertura", "Instalação do cicatrizador", "Moldagem"],
  },
  {
    id: "7",
    modeloProcedimentoId: "1",
    nome: "Instalação da Prótese",
    ordemExibicao: 7,
    descricao: "Colocação da coroa definitiva",
    itensChecklist: [
      "Prova da prótese",
      "Ajuste oclusal",
      "Cimentação/parafusamento",
    ],
  },
  {
    id: "8",
    modeloProcedimentoId: "1",
    nome: "Alta e Manutenção",
    ordemExibicao: 8,
    descricao: "Orientações finais",
    itensChecklist: ["Orientações de higiene", "Agendamento de retorno"],
  },

  // Tratamento de Canal
  {
    id: "9",
    modeloProcedimentoId: "2",
    nome: "Diagnóstico e Anestesia",
    ordemExibicao: 1,
    descricao: "Confirmação diagnóstica",
    itensChecklist: ["Teste de vitalidade", "Raio-X periapical", "Anestesia"],
  },
  {
    id: "10",
    modeloProcedimentoId: "2",
    nome: "Abertura e Instrumentação",
    ordemExibicao: 2,
    descricao: "Acesso e preparo dos canais",
    itensChecklist: [
      "Isolamento absoluto",
      "Abertura coronária",
      "Odontometria",
      "Instrumentação",
    ],
  },
  {
    id: "11",
    modeloProcedimentoId: "2",
    nome: "Obturação",
    ordemExibicao: 3,
    descricao: "Selamento dos canais",
    itensChecklist: [
      "Secagem",
      "Obturação",
      "Raio-X final",
      "Restauração provisória",
    ],
  },
  {
    id: "12",
    modeloProcedimentoId: "2",
    nome: "Restauração Definitiva",
    ordemExibicao: 4,
    descricao: "Restauração do dente",
    itensChecklist: [
      "Remoção provisório",
      "Restauração definitiva",
      "Ajuste oclusal",
    ],
  },

  // Ortodontia
  {
    id: "13",
    modeloProcedimentoId: "3",
    nome: "Documentação Ortodôntica",
    ordemExibicao: 1,
    descricao: "Exames iniciais",
    itensChecklist: [
      "Fotos intra/extra orais",
      "Radiografias",
      "Modelos de estudo",
      "Cefalometria",
    ],
  },
  {
    id: "14",
    modeloProcedimentoId: "3",
    nome: "Planejamento",
    ordemExibicao: 2,
    descricao: "Elaboração do plano",
    itensChecklist: [
      "Análise cefalométrica",
      "Plano de tratamento",
      "Apresentação ao paciente",
    ],
  },
  {
    id: "15",
    modeloProcedimentoId: "3",
    nome: "Instalação do Aparelho",
    ordemExibicao: 3,
    descricao: "Colagem dos brackets",
    itensChecklist: ["Profilaxia", "Colagem", "Inserção do arco inicial"],
  },
  {
    id: "16",
    modeloProcedimentoId: "3",
    nome: "Manutenções Mensais",
    ordemExibicao: 4,
    descricao: "Ativações periódicas",
    itensChecklist: ["Avaliação", "Troca de ligaduras", "Progressão de arcos"],
  },
  {
    id: "17",
    modeloProcedimentoId: "3",
    nome: "Remoção e Contenção",
    ordemExibicao: 5,
    descricao: "Finalização",
    itensChecklist: [
      "Remoção do aparelho",
      "Instalação da contenção",
      "Documentação final",
    ],
  },
];

export const atendimentos: Atendimento[] = [
  {
    id: "1",
    pacienteId: "1",
    modeloProcedimentoId: "1",
    dataInicio: "2024-09-15",
    status: "em_andamento",
    etapaAtualId: "s5",
    dentistaId: "1",
    custoTotal: 3800,
    observacoes: "Paciente com boa saúde sistêmica",
  },
  {
    id: "2",
    pacienteId: "2",
    modeloProcedimentoId: "2",
    dataInicio: "2024-11-20",
    status: "em_andamento",
    etapaAtualId: "s10",
    dentistaId: "3",
    custoTotal: 850,
  },
  {
    id: "3",
    pacienteId: "3",
    modeloProcedimentoId: "3",
    dataInicio: "2024-06-01",
    status: "em_andamento",
    etapaAtualId: "s16",
    dentistaId: "2",
    custoTotal: 4500,
  },
  {
    id: "4",
    pacienteId: "4",
    modeloProcedimentoId: "4",
    dataInicio: "2024-12-01",
    status: "agendado",
    etapaAtualId: "s1",
    dentistaId: "1",
    custoTotal: 500,
  },
  {
    id: "5",
    pacienteId: "5",
    modeloProcedimentoId: "5",
    dataInicio: "2024-11-01",
    status: "concluido",
    etapaAtualId: "s4",
    dentistaId: "2",
    custoTotal: 1200,
  },
  {
    id: "6",
    pacienteId: "6",
    modeloProcedimentoId: "6",
    dataInicio: "2024-12-05",
    status: "agendado",
    etapaAtualId: "s1",
    dentistaId: "3",
    custoTotal: 180,
  },
];

export const etapasAtendimento: EtapaAtendimento[] = [
  // Treatment 1 - Implante (João Pedro)
  {
    id: "s1",
    atendimentoId: "1",
    nome: "Consulta Inicial e Avaliação",
    status: "concluido",
    ordemExibicao: 1,
    dataAgendada: "2024-09-15",
    dataConclusao: "2024-09-15",
  },
  {
    id: "s2",
    atendimentoId: "1",
    nome: "Exames de Imagem",
    status: "concluido",
    ordemExibicao: 2,
    dataAgendada: "2024-09-22",
    dataConclusao: "2024-09-22",
    anexos: ["tomografia_joao.pdf"],
  },
  {
    id: "s3",
    atendimentoId: "1",
    nome: "Planejamento Cirúrgico",
    status: "concluido",
    ordemExibicao: 3,
    dataAgendada: "2024-09-30",
    dataConclusao: "2024-10-02",
  },
  {
    id: "s4",
    atendimentoId: "1",
    nome: "Cirurgia de Implante",
    status: "concluido",
    ordemExibicao: 4,
    dataAgendada: "2024-10-15",
    dataConclusao: "2024-10-15",
    observacoes: "Implante Nobel 4.3x11.5mm instalado com sucesso",
  },
  {
    id: "s5",
    atendimentoId: "1",
    nome: "Período de Osseointegração",
    status: "em_andamento",
    ordemExibicao: 5,
    dataAgendada: "2024-10-16",
    observacoes: "Acompanhamento em andamento",
  },
  {
    id: "s6",
    atendimentoId: "1",
    nome: "Reabertura e Moldagem",
    status: "pendente",
    ordemExibicao: 6,
    dataAgendada: "2025-01-15",
  },
  {
    id: "s7",
    atendimentoId: "1",
    nome: "Instalação da Prótese",
    status: "pendente",
    ordemExibicao: 7,
    dataAgendada: "2025-02-01",
  },
  {
    id: "s8",
    atendimentoId: "1",
    nome: "Alta e Manutenção",
    status: "pendente",
    ordemExibicao: 8,
    dataAgendada: "2025-02-15",
  },

  // Treatment 2 - Canal (Maria)
  {
    id: "s9",
    atendimentoId: "2",
    nome: "Diagnóstico e Anestesia",
    status: "concluido",
    ordemExibicao: 1,
    dataAgendada: "2024-11-20",
    dataConclusao: "2024-11-20",
  },
  {
    id: "s10",
    atendimentoId: "2",
    nome: "Abertura e Instrumentação",
    status: "em_andamento",
    ordemExibicao: 2,
    dataAgendada: "2024-11-27",
  },
  {
    id: "s11",
    atendimentoId: "2",
    nome: "Obturação",
    status: "pendente",
    ordemExibicao: 3,
    dataAgendada: "2024-12-04",
  },
  {
    id: "s12",
    atendimentoId: "2",
    nome: "Restauração Definitiva",
    status: "pendente",
    ordemExibicao: 4,
    dataAgendada: "2024-12-11",
  },

  // Treatment 3 - Ortodontia (Carlos)
  {
    id: "s13",
    atendimentoId: "3",
    nome: "Documentação Ortodôntica",
    status: "concluido",
    ordemExibicao: 1,
    dataAgendada: "2024-06-01",
    dataConclusao: "2024-06-01",
  },
  {
    id: "s14",
    atendimentoId: "3",
    nome: "Planejamento",
    status: "concluido",
    ordemExibicao: 2,
    dataAgendada: "2024-06-15",
    dataConclusao: "2024-06-15",
  },
  {
    id: "s15",
    atendimentoId: "3",
    nome: "Instalação do Aparelho",
    status: "concluido",
    ordemExibicao: 3,
    dataAgendada: "2024-07-01",
    dataConclusao: "2024-07-01",
  },
  {
    id: "s16",
    atendimentoId: "3",
    nome: "Manutenções Mensais",
    status: "em_andamento",
    ordemExibicao: 4,
    dataAgendada: "2024-08-01",
    observacoes: "Manutenção #5 realizada em Nov/2024",
  },
  {
    id: "s17",
    atendimentoId: "3",
    nome: "Remoção e Contenção",
    status: "pendente",
    ordemExibicao: 5,
    dataAgendada: "2026-01-01",
  },
];

export const lancamentosFinanceiros: LancamentoFinanceiro[] = [
  {
    id: "1",
    atendimentoId: "1",
    tipo: "receita",
    valor: 1900,
    dataLancamento: "2024-09-15",
    descricao: "Entrada - Implante",
    categoria: "Implantodontia",
    tipoResponsavel: "paciente",
    pacienteId: "1",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "2",
    atendimentoId: "1",
    tipo: "receita",
    valor: 1900,
    dataLancamento: "2024-10-15",
    descricao: "Parcela 2 - Implante",
    categoria: "Implantodontia",
    tipoResponsavel: "paciente",
    pacienteId: "1",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "3",
    atendimentoId: "1",
    tipo: "despesa",
    valor: 450,
    dataLancamento: "2024-10-10",
    descricao: "Componente Nobel",
    categoria: "Material",
    tipoResponsavel: "clinica",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "4",
    atendimentoId: "2",
    tipo: "receita",
    valor: 850,
    dataLancamento: "2024-11-20",
    descricao: "Tratamento de Canal",
    categoria: "Endodontia",
    tipoResponsavel: "paciente",
    pacienteId: "2",
    criadoPorId: "3",
    status: "pago",
  },
  {
    id: "5",
    atendimentoId: "3",
    tipo: "receita",
    valor: 1500,
    dataLancamento: "2024-06-01",
    descricao: "Entrada - Ortodontia",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "6",
    atendimentoId: "3",
    tipo: "receita",
    valor: 500,
    dataLancamento: "2024-07-01",
    descricao: "Mensalidade Jul",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "7",
    atendimentoId: "3",
    tipo: "receita",
    valor: 500,
    dataLancamento: "2024-08-01",
    descricao: "Mensalidade Ago",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "8",
    atendimentoId: "3",
    tipo: "receita",
    valor: 500,
    dataLancamento: "2024-09-01",
    descricao: "Mensalidade Set",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "9",
    atendimentoId: "3",
    tipo: "receita",
    valor: 500,
    dataLancamento: "2024-10-01",
    descricao: "Mensalidade Out",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "10",
    atendimentoId: "3",
    tipo: "receita",
    valor: 500,
    dataLancamento: "2024-11-01",
    descricao: "Mensalidade Nov",
    categoria: "Ortodontia",
    tipoResponsavel: "paciente",
    pacienteId: "3",
    criadoPorId: "2",
    status: "pago",
  },
  {
    id: "11",
    atendimentoId: "5",
    tipo: "receita",
    valor: 1200,
    dataLancamento: "2024-11-01",
    descricao: "Clareamento",
    categoria: "Estética",
    tipoResponsavel: "paciente",
    pacienteId: "5",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "12",
    atendimentoId: "6",
    tipo: "receita",
    valor: 180,
    dataLancamento: "2024-12-05",
    descricao: "Profilaxia",
    categoria: "Preventivo",
    tipoResponsavel: "paciente",
    pacienteId: "6",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "13",
    atendimentoId: "1",
    tipo: "despesa",
    valor: 120,
    dataLancamento: "2024-09-15",
    descricao: "Material cirúrgico",
    categoria: "Material",
    tipoResponsavel: "clinica",
    criadoPorId: "1",
    status: "pago",
  },
  {
    id: "14",
    atendimentoId: "3",
    tipo: "despesa",
    valor: 280,
    dataLancamento: "2024-07-01",
    descricao: "Brackets cerâmicos",
    categoria: "Material",
    tipoResponsavel: "clinica",
    criadoPorId: "2",
    status: "pago",
  },
];

// Aliases de compatibilidade temporários (remover após migração completa)
export type User = Usuario;
export type Patient = Paciente;
export type ProcedureTemplate = ModeloProcedimento;
export type ProcedureTemplateStage = EtapaModeloProcedimento;
export type Treatment = Atendimento;
export type TreatmentStage = EtapaAtendimento;
export type FinancialRecord = LancamentoFinanceiro;

// Exports para compatibilidade
export const users = usuarios;
export const patients = pacientes;
export const procedureTemplates = modelosProcedimentos;
export const procedureTemplateStages = etapasModeloProcedimento;
export const treatments = atendimentos;
export const treatmentStages = etapasAtendimento;
export const financialRecords = lancamentosFinanceiros;

// Helper functions
export const getPatientById = (id: string) =>
  pacientes.find((p) => p.id === id);
export const getTemplateById = (id: string) =>
  modelosProcedimentos.find((t) => t.id === id);
export const getUserById = (id: string) => usuarios.find((u) => u.id === id);
export const getStagesByTemplateId = (modeloProcedimentoId: string) =>
  etapasModeloProcedimento
    .filter((s) => s.modeloProcedimentoId === modeloProcedimentoId)
    .sort((a, b) => a.ordemExibicao - b.ordemExibicao);
export const getStagesByTreatmentId = (treatmentId: string) =>
  etapasAtendimento
    .filter((s) => s.atendimentoId === treatmentId)
    .sort((a, b) => a.ordemExibicao - b.ordemExibicao);
export const getTreatmentsByPatientId = (patientId: string) =>
  atendimentos.filter((t) => t.pacienteId === patientId);
export const getFinancialByTreatmentId = (treatmentId: string) =>
  lancamentosFinanceiros.filter((f) => f.atendimentoId === treatmentId);

// Dashboard metrics
export const getDashboardMetrics = () => {
  const today = new Date().toISOString().split("T")[0];
  const todayTreatments = atendimentos.filter(
    (t) =>
      t.dataInicio === today ||
      etapasAtendimento.some(
        (s) => s.atendimentoId === t.id && s.dataAgendada === today
      )
  );
  const inProgress = atendimentos.filter((t) => t.status === "em_andamento");
  const monthIncome = lancamentosFinanceiros
    .filter(
      (f) => f.tipo === "receita" && f.dataLancamento.startsWith("2024-12")
    )
    .reduce((sum, f) => sum + f.valor, 0);

  return {
    todayAppointments: 8,
    inProgressProcedures: inProgress.length,
    monthlyRevenue: 12580,
  };
};
