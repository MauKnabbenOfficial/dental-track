using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;
using System.Text.Json;

namespace DentalTrack.Infrastructure.Services
{
    public class ModeloEtapaService : IModeloEtapaService
    {
        private readonly IModeloEtapaRepository _modeloEtapaRepository;

        public ModeloEtapaService(IModeloEtapaRepository modeloEtapaRepository)
        {
            _modeloEtapaRepository = modeloEtapaRepository;
        }

        public async Task<List<ModeloEtapaDto>> ObterTodosAsync()
        {
            var modelos = await _modeloEtapaRepository.ObterTodosAsync();
            return modelos.Select(MapToDto).ToList();
        }

        public async Task<ModeloEtapaDto?> ObterPorIdAsync(Guid id)
        {
            var modelo = await _modeloEtapaRepository.ObterPorIdAsync(id);
            return modelo != null ? MapToDto(modelo) : null;
        }

        public async Task<List<ModeloEtapaDto>> BuscarPorNomeAsync(string nome)
        {
            var modelos = await _modeloEtapaRepository.BuscarPorNomeAsync(nome);
            return modelos.Select(MapToDto).ToList();
        }

        public async Task<ModeloEtapaDto> CriarAsync(ModeloEtapaCreateDto dto)
        {
            var itensJson = JsonSerializer.Serialize(dto.ItensChecklist);
            var modelo = new ModeloEtapa(
                dto.Nome,
                dto.Descricao,
                dto.DuracaoPadraoMinutos,
                itensJson);

            await _modeloEtapaRepository.AdicionarAsync(modelo);
            return MapToDto(modelo);
        }

        public async Task<ModeloEtapaDto> AtualizarAsync(Guid id, ModeloEtapaUpdateDto dto)
        {
            var modelo = await _modeloEtapaRepository.ObterPorIdAsync(id);
            if (modelo == null)
                throw new ArgumentException("Modelo de etapa não encontrado");

            var itensJson = JsonSerializer.Serialize(dto.ItensChecklist);
            modelo.Atualizar(dto.Nome, dto.Descricao, dto.DuracaoPadraoMinutos, itensJson);
            await _modeloEtapaRepository.AtualizarAsync(modelo);

            return MapToDto(modelo);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _modeloEtapaRepository.RemoverAsync(id);
        }

        public async Task<bool> AtivarAsync(Guid id)
        {
            var modelo = await _modeloEtapaRepository.ObterPorIdAsync(id);
            if (modelo == null) return false;

            modelo.Ativar();
            await _modeloEtapaRepository.AtualizarAsync(modelo);
            return true;
        }

        public async Task<bool> DesativarAsync(Guid id)
        {
            var modelo = await _modeloEtapaRepository.ObterPorIdAsync(id);
            if (modelo == null) return false;

            modelo.Desativar();
            await _modeloEtapaRepository.AtualizarAsync(modelo);
            return true;
        }

        private static ModeloEtapaDto MapToDto(ModeloEtapa modelo)
        {
            return new ModeloEtapaDto
            {
                Id = modelo.Id,
                Nome = modelo.Nome,
                Descricao = modelo.Descricao,
                DuracaoPadraoMinutos = modelo.DuracaoPadraoMinutos,
                ItensChecklist = DeserializeJson(modelo.ItensChecklistJson),
                Ativo = modelo.Ativo,
                DtCadastro = modelo.DtCadastro
            };
        }

        private static List<string> DeserializeJson(string? json)
        {
            if (string.IsNullOrEmpty(json)) return new List<string>();
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>(); }
            catch { return new List<string>(); }
        }
    }
}
