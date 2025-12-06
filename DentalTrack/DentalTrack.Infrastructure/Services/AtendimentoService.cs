using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;
using System.Text.Json;

namespace DentalTrack.Infrastructure.Services
{
    public class AtendimentoService : IAtendimentoService
    {
        private readonly IAtendimentoRepository _atendimentoRepository;
        private readonly IEtapaAtendimentoRepository _etapaRepository;

        public AtendimentoService(
            IAtendimentoRepository atendimentoRepository,
            IEtapaAtendimentoRepository etapaRepository)
        {
            _atendimentoRepository = atendimentoRepository;
            _etapaRepository = etapaRepository;
        }

        public async Task<List<AtendimentoDto>> ObterTodosAsync()
        {
            var atendimentos = await _atendimentoRepository.ObterTodosAsync();
            return atendimentos.Select(MapToDto).ToList();
        }

        public async Task<AtendimentoDto?> ObterPorIdAsync(Guid id)
        {
            var atendimento = await _atendimentoRepository.ObterCompletoAsync(id);
            return atendimento != null ? MapToDto(atendimento) : null;
        }

        public async Task<ResultadoPaginado<AtendimentoDto>> BuscarAsync(AtendimentoFiltroDto filtro)
        {
            StatusAtendimento? status = null;
            if (!string.IsNullOrEmpty(filtro.Status))
                status = ParseStatus(filtro.Status);

            var (dados, total) = await _atendimentoRepository.BuscarPaginadoAsync(
                filtro.Busca, filtro.PacienteId, filtro.DentistaId, status,
                filtro.DataInicio, filtro.DataFim, filtro.Pagina, filtro.TamanhoPagina);

            return new ResultadoPaginado<AtendimentoDto>(
                dados.Select(MapToDto).ToList(), total, filtro.Pagina, filtro.TamanhoPagina);
        }

        public async Task<List<AtendimentoDto>> ObterPorPacienteAsync(Guid pacienteId)
        {
            var atendimentos = await _atendimentoRepository.ObterPorPacienteAsync(pacienteId);
            return atendimentos.Select(MapToDto).ToList();
        }

        public async Task<List<AtendimentoDto>> ObterPorDentistaAsync(Guid dentistaId)
        {
            var atendimentos = await _atendimentoRepository.ObterPorDentistaAsync(dentistaId);
            return atendimentos.Select(MapToDto).ToList();
        }

        public async Task<List<AtendimentoDto>> ObterPorStatusAsync(string status)
        {
            var statusEnum = ParseStatus(status);
            var atendimentos = await _atendimentoRepository.ObterPorStatusAsync(statusEnum);
            return atendimentos.Select(MapToDto).ToList();
        }

        public async Task<AtendimentoDto> CriarAsync(AtendimentoCreateDto dto)
        {
            var atendimento = new Atendimento(
                dto.PacienteId, dto.ModeloProcedimentoId, dto.DentistaId,
                dto.DataInicio, dto.CustoTotal, dto.Observacoes);

            await _atendimentoRepository.AdicionarAsync(atendimento);
            var atendimentoCompleto = await _atendimentoRepository.ObterCompletoAsync(atendimento.Id);
            return MapToDto(atendimentoCompleto!);
        }

        public async Task<(AtendimentoDto Atendimento, List<EtapaAtendimentoDto> Etapas)> CriarComEtapasAsync(
            AtendimentoComEtapasCreateDto dto)
        {
            var atendimento = new Atendimento(
                dto.Atendimento.PacienteId, dto.Atendimento.ModeloProcedimentoId,
                dto.Atendimento.DentistaId, dto.Atendimento.DataInicio,
                dto.Atendimento.CustoTotal, dto.Atendimento.Observacoes);

            await _atendimentoRepository.AdicionarAsync(atendimento);

            var etapas = new List<EtapaAtendimento>();
            foreach (var etapaDto in dto.Etapas)
            {
                var itensJson = etapaDto.ItensChecklist != null
                    ? JsonSerializer.Serialize(etapaDto.ItensChecklist) : null;
                var etapa = new EtapaAtendimento(
                    atendimento.Id, etapaDto.Nome, etapaDto.OrdemExibicao,
                    etapaDto.DataAgendada, itensJson);
                await _etapaRepository.AdicionarAsync(etapa);
                etapas.Add(etapa);
            }

            if (etapas.Any())
                atendimento.DefinirEtapaAtual(etapas.First().Id);

            var atendimentoCompleto = await _atendimentoRepository.ObterCompletoAsync(atendimento.Id);
            return (MapToDto(atendimentoCompleto!), etapas.Select(MapEtapaToDto).ToList());
        }

