namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Lançamento financeiro (receita ou despesa)
    /// </summary>
    public class LancamentoFinanceiro
    {
        public Guid Id { get; private set; }
        public Guid? AtendimentoId { get; private set; } // AtendimentoId agora é opcional
        public Guid? PacienteId { get; private set; }
        public Guid CriadoPorId { get; private set; }
        public TipoLancamento Tipo { get; private set; }
        public decimal Valor { get; private set; }
        public DateTime DataLancamento { get; private set; }
        public DateTime? DataPagamento { get; private set; }
        public string Descricao { get; private set; }
        public string Categoria { get; private set; }
        public TipoResponsavel TipoResponsavel { get; private set; }
        public StatusLancamento Status { get; private set; }
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public Atendimento? Atendimento { get; private set; } // Atendimento pode ser nulo
        public Paciente? Paciente { get; private set; }
        public Usuario CriadoPor { get; private set; } = null!;

        // Construtor para criação
        public LancamentoFinanceiro(
            Guid? atendimentoId, // AtendimentoId é opcional
            Guid criadoPorId,
            TipoLancamento tipo,
            decimal valor,
            DateTime dataLancamento,
            string descricao,
            string categoria,
            TipoResponsavel tipoResponsavel,
            Guid? pacienteId = null)
        {
            Id = Guid.NewGuid();
            AtendimentoId = atendimentoId;
            CriadoPorId = criadoPorId;
            Tipo = tipo;
            Valor = valor;
            DataLancamento = dataLancamento;
            Descricao = descricao;
            Categoria = categoria;
            TipoResponsavel = tipoResponsavel;
            PacienteId = pacienteId;
            Status = StatusLancamento.Pendente;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private LancamentoFinanceiro() { }

        // Métodos de negócio
        public void Atualizar(
            decimal valor,
            DateTime dataLancamento,
            string descricao,
            string categoria,
            TipoResponsavel tipoResponsavel)
        {
            Valor = valor;
            DataLancamento = dataLancamento;
            Descricao = descricao;
            Categoria = categoria;
            TipoResponsavel = tipoResponsavel;
        }

        public void MarcarComoPago(DateTime? dataPagamento = null)
        {
            Status = StatusLancamento.Pago;
            DataPagamento = dataPagamento ?? DateTime.UtcNow;
        }

        public void Cancelar()
        {
            Status = StatusLancamento.Cancelado;
        }

        public void VoltarParaPendente()
        {
            Status = StatusLancamento.Pendente;
            DataPagamento = null;
        }
    }

    public enum TipoLancamento
    {
        Receita = 1,
        Despesa = 2
    }

    public enum TipoResponsavel
    {
        Paciente = 1,
        Clinica = 2
    }

    public enum StatusLancamento
    {
        Pendente = 1,
        Pago = 2,
        Cancelado = 3
    }
}
