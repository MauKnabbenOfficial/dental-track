using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;
using System.Text.Json;

namespace DentalTrack.Infrastructure.Services
{
    public class ModeloProcedimentoService : IModeloProcedimentoService
    {
        private readonly IModeloProcedimentoRepository _modeloRepository;

        public ModeloProcedimentoService(IModeloProcedimentoRepository modeloRepository)
        {
            _modeloRepository = modeloRepository;
        }

        public async Task<List<ModeloProcedimentoDto>> ObterTodosAsync()
        {
            var modelos = await _modeloRepository.ObterTodosAsync();
            return modelos.Select(MapToDto).ToList();
        }

        public async Task<ModeloProcedimentoDto?> ObterPorIdAsync(Guid id)
        {
            var modelo = await _modeloRepository.ObterComEtapasAsync(id);
            return modelo != null ? MapToDto(modelo) : null;
        }

        public async Task<List<ModeloProcedimentoDto>> ObterPorCategoriaAsync(string categoria)
        {
            var modelos = await _modeloRepository.ObterPorCategoriaAsync(categoria);
            return modelos.Select(MapToDto).ToList();
        }

        public async Task<List<string>> ObterCategoriasAsync()
        {
            return await _modeloRepository.ObterCategoriasAsync();
        }

        public async Task<ModeloProcedimentoDto> CriarAsync(ModeloProcedimentoCreateDto dto)
        {
            var modelo = new ModeloProcedimento(
                dto.Nome,
                dto.CustoBase,
                dto.DuracaoEstimada,
                dto.Descricao,
                dto.Categoria);

            await _modeloRepository.AdicionarAsync(modelo);
            return MapToDto(modelo);
        }

        public async Task<ModeloProcedimentoDto> AtualizarAsync(Guid id, ModeloProcedimentoUpdateDto dto)
        {
            var modelo = await _modeloRepository.ObterPorIdAsync(id);
            if (modelo == null)
                throw new ArgumentException("Modelo de procedimento não encontrado");

            modelo.Atualizar(dto.Nome, dto.CustoBase, dto.DuracaoEstimada, dto.Descricao, dto.Categoria);
            await _modeloRepository.AtualizarAsync(modelo);

            var modeloAtualizado = await _modeloRepository.ObterComEtapasAsync(id);
            return MapToDto(modeloAtualizado!);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _modeloRepository.RemoverAsync(id);
        }

        public async Task<bool> AtivarAsync(Guid id)
        {
            var modelo = await _modeloRepository.ObterPorIdAsync(id);
            if (modelo == null) return false;

            modelo.Ativar();
            await _modeloRepository.AtualizarAsync(modelo);
            return true;
        }

        public async Task<bool> DesativarAsync(Guid id)
        {
            var modelo = await _modeloRepository.ObterPorIdAsync(id);
            if (modelo == null) return false;

            modelo.Desativar();
            await _modeloRepository.AtualizarAsync(modelo);
            return true;
        }

        private static ModeloProcedimentoDto MapToDto(ModeloProcedimento modelo)
        {
            return new ModeloProcedimentoDto
            {
                Id = modelo.Id,
                Nome = modelo.Nome,
                CustoBase = modelo.CustoBase,
                DuracaoEstimada = modelo.DuracaoEstimada,
                Descricao = modelo.Descricao,
                Categoria = modelo.Categoria,
                Ativo = modelo.Ativo,
                DtCadastro = modelo.DtCadastro,
                Etapas = modelo.Etapas?.Select(e => new EtapaModeloProcedimentoDto
                {
                    Id = e.Id,
                    ModeloProcedimentoId = e.ModeloProcedimentoId,
                    Nome = e.Nome,
                    OrdemExibicao = e.OrdemExibicao,
                    Descricao = e.Descricao,
                    ItensChecklist = DeserializeJson(e.ItensChecklistJson),
                    DtCadastro = e.DtCadastro
                }).ToList() ?? new List<EtapaModeloProcedimentoDto>()
            };
        }

