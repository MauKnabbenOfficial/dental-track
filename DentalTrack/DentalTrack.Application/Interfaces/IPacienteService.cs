using DentalTrack.Application.DTOs;

namespace DentalTrack.Application.Interfaces
{
    public interface IPacienteService
    {
        Task<List<PacienteDto>> ObterTodosAsync();
        Task<PacienteDto?> ObterPorIdAsync(Guid id);
        Task<PacienteDto?> ObterPorCpfAsync(string cpf);
        Task<ResultadoPaginado<PacienteDto>> BuscarAsync(PacienteFiltroDto filtro);
        Task<List<PacienteDto>> ObterPorConvenioAsync(string convenioNome);
        Task<PacienteDto> CriarAsync(PacienteCreateDto dto);
        Task<PacienteDto> AtualizarAsync(Guid id, PacienteUpdateDto dto);
        Task<bool> ExcluirAsync(Guid id);
        Task<bool> AtivarAsync(Guid id);
        Task<bool> DesativarAsync(Guid id);
    }
}
