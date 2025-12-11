namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Usuário do sistema (Dentista, Recepcionista, Admin)
    /// </summary>
    public class Usuario
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public string SenhaHash { get; private set; }
        public Guid PerfilId { get; private set; }
        public string? Especialidade { get; private set; }
        public string? Avatar { get; private set; }
        public bool EmailConfirmado { get; private set; }
        public bool Ativo { get; private set; }
        public DateTime DtCadastro { get; private set; }

        // Navegação
        public Perfil Perfil { get; private set; } = null!;
        public ICollection<Atendimento> Atendimentos { get; private set; } = new List<Atendimento>();
        public ICollection<LancamentoFinanceiro> LancamentosCriados { get; private set; } = new List<LancamentoFinanceiro>();

        // Construtor para criação
        public Usuario(string nome, string email, string senhaHash, Guid perfilId, string? especialidade = null)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Email = email;
            SenhaHash = senhaHash;
            PerfilId = perfilId;
            Especialidade = especialidade;
            EmailConfirmado = false;
            Ativo = true;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor para EF
        private Usuario() { }

        // Métodos de negócio
        public void Atualizar(string nome, string? especialidade, string? avatar)
        {
            Nome = nome;
            Especialidade = especialidade;
            Avatar = avatar;
        }

        public void AlterarPerfil(Guid perfilId)
        {
            PerfilId = perfilId;
        }

        public void AlterarSenha(string novaSenhaHash)
        {
            SenhaHash = novaSenhaHash;
        }

        public void ConfirmarEmail() => EmailConfirmado = true;
        public void Ativar() => Ativo = true;
        public void Desativar() => Ativo = false;
    }
}