        private static List<string> DeserializeJson(string? json)
        {
            if (string.IsNullOrEmpty(json)) return new List<string>();
            try { return JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>(); }
            catch { return new List<string>(); }
        }
    }

    public class EtapaModeloProcedimentoService : IEtapaModeloProcedimentoService
    {
        private readonly IEtapaModeloProcedimentoRepository _etapaRepository;

        public EtapaModeloProcedimentoService(IEtapaModeloProcedimentoRepository etapaRepository)
        {
            _etapaRepository = etapaRepository;
        }

        public async Task<List<EtapaModeloProcedimentoDto>> ObterTodosAsync()
        {
            var etapas = await _etapaRepository.ObterTodosAsync();
            return etapas.Select(MapToDto).ToList();
        }

        public async Task<EtapaModeloProcedimentoDto?> ObterPorIdAsync(Guid id)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            return etapa != null ? MapToDto(etapa) : null;
        }

        public async Task<List<EtapaModeloProcedimentoDto>> ObterPorModeloIdAsync(Guid modeloId)
        {
            var etapas = await _etapaRepository.ObterPorModeloIdAsync(modeloId);
            return etapas.Select(MapToDto).ToList();
        }

        public async Task<EtapaModeloProcedimentoDto> CriarAsync(EtapaModeloProcedimentoCreateDto dto)
        {
            var itensJson = JsonSerializer.Serialize(dto.ItensChecklist);
            var etapa = new EtapaModeloProcedimento(
                dto.ModeloProcedimentoId,
                dto.Nome,
                dto.OrdemExibicao,
                dto.Descricao,
                itensJson);

            await _etapaRepository.AdicionarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaModeloProcedimentoDto> AtualizarAsync(Guid id, EtapaModeloProcedimentoUpdateDto dto)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null)
                throw new ArgumentException("Etapa não encontrada");

            var itensJson = JsonSerializer.Serialize(dto.ItensChecklist);
            etapa.Atualizar(dto.Nome, dto.OrdemExibicao, dto.Descricao, itensJson);
            await _etapaRepository.AtualizarAsync(etapa);

            return MapToDto(etapa);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _etapaRepository.RemoverAsync(id);
        }

        public async Task<bool> TrocarOrdemAsync(Guid etapaId1, Guid etapaId2)
        {
            var etapa1 = await _etapaRepository.ObterPorIdAsync(etapaId1);
            var etapa2 = await _etapaRepository.ObterPorIdAsync(etapaId2);
            if (etapa1 == null || etapa2 == null) return false;

            var ordem1 = etapa1.OrdemExibicao;
            var ordem2 = etapa2.OrdemExibicao;

            etapa1.AtualizarOrdem(ordem2);
            etapa2.AtualizarOrdem(ordem1);

            await _etapaRepository.AtualizarAsync(etapa1);
            await _etapaRepository.AtualizarAsync(etapa2);
            return true;
        }

        public async Task<bool> ReordenarAsync(Guid modeloId, List<Guid> idsEtapas)
        {
            var etapas = await _etapaRepository.ObterPorModeloIdAsync(modeloId);

            for (int i = 0; i < idsEtapas.Count; i++)
            {
                var etapa = etapas.FirstOrDefault(e => e.Id == idsEtapas[i]);
                if (etapa != null)
                {
                    etapa.AtualizarOrdem(i + 1);
                    await _etapaRepository.AtualizarAsync(etapa);
                }
            }
            return true;
        }

        private static EtapaModeloProcedimentoDto MapToDto(EtapaModeloProcedimento etapa)
        {
            return new EtapaModeloProcedimentoDto
            {
                Id = etapa.Id,
                ModeloProcedimentoId = etapa.ModeloProcedimentoId,
                Nome = etapa.Nome,
                OrdemExibicao = etapa.OrdemExibicao,
                Descricao = etapa.Descricao,
                ItensChecklist = DeserializeJson(etapa.ItensChecklistJson),
                DtCadastro = etapa.DtCadastro
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
