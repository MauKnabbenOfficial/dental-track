using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IModeloProcedimentoService
    {
        Task<List<ModeloProcedimentoDto>> ObterTodosAsync();
        Task<ModeloProcedimentoDto?> ObterPorIdAsync(Guid id);
        Task<List<ModeloProcedimentoDto>> ObterPorCategoriaAsync(string categoria);
        Task<List<string>> ObterCategoriasAsync();
        Task<ModeloProcedimentoDto> CriarAsync(ModeloProcedimentoCreateDto dto);
        Task<ModeloProcedimentoDto> AtualizarAsync(Guid id, ModeloProcedimentoUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> AtivarAsync(Guid id);
        Task<bool> DesativarAsync(Guid id);
    }

    public interface IEtapaModeloProcedimentoService
    {
        Task<List<EtapaModeloProcedimentoDto>> ObterTodosAsync();
        Task<EtapaModeloProcedimentoDto?> ObterPorIdAsync(Guid id);
        Task<List<EtapaModeloProcedimentoDto>> ObterPorModeloIdAsync(Guid modeloId);
        Task<EtapaModeloProcedimentoDto> CriarAsync(EtapaModeloProcedimentoCreateDto dto);
        Task<EtapaModeloProcedimentoDto> AtualizarAsync(Guid id, EtapaModeloProcedimentoUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> TrocarOrdemAsync(Guid etapaId1, Guid etapaId2);
        Task<bool> ReordenarAsync(Guid modeloId, List<Guid> idsEtapas);
    }
}
