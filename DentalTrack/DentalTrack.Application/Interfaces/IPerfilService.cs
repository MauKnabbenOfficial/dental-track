using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IPerfilService
    {
        Task<List<PerfilDto>> ObterTodosAsync();
        Task<PerfilDto?> ObterPorIdAsync(Guid id);
        Task<PerfilDto> CriarAsync(PerfilCreateDto dto);
        Task<PerfilDto> AtualizarAsync(Guid id, PerfilUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> AtivarAsync(Guid id);
        Task<bool> DesativarAsync(Guid id);
    }
}
