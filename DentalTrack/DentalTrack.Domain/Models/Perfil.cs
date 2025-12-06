namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Perfil de acesso do usuário (Admin, Dentista, Recepcionista, etc.)
    /// Permite flexibilidade para adicionar permissões granulares no futuro
    /// </summary>
    public class Perfil
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Descricao { get; private set; }
        public bool Ativo { get; private set; }
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public ICollection<Usuario> Usuarios { get; private set; } = new List<Usuario>();

        // Construtor para criação
        public Perfil(string nome, string descricao)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Descricao = descricao;
            Ativo = true;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private Perfil() { }

        // Métodos de negócio
        public void Atualizar(string nome, string descricao)
        {
            Nome = nome;
            Descricao = descricao;
        }

        public void Ativar() => Ativo = true;
        public void Desativar() => Ativo = false;
    }
}
