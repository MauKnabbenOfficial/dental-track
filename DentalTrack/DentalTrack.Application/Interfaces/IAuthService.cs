using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto dto);
        Task LogoutAsync(Guid usuarioId);
        Task<UsuarioDto?> ObterUsuarioAtualAsync(Guid usuarioId);
        Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenDto dto);
        Task<bool> AlterarSenhaAsync(Guid usuarioId, AlterarSenhaDto dto);
    }
}
