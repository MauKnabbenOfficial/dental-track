namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Atendimento/Tratamento do paciente
    /// </summary>
    public class Atendimento
    {
        public Guid Id { get; private set; }
        public Guid PacienteId { get; private set; }
        public Guid ModeloProcedimentoId { get; private set; }
        public Guid DentistaId { get; private set; }
        public DateTime DataInicio { get; private set; }
        public StatusAtendimento Status { get; private set; }
        public Guid? EtapaAtualId { get; private set; }
        public decimal CustoTotal { get; private set; }
        public string? Observacoes { get; private set; }
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public Paciente Paciente { get; private set; } = null!;
        public ModeloProcedimento ModeloProcedimento { get; private set; } = null!;
        public Usuario Dentista { get; private set; } = null!;
        public ICollection<EtapaAtendimento> Etapas { get; private set; } = new List<EtapaAtendimento>();
        public ICollection<LancamentoFinanceiro> LancamentosFinanceiros { get; private set; } = new List<LancamentoFinanceiro>();

        // Construtor para criação
        public Atendimento(
            Guid pacienteId,
            Guid modeloProcedimentoId,
            Guid dentistaId,
            DateTime dataInicio,
            decimal custoTotal,
            string? observacoes = null)
        {
            Id = Guid.NewGuid();
            PacienteId = pacienteId;
            ModeloProcedimentoId = modeloProcedimentoId;
            DentistaId = dentistaId;
            DataInicio = dataInicio;
            Status = StatusAtendimento.Agendado;
            CustoTotal = custoTotal;
            Observacoes = observacoes;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private Atendimento() { }

        // Métodos de negócio
        public void Atualizar(
            DateTime dataInicio,
            decimal custoTotal,
            string? observacoes)
        {
            DataInicio = dataInicio;
            CustoTotal = custoTotal;
            Observacoes = observacoes;
        }

        public void AlterarStatus(StatusAtendimento novoStatus)
        {
            Status = novoStatus;
        }

        public void DefinirEtapaAtual(Guid? etapaId)
        {
            EtapaAtualId = etapaId;
        }

        public void Iniciar()
        {
            Status = StatusAtendimento.EmAndamento;
        }

        public void Concluir()
        {
            Status = StatusAtendimento.Concluido;
        }

        public void Cancelar()
        {
            Status = StatusAtendimento.Cancelado;
        }
    }

    public enum StatusAtendimento
    {
        Agendado = 1,
        EmAndamento = 2,
        Concluido = 3,
        Cancelado = 4
    }
}
