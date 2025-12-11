namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class UsuarioDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid PerfilId { get; set; }
        public string PerfilNome { get; set; } = string.Empty;
        public string? Especialidade { get; set; }
        public string? Avatar { get; set; }
        public bool Ativo { get; set; }
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação
    public class UsuarioCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string ConfirmarSenha { get; set; } = string.Empty;
        public Guid PerfilId { get; set; }
        public string? Especialidade { get; set; }
    }

    // DTO para atualização
    public class UsuarioUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public Guid PerfilId { get; set; }
        public string? Especialidade { get; set; }
        public string? Avatar { get; set; }
    }
}
