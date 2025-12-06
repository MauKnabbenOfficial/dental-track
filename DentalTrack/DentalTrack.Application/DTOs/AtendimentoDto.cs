namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class AtendimentoDto
    {
        public Guid Id { get; set; }
        public Guid PacienteId { get; set; }
        public string PacienteNome { get; set; } = string.Empty;
        public Guid ModeloProcedimentoId { get; set; }
        public string ModeloProcedimentoNome { get; set; } = string.Empty;
        public Guid DentistaId { get; set; }
        public string DentistaNome { get; set; } = string.Empty;
        public DateTime DataInicio { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid? EtapaAtualId { get; set; }
        public decimal CustoTotal { get; set; }
        public string? Observacoes { get; set; }
        public DateTime DtCadastro { get; set; }
        public List<EtapaAtendimentoDto> Etapas { get; set; } = new();
    }

    // DTO para criação
    public class AtendimentoCreateDto
    {
        public Guid PacienteId { get; set; }
        public Guid ModeloProcedimentoId { get; set; }
        public Guid DentistaId { get; set; }
        public DateTime DataInicio { get; set; }
        public decimal CustoTotal { get; set; }
        public string? Observacoes { get; set; }
    }

    // DTO para criação com etapas
    public class AtendimentoComEtapasCreateDto
    {
        public AtendimentoCreateDto Atendimento { get; set; } = null!;
        public List<EtapaAtendimentoCreateDto> Etapas { get; set; } = new();
    }

    // DTO para atualização
    public class AtendimentoUpdateDto
    {
        public DateTime DataInicio { get; set; }
        public decimal CustoTotal { get; set; }
        public string? Observacoes { get; set; }
    }

    // DTO para busca com filtros
    public class AtendimentoFiltroDto
    {
        public string? Busca { get; set; }
        public Guid? PacienteId { get; set; }
        public Guid? DentistaId { get; set; }
        public string? Status { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Pagina { get; set; } = 1;
        public int TamanhoPagina { get; set; } = 10;
    }

    // DTO de resposta para Etapa do Atendimento
    public class EtapaAtendimentoDto
    {
        public Guid Id { get; set; }
        public Guid AtendimentoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public DateTime? DataAgendada { get; set; }
        public DateTime? DataConclusao { get; set; }
        public string? Observacoes { get; set; }
        public List<string>? Anexos { get; set; }
        public List<string>? ItensChecklist { get; set; }
        public List<string>? ChecklistConcluido { get; set; }
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação de Etapa do Atendimento
    public class EtapaAtendimentoCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public DateTime? DataAgendada { get; set; }
        public List<string>? ItensChecklist { get; set; }
    }

    // DTO para atualização de Etapa do Atendimento
    public class EtapaAtendimentoUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public DateTime? DataAgendada { get; set; }
        public string? Observacoes { get; set; }
    }

    // DTO para atualização de status
    public class AtualizarStatusEtapaDto
    {
        public string Status { get; set; } = string.Empty;
        public DateTime? DataConclusao { get; set; }
    }

    // DTO para atualização de checklist
    public class AtualizarChecklistDto
    {
        public List<string> ItensConcluidos { get; set; } = new();
    }
}
