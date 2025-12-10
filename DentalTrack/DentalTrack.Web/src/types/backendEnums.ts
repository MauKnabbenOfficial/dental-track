// Enums mirroring backend C# enums (names/values in Portuguese PascalCase)
export enum StatusEtapa {
  Pendente = "Pendente",
  EmAndamento = "EmAndamento",
  Concluido = "Concluido",
  Pulado = "Pulado",
}

export enum StatusAtendimento {
  Agendado = "Agendado",
  EmAndamento = "EmAndamento",
  Concluido = "Concluido",
  Cancelado = "Cancelado",
}

export enum TipoLancamento {
  Receita = "Receita",
  Despesa = "Despesa",
}

export enum TipoResponsavel {
  Paciente = "Paciente",
  Clinica = "Clinica",
}

export enum StatusLancamento {
  Pendente = "Pendente",
  Pago = "Pago",
  Cancelado = "Cancelado",
}
