namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class LancamentoFinanceiroDto
    {
        public Guid Id { get; set; }
        public Guid AtendimentoId { get; set; }
        public Guid? PacienteId { get; set; }
        public string? PacienteNome { get; set; }
        public Guid CriadoPorId { get; set; }
        public string CriadoPorNome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty; // "Receita" ou "Despesa"
        public decimal Valor { get; set; }
        public DateTime DataLancamento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string TipoResponsavel { get; set; } = string.Empty; // "Paciente" ou "Clinica"
        public string Status { get; set; } = string.Empty; // "Pendente", "Pago", "Cancelado"
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação
    public class LancamentoFinanceiroCreateDto
    {
        public Guid AtendimentoId { get; set; }
        public Guid? PacienteId { get; set; }
        public string Tipo { get; set; } = string.Empty; // "income" ou "expense"
        public decimal Valor { get; set; }
        public DateTime DataLancamento { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string TipoResponsavel { get; set; } = string.Empty; // "patient" ou "clinic"
    }

    // DTO para atualização
    public class LancamentoFinanceiroUpdateDto
    {
        public decimal Valor { get; set; }
        public DateTime DataLancamento { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string TipoResponsavel { get; set; } = string.Empty;
    }

    // DTO para atualização de status de pagamento
    public class AtualizarStatusPagamentoDto
    {
        public string Status { get; set; } = string.Empty;
        public DateTime? DataPagamento { get; set; }
    }

    // DTO para busca com filtros
    public class LancamentoFiltroDto
    {
        public string? Busca { get; set; }
        public Guid? AtendimentoId { get; set; }
        public Guid? PacienteId { get; set; }
        public string? Tipo { get; set; }
        public string? Status { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Pagina { get; set; } = 1;
        public int TamanhoPagina { get; set; } = 10;
    }

    // DTO para resumo financeiro
    public class ResumoFinanceiroDto
    {
        public decimal TotalReceitas { get; set; }
        public decimal TotalDespesas { get; set; }
        public decimal Saldo { get; set; }
        public decimal ReceitasPendentes { get; set; }
        public decimal DespesasPendentes { get; set; }
    }
}
