namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Template de procedimento odontológico (ex: Implante, Canal, Ortodontia)
    /// </summary>
    public class ModeloProcedimento
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public decimal CustoBase { get; private set; }
        public string DuracaoEstimada { get; private set; }
        public string Descricao { get; private set; }
        public string Categoria { get; private set; }
        public DateTime DtCadastro { get; private set; }
        public bool Ativo { get; private set; }

        // Navegação
        public ICollection<EtapaModeloProcedimento> Etapas { get; private set; } = new List<EtapaModeloProcedimento>();
        public ICollection<Atendimento> Atendimentos { get; private set; } = new List<Atendimento>();

        // Construtor para criação
        public ModeloProcedimento(
            string nome,
            decimal custoBase,
            string duracaoEstimada,
            string descricao,
            string categoria)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            CustoBase = custoBase;
            DuracaoEstimada = duracaoEstimada;
            Descricao = descricao;
            Categoria = categoria;
            DtCadastro = DateTime.UtcNow;
            Ativo = true;
        }

        // Construtor para EF
        private ModeloProcedimento() { }

        // Métodos de negócio
        public void Atualizar(
            string nome,
            decimal custoBase,
            string duracaoEstimada,
            string descricao,
            string categoria)
        {
            Nome = nome;
            CustoBase = custoBase;
            DuracaoEstimada = duracaoEstimada;
            Descricao = descricao;
            Categoria = categoria;
        }

        public void Ativar() => Ativo = true;
        public void Desativar() => Ativo = false;
    }
}
