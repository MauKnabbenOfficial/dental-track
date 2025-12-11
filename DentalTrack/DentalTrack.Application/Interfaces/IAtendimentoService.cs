using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IAtendimentoService
    {
        Task<List<AtendimentoDto>> ObterTodosAsync();
        Task<AtendimentoDto?> ObterPorIdAsync(Guid id);
        Task<ResultadoPaginado<AtendimentoDto>> BuscarAsync(AtendimentoFiltroDto filtro);
        Task<List<AtendimentoDto>> ObterPorPacienteAsync(Guid pacienteId);
        Task<List<AtendimentoDto>> ObterPorDentistaAsync(Guid dentistaId);
        Task<List<AtendimentoDto>> ObterPorStatusAsync(string status);
        Task<AtendimentoDto> CriarAsync(AtendimentoCreateDto dto);
        Task<(AtendimentoDto Atendimento, List<EtapaAtendimentoDto> Etapas)> CriarComEtapasAsync(AtendimentoComEtapasCreateDto dto);
        Task<AtendimentoDto> AtualizarAsync(Guid id, AtendimentoUpdateDto dto);
        Task<bool> AlterarStatusAsync(Guid id, string status);
        Task<bool> ExcluirAsync(Guid id);
    }

    public interface IEtapaAtendimentoService
    {
        Task<List<EtapaAtendimentoDto>> ObterTodosAsync();
        Task<EtapaAtendimentoDto?> ObterPorIdAsync(Guid id);
        Task<List<EtapaAtendimentoDto>> ObterPorAtendimentoIdAsync(Guid atendimentoId);
        Task<EtapaAtendimentoDto> CriarAsync(Guid atendimentoId, EtapaAtendimentoCreateDto dto);
        Task<EtapaAtendimentoDto> AtualizarAsync(Guid id, EtapaAtendimentoUpdateDto dto);
        Task<EtapaAtendimentoDto> AtualizarStatusAsync(Guid id, AtualizarStatusEtapaDto dto);
        Task<EtapaAtendimentoDto> AtualizarChecklistAsync(Guid id, AtualizarChecklistDto dto);
        Task<EtapaAtendimentoDto> AdicionarAnexoAsync(Guid id, string anexo);
        Task<EtapaAtendimentoDto> RemoverAnexoAsync(Guid id, string anexo);
        Task<bool> ExcluirAsync(Guid id);
    }
}
