using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<List<UsuarioDto>> ObterTodosAsync();
        Task<UsuarioDto?> ObterPorIdAsync(Guid id);
        Task<List<UsuarioDto>> ObterPorPerfilAsync(Guid perfilId);
        Task<List<UsuarioDto>> ObterDentistasAsync();
        Task<UsuarioDto> CriarAsync(UsuarioCreateDto dto);
        Task<UsuarioDto> AtualizarAsync(Guid id, UsuarioUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> AtivarAsync(Guid id);
        Task<bool> DesativarAsync(Guid id);
    }
}
