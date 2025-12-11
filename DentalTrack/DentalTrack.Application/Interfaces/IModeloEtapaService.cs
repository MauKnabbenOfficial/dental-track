using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IModeloEtapaService
    {
        Task<List<ModeloEtapaDto>> ObterTodosAsync();
        Task<ModeloEtapaDto?> ObterPorIdAsync(Guid id);
        Task<List<ModeloEtapaDto>> BuscarPorNomeAsync(string nome);
        Task<ModeloEtapaDto> CriarAsync(ModeloEtapaCreateDto dto);
        Task<ModeloEtapaDto> AtualizarAsync(Guid id, ModeloEtapaUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> AtivarAsync(Guid id);
        Task<bool> DesativarAsync(Guid id);
    }
}
