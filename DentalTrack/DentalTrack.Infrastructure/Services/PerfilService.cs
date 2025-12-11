using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;

namespace DentalTrack.Infrastructure.Services
{
    public class PerfilService : IPerfilService
    {
        private readonly IPerfilRepository _perfilRepository;

        public PerfilService(IPerfilRepository perfilRepository)
        {
            _perfilRepository = perfilRepository;
        }

        public async Task<List<PerfilDto>> ObterTodosAsync()
        {
            var perfis = await _perfilRepository.ObterTodosAsync();
            return perfis.Select(MapToDto).ToList();
        }

        public async Task<PerfilDto?> ObterPorIdAsync(Guid id)
        {
            var perfil = await _perfilRepository.ObterPorIdAsync(id);
            return perfil != null ? MapToDto(perfil) : null;
        }

        public async Task<PerfilDto> CriarAsync(PerfilCreateDto dto)
        {
            var nomeExiste = await _perfilRepository.ObterPorNomeAsync(dto.Nome);
            if (nomeExiste != null)
                throw new ArgumentException("Já existe um perfil com este nome");

            var perfil = new Perfil(dto.Nome, dto.Descricao);
            await _perfilRepository.AdicionarAsync(perfil);

            return MapToDto(perfil);
        }

        public async Task<PerfilDto> AtualizarAsync(Guid id, PerfilUpdateDto dto)
        {
            var perfil = await _perfilRepository.ObterPorIdAsync(id);
            if (perfil == null)
                throw new ArgumentException("Perfil não encontrado");

            perfil.Atualizar(dto.Nome, dto.Descricao);
            await _perfilRepository.AtualizarAsync(perfil);

            return MapToDto(perfil);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _perfilRepository.RemoverAsync(id);
        }

        public async Task<bool> AtivarAsync(Guid id)
        {
            var perfil = await _perfilRepository.ObterPorIdAsync(id);
            if (perfil == null) return false;

            perfil.Ativar();
            await _perfilRepository.AtualizarAsync(perfil);
            return true;
        }

        public async Task<bool> DesativarAsync(Guid id)
        {
            var perfil = await _perfilRepository.ObterPorIdAsync(id);
            if (perfil == null) return false;

            perfil.Desativar();
            await _perfilRepository.AtualizarAsync(perfil);
            return true;
        }

        private static PerfilDto MapToDto(Perfil perfil)
        {
            return new PerfilDto
            {
                Id = perfil.Id,
                Nome = perfil.Nome,
                Descricao = perfil.Descricao,
                Ativo = perfil.Ativo,
                DtCadastro = perfil.DtCadastro
            };
        }
    }
}
