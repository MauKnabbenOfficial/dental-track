namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Etapa de um modelo de procedimento (template)
    /// </summary>
    public class EtapaModeloProcedimento
    {
        public Guid Id { get; private set; }
        public Guid ModeloProcedimentoId { get; private set; }
        public string Nome { get; private set; }
        public int OrdemExibicao { get; private set; }
        public string Descricao { get; private set; }
        public string ItensChecklistJson { get; private set; } // JSON array de strings
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public ModeloProcedimento ModeloProcedimento { get; private set; } = null!;

        // Construtor para criação
        public EtapaModeloProcedimento(
            Guid modeloProcedimentoId,
            string nome,
            int ordemExibicao,
            string descricao,
            string itensChecklistJson)
        {
            Id = Guid.NewGuid();
            ModeloProcedimentoId = modeloProcedimentoId;
            Nome = nome;
            OrdemExibicao = ordemExibicao;
            Descricao = descricao;
            ItensChecklistJson = itensChecklistJson;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private EtapaModeloProcedimento() { }

        // Métodos de negócio
        public void Atualizar(
            string nome,
            int ordemExibicao,
            string descricao,
            string itensChecklistJson)
        {
            Nome = nome;
            OrdemExibicao = ordemExibicao;
            Descricao = descricao;
            ItensChecklistJson = itensChecklistJson;
        }

        public void AtualizarOrdem(int novaOrdem)
        {
            OrdemExibicao = novaOrdem;
        }
    }
}