        public async Task<AtendimentoDto> AtualizarAsync(Guid id, AtendimentoUpdateDto dto)
        {
            var atendimento = await _atendimentoRepository.ObterPorIdAsync(id);
            if (atendimento == null)
                throw new ArgumentException("Atendimento não encontrado");

            atendimento.Atualizar(dto.DataInicio, dto.CustoTotal, dto.Observacoes);
            await _atendimentoRepository.AtualizarAsync(atendimento);

            var atendimentoCompleto = await _atendimentoRepository.ObterCompletoAsync(id);
            return MapToDto(atendimentoCompleto!);
        }

        public async Task<bool> AlterarStatusAsync(Guid id, string status)
        {
            var atendimento = await _atendimentoRepository.ObterPorIdAsync(id);
            if (atendimento == null) return false;

            atendimento.AlterarStatus(ParseStatus(status));
            await _atendimentoRepository.AtualizarAsync(atendimento);
            return true;
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _atendimentoRepository.RemoverAsync(id);
        }

        private static StatusAtendimento ParseStatus(string status)
        {
            return status.ToLower() switch
            {
                "scheduled" or "agendado" => StatusAtendimento.Agendado,
                "in_progress" or "emandamento" => StatusAtendimento.EmAndamento,
                "completed" or "concluido" => StatusAtendimento.Concluido,
                "cancelled" or "cancelado" => StatusAtendimento.Cancelado,
                _ => StatusAtendimento.Agendado
            };
        }

        private static string StatusToString(StatusAtendimento status)
        {
            return status switch
            {
                StatusAtendimento.Agendado => "scheduled",
                StatusAtendimento.EmAndamento => "in_progress",
                StatusAtendimento.Concluido => "completed",
                StatusAtendimento.Cancelado => "cancelled",
                _ => "scheduled"
            };
        }

        private static AtendimentoDto MapToDto(Atendimento a)
        {
            return new AtendimentoDto
            {
                Id = a.Id,
                PacienteId = a.PacienteId,
                PacienteNome = a.Paciente?.Nome ?? string.Empty,
                ModeloProcedimentoId = a.ModeloProcedimentoId,
                ModeloProcedimentoNome = a.ModeloProcedimento?.Nome ?? string.Empty,
                DentistaId = a.DentistaId,
                DentistaNome = a.Dentista?.Nome ?? string.Empty,
                DataInicio = a.DataInicio,
                Status = StatusToString(a.Status),
                EtapaAtualId = a.EtapaAtualId,
                CustoTotal = a.CustoTotal,
                Observacoes = a.Observacoes,
                DtCadastro = a.DtCadastro,
                Etapas = a.Etapas?.Select(MapEtapaToDto).ToList() ?? new List<EtapaAtendimentoDto>()
            };
        }

        private static EtapaAtendimentoDto MapEtapaToDto(EtapaAtendimento e)
        {
            return new EtapaAtendimentoDto
            {
                Id = e.Id,
                AtendimentoId = e.AtendimentoId,
                Nome = e.Nome,
                Status = StatusEtapaToString(e.Status),
                OrdemExibicao = e.OrdemExibicao,
                DataAgendada = e.DataAgendada,
                DataConclusao = e.DataConclusao,
                Observacoes = e.Observacoes,
                Anexos = DeserializeJson(e.AnexosJson),
                ItensChecklist = DeserializeJson(e.ItensChecklistJson),
                ChecklistConcluido = DeserializeJson(e.ChecklistConcluidoJson),
                DtCadastro = e.DtCadastro
            };
        }

        private static string StatusEtapaToString(StatusEtapa status)
        {
            return status switch
            {
                StatusEtapa.Pendente => "pending",
                StatusEtapa.EmAndamento => "in_progress",
                StatusEtapa.Concluido => "completed",
                StatusEtapa.Pulado => "skipped",
                _ => "pending"
            };
        }

        private static List<string>? DeserializeJson(string? json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            try { return JsonSerializer.Deserialize<List<string>>(json); }
            catch { return null; }
        }
    }

    public class EtapaAtendimentoService : IEtapaAtendimentoService
    {
        private readonly IEtapaAtendimentoRepository _etapaRepository;

        public EtapaAtendimentoService(IEtapaAtendimentoRepository etapaRepository)
        {
            _etapaRepository = etapaRepository;
        }

        public async Task<List<EtapaAtendimentoDto>> ObterTodosAsync()
        {
            var etapas = await _etapaRepository.ObterTodosAsync();
            return etapas.Select(MapToDto).ToList();
        }

