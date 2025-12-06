namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Template reutilizável de etapa (ex: Anestesia, Consulta Inicial, Raio-X)
    /// Pode ser usado para criar etapas em diferentes modelos de procedimento
    /// </summary>
    public class ModeloEtapa
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Descricao { get; private set; }
        public int DuracaoPadraoMinutos { get; private set; }
        public string ItensChecklistJson { get; private set; } // JSON array de strings
        public DateTime DtCadastro { get; private set; }
        public bool Ativo { get; private set; }

        // Construtor para criação
        public ModeloEtapa(
            string nome,
            string descricao,
            int duracaoPadraoMinutos,
            string itensChecklistJson)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Descricao = descricao;
            DuracaoPadraoMinutos = duracaoPadraoMinutos;
            ItensChecklistJson = itensChecklistJson;
            DtCadastro = DateTime.UtcNow;
            Ativo = true;
        }

        // Construtor para EF
        private ModeloEtapa() { }

        // Métodos de negócio
        public void Atualizar(
            string nome,
            string descricao,
            int duracaoPadraoMinutos,
            string itensChecklistJson)
        {
            Nome = nome;
            Descricao = descricao;
            DuracaoPadraoMinutos = duracaoPadraoMinutos;
            ItensChecklistJson = itensChecklistJson;
        }

        public void Ativar() => Ativo = true;
        public void Desativar() => Ativo = false;
    }
}
