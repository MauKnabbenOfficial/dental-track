namespace DentalTrack.Application.DTOs
{
    // DTO para login
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    // DTO de resposta do login
    public class LoginResponseDto
    {
        public bool Sucesso { get; set; }
        public string? Mensagem { get; set; }
        public UsuarioDto? Usuario { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiraEm { get; set; }
    }

    // DTO para refresh token
    public class RefreshTokenDto
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    // DTO para alteração de senha
    public class AlterarSenhaDto
    {
        public string SenhaAtual { get; set; } = string.Empty;
        public string NovaSenha { get; set; } = string.Empty;
        public string ConfirmarNovaSenha { get; set; } = string.Empty;
    }
}