        public async Task<EtapaAtendimentoDto?> ObterPorIdAsync(Guid id)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            return etapa != null ? MapToDto(etapa) : null;
        }

        public async Task<List<EtapaAtendimentoDto>> ObterPorAtendimentoIdAsync(Guid atendimentoId)
        {
            var etapas = await _etapaRepository.ObterPorAtendimentoIdAsync(atendimentoId);
            return etapas.Select(MapToDto).ToList();
        }

        public async Task<EtapaAtendimentoDto> CriarAsync(Guid atendimentoId, EtapaAtendimentoCreateDto dto)
        {
            var itensJson = dto.ItensChecklist != null ? JsonSerializer.Serialize(dto.ItensChecklist) : null;
            var etapa = new EtapaAtendimento(atendimentoId, dto.Nome, dto.OrdemExibicao, dto.DataAgendada, itensJson);
            await _etapaRepository.AdicionarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaAtendimentoDto> AtualizarAsync(Guid id, EtapaAtendimentoUpdateDto dto)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null) throw new ArgumentException("Etapa não encontrada");

            etapa.Atualizar(dto.Nome, dto.OrdemExibicao, dto.DataAgendada, dto.Observacoes);
            await _etapaRepository.AtualizarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaAtendimentoDto> AtualizarStatusAsync(Guid id, AtualizarStatusEtapaDto dto)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null) throw new ArgumentException("Etapa não encontrada");

            var status = ParseStatus(dto.Status);
            etapa.AlterarStatus(status);
            if (status == StatusEtapa.Concluido && dto.DataConclusao.HasValue)
                etapa.Concluir(dto.DataConclusao);

            await _etapaRepository.AtualizarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaAtendimentoDto> AtualizarChecklistAsync(Guid id, AtualizarChecklistDto dto)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null) throw new ArgumentException("Etapa não encontrada");

            var json = JsonSerializer.Serialize(dto.ItensConcluidos);
            etapa.AtualizarChecklist(json);
            await _etapaRepository.AtualizarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaAtendimentoDto> AdicionarAnexoAsync(Guid id, string anexo)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null) throw new ArgumentException("Etapa não encontrada");

            var anexos = DeserializeJson(etapa.AnexosJson) ?? new List<string>();
            anexos.Add(anexo);
            etapa.AtualizarAnexos(JsonSerializer.Serialize(anexos));
            await _etapaRepository.AtualizarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<EtapaAtendimentoDto> RemoverAnexoAsync(Guid id, string anexo)
        {
            var etapa = await _etapaRepository.ObterPorIdAsync(id);
            if (etapa == null) throw new ArgumentException("Etapa não encontrada");

            var anexos = DeserializeJson(etapa.AnexosJson) ?? new List<string>();
            anexos.Remove(anexo);
            etapa.AtualizarAnexos(JsonSerializer.Serialize(anexos));
            await _etapaRepository.AtualizarAsync(etapa);
            return MapToDto(etapa);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _etapaRepository.RemoverAsync(id);
        }

        private static StatusEtapa ParseStatus(string status)
        {
            return status.ToLower() switch
            {
                "pending" or "pendente" => StatusEtapa.Pendente,
                "in_progress" or "emandamento" => StatusEtapa.EmAndamento,
                "completed" or "concluido" => StatusEtapa.Concluido,
                "skipped" or "pulado" => StatusEtapa.Pulado,
                _ => StatusEtapa.Pendente
            };
        }

        private static EtapaAtendimentoDto MapToDto(EtapaAtendimento e)
        {
            return new EtapaAtendimentoDto
            {
                Id = e.Id,
                AtendimentoId = e.AtendimentoId,
                Nome = e.Nome,
                Status = e.Status switch
                {
                    StatusEtapa.Pendente => "pending",
                    StatusEtapa.EmAndamento => "in_progress",
                    StatusEtapa.Concluido => "completed",
                    StatusEtapa.Pulado => "skipped",
                    _ => "pending"
                },
                OrdemExibicao = e.OrdemExibicao,
                DataAgendada = e.DataAgendada,
                DataConclusao = e.DataConclusao,
                Observacoes = e.Observacoes,
                Anexos = DeserializeJson(e.AnexosJson),
                ItensChecklist = DeserializeJson(e.ItensChecklistJson),
                ChecklistConcluido = DeserializeJson(e.ChecklistConcluidoJson),
                DtCadastro = e.DtCadastro
            };
        }

        private static List<string>? DeserializeJson(string? json)
        {
            if (string.IsNullOrEmpty(json)) return null;
            try { return JsonSerializer.Deserialize<List<string>>(json); }
            catch { return null; }
        }
    }
}
