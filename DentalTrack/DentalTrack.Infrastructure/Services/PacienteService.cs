using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;

namespace DentalTrack.Infrastructure.Services
{
    public class PacienteService : IPacienteService
    {
        private readonly IPacienteRepository _pacienteRepository;

        public PacienteService(IPacienteRepository pacienteRepository)
        {
            _pacienteRepository = pacienteRepository;
        }

        public async Task<List<PacienteDto>> ObterTodosAsync()
        {
            var pacientes = await _pacienteRepository.ObterTodosAsync();
            return pacientes.Select(MapToDto).ToList();
        }

        public async Task<PacienteDto?> ObterPorIdAsync(Guid id)
        {
            var paciente = await _pacienteRepository.ObterPorIdAsync(id);
            return paciente != null ? MapToDto(paciente) : null;
        }

        public async Task<PacienteDto?> ObterPorCpfAsync(string cpf)
        {
            var paciente = await _pacienteRepository.ObterPorCpfAsync(cpf);
            return paciente != null ? MapToDto(paciente) : null;
        }

        public async Task<ResultadoPaginado<PacienteDto>> BuscarAsync(PacienteFiltroDto filtro)
        {
            var (dados, total) = await _pacienteRepository.BuscarPaginadoAsync(
                filtro.Busca,
                filtro.Cpf,
                filtro.ConvenioNome,
                filtro.Pagina,
                filtro.TamanhoPagina);

            return new ResultadoPaginado<PacienteDto>(
                dados.Select(MapToDto).ToList(),
                total,
                filtro.Pagina,
                filtro.TamanhoPagina);
        }

        public async Task<List<PacienteDto>> ObterPorConvenioAsync(string convenioNome)
        {
            var pacientes = await _pacienteRepository.ObterPorConvenioAsync(convenioNome);
            return pacientes.Select(MapToDto).ToList();
        }

        public async Task<PacienteDto> CriarAsync(PacienteCreateDto dto)
        {
            var cpfExiste = await _pacienteRepository.ObterPorCpfAsync(dto.Cpf);
            if (cpfExiste != null)
                throw new ArgumentException("CPF já cadastrado");

            var paciente = new Paciente(
                dto.Nome,
                dto.Cpf,
                dto.Telefone,
                dto.Email,
                dto.DataNascimento);

            paciente.AtualizarConvenio(dto.ConvenioId, dto.ConvenioNome);
            paciente.AtualizarEndereco(
                dto.Cep, dto.Logradouro, dto.Numero, dto.Complemento,
                dto.Bairro, dto.Cidade, dto.Estado);

            await _pacienteRepository.AdicionarAsync(paciente);
            return MapToDto(paciente);
        }

        public async Task<PacienteDto> AtualizarAsync(Guid id, PacienteUpdateDto dto)
        {
            var paciente = await _pacienteRepository.ObterPorIdAsync(id);
            if (paciente == null)
                throw new ArgumentException("Paciente não encontrado");

            paciente.Atualizar(dto.Nome, dto.Telefone, dto.Email, dto.DataNascimento);
            paciente.AtualizarConvenio(dto.ConvenioId, dto.ConvenioNome);
            paciente.AtualizarEndereco(
                dto.Cep, dto.Logradouro, dto.Numero, dto.Complemento,
                dto.Bairro, dto.Cidade, dto.Estado);

            await _pacienteRepository.AtualizarAsync(paciente);
            return MapToDto(paciente);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _pacienteRepository.RemoverAsync(id);
        }

        public async Task<bool> AtivarAsync(Guid id)
        {
            var paciente = await _pacienteRepository.ObterPorIdAsync(id);
            if (paciente == null) return false;

            paciente.Ativar();
            await _pacienteRepository.AtualizarAsync(paciente);
            return true;
        }

        public async Task<bool> DesativarAsync(Guid id)
        {
            var paciente = await _pacienteRepository.ObterPorIdAsync(id);
            if (paciente == null) return false;

            paciente.Desativar();
            await _pacienteRepository.AtualizarAsync(paciente);
            return true;
        }

        private static PacienteDto MapToDto(Paciente paciente)
        {
            return new PacienteDto
            {
                Id = paciente.Id,
                Nome = paciente.Nome,
                Cpf = paciente.Cpf,
                Telefone = paciente.Telefone,
                Email = paciente.Email,
                DataNascimento = paciente.DataNascimento,
                ConvenioId = paciente.ConvenioId,
                ConvenioNome = paciente.ConvenioNome,
                Cep = paciente.Cep,
                Logradouro = paciente.Logradouro,
                Numero = paciente.Numero,
                Complemento = paciente.Complemento,
                Bairro = paciente.Bairro,
                Cidade = paciente.Cidade,
                Estado = paciente.Estado,
                Ativo = paciente.Ativo,
                DtCadastro = paciente.DtCadastro
            };
        }
    }
}
