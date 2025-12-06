using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface ILancamentoFinanceiroService
    {
        Task<List<LancamentoFinanceiroDto>> ObterTodosAsync();
        Task<LancamentoFinanceiroDto?> ObterPorIdAsync(Guid id);
        Task<ResultadoPaginado<LancamentoFinanceiroDto>> BuscarAsync(LancamentoFiltroDto filtro);
        Task<List<LancamentoFinanceiroDto>> ObterPorAtendimentoAsync(Guid atendimentoId);
        Task<List<LancamentoFinanceiroDto>> ObterPorPacienteAsync(Guid pacienteId);
        Task<List<LancamentoFinanceiroDto>> ObterPorTipoAsync(string tipo);
        Task<List<LancamentoFinanceiroDto>> ObterPorStatusAsync(string status);
        Task<LancamentoFinanceiroDto> CriarAsync(LancamentoFinanceiroCreateDto dto, Guid usuarioId);
        Task<LancamentoFinanceiroDto> AtualizarAsync(Guid id, LancamentoFinanceiroUpdateDto dto);
        Task<LancamentoFinanceiroDto> AtualizarStatusPagamentoAsync(Guid id, AtualizarStatusPagamentoDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<ResumoFinanceiroDto> ObterResumoPorPeriodoAsync(DateTime dataInicio, DateTime dataFim);
    }
}
