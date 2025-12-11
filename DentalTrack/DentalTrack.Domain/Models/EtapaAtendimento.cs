namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Etapa específica de um atendimento
    /// </summary>
    public class EtapaAtendimento
    {
        public Guid Id { get; private set; }
        public Guid AtendimentoId { get; private set; }
        public string Nome { get; private set; }
        public StatusEtapa Status { get; private set; }
        public int OrdemExibicao { get; private set; }
        public DateTime? DataAgendada { get; private set; }
        public DateTime? DataConclusao { get; private set; }
        public string? Observacoes { get; private set; }
        public string? AnexosJson { get; private set; } // JSON array de URLs
        public string? ItensChecklistJson { get; private set; } // JSON array de strings
        public string? ChecklistConcluidoJson { get; private set; } // JSON array de strings concluídas
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public Atendimento Atendimento { get; private set; } = null!;

        // Construtor para criação
        public EtapaAtendimento(
            Guid atendimentoId,
            string nome,
            int ordemExibicao,
            DateTime? dataAgendada = null,
            string? itensChecklistJson = null)
        {
            Id = Guid.NewGuid();
            AtendimentoId = atendimentoId;
            Nome = nome;
            Status = StatusEtapa.Pendente;
            OrdemExibicao = ordemExibicao;
            DataAgendada = dataAgendada;
            ItensChecklistJson = itensChecklistJson;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private EtapaAtendimento() { }

        // Métodos de negócio
        public void Atualizar(
            string nome,
            int ordemExibicao,
            DateTime? dataAgendada,
            string? observacoes)
        {
            Nome = nome;
            OrdemExibicao = ordemExibicao;
            DataAgendada = dataAgendada;
            Observacoes = observacoes;
        }

        public void AlterarStatus(StatusEtapa novoStatus)
        {
            Status = novoStatus;
            if (novoStatus == StatusEtapa.Concluido && !DataConclusao.HasValue)
            {
                DataConclusao = DateTime.UtcNow;
            }
        }

        public void Iniciar()
        {
            Status = StatusEtapa.EmAndamento;
        }

        public void Concluir(DateTime? dataConclusao = null)
        {
            Status = StatusEtapa.Concluido;
            DataConclusao = dataConclusao ?? DateTime.UtcNow;
        }

        public void Pular()
        {
            Status = StatusEtapa.Pulado;
        }

        public void AtualizarAnexos(string anexosJson)
        {
            AnexosJson = anexosJson;
        }

        public void AtualizarChecklist(string checklistConcluidoJson)
        {
            ChecklistConcluidoJson = checklistConcluidoJson;
        }
    }

    public enum StatusEtapa
    {
        Pendente = 1,
        EmAndamento = 2,
        Concluido = 3,
        Pulado = 4
    }
}
