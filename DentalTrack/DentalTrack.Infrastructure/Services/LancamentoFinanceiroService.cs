using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;

namespace DentalTrack.Infrastructure.Services
{
    public class LancamentoFinanceiroService : ILancamentoFinanceiroService
    {
        private readonly ILancamentoFinanceiroRepository _lancamentoRepository;

        public LancamentoFinanceiroService(ILancamentoFinanceiroRepository lancamentoRepository)
        {
            _lancamentoRepository = lancamentoRepository;
        }

        public async Task<List<LancamentoFinanceiroDto>> ObterTodosAsync()
        {
            var lancamentos = await _lancamentoRepository.ObterTodosAsync();
            return lancamentos.Select(MapToDto).ToList();
        }

        public async Task<LancamentoFinanceiroDto?> ObterPorIdAsync(Guid id)
        {
            var lancamento = await _lancamentoRepository.ObterCompletoAsync(id);
            return lancamento != null ? MapToDto(lancamento) : null;
        }

        public async Task<ResultadoPaginado<LancamentoFinanceiroDto>> BuscarAsync(LancamentoFiltroDto filtro)
        {
            TipoLancamento? tipo = null;
            StatusLancamento? status = null;

            if (!string.IsNullOrEmpty(filtro.Tipo))
                tipo = ParseTipo(filtro.Tipo);
            if (!string.IsNullOrEmpty(filtro.Status))
                status = ParseStatus(filtro.Status);

            var (dados, total) = await _lancamentoRepository.BuscarPaginadoAsync(
                filtro.Busca, filtro.AtendimentoId, filtro.PacienteId,
                tipo, status, filtro.DataInicio, filtro.DataFim,
                filtro.Pagina, filtro.TamanhoPagina);

            return new ResultadoPaginado<LancamentoFinanceiroDto>(
                dados.Select(MapToDto).ToList(), total, filtro.Pagina, filtro.TamanhoPagina);
        }

        public async Task<List<LancamentoFinanceiroDto>> ObterPorAtendimentoAsync(Guid atendimentoId)
        {
            var lancamentos = await _lancamentoRepository.ObterPorAtendimentoAsync(atendimentoId);
            return lancamentos.Select(MapToDto).ToList();
        }

        public async Task<List<LancamentoFinanceiroDto>> ObterPorPacienteAsync(Guid pacienteId)
        {
            var lancamentos = await _lancamentoRepository.ObterPorPacienteAsync(pacienteId);
            return lancamentos.Select(MapToDto).ToList();
        }

        public async Task<List<LancamentoFinanceiroDto>> ObterPorTipoAsync(string tipo)
        {
            var tipoEnum = ParseTipo(tipo);
            var lancamentos = await _lancamentoRepository.ObterPorTipoAsync(tipoEnum);
            return lancamentos.Select(MapToDto).ToList();
        }

        public async Task<List<LancamentoFinanceiroDto>> ObterPorStatusAsync(string status)
        {
            var statusEnum = ParseStatus(status);
            var lancamentos = await _lancamentoRepository.ObterPorStatusAsync(statusEnum);
            return lancamentos.Select(MapToDto).ToList();
        }

        public async Task<LancamentoFinanceiroDto> CriarAsync(LancamentoFinanceiroCreateDto dto, Guid usuarioId)
        {
            var tipo = ParseTipo(dto.Tipo);
            var tipoResponsavel = ParseTipoResponsavel(dto.TipoResponsavel);

            var lancamento = new LancamentoFinanceiro(
                dto.AtendimentoId, // Directly pass the nullable Guid
                usuarioId, tipo, dto.Valor,
                dto.DataLancamento, dto.Descricao, dto.Categoria,
                tipoResponsavel, dto.PacienteId);

            try
            {
                await _lancamentoRepository.AdicionarAsync(lancamento);
            }
            catch (Exception ex)
            {

                throw;
            }
            var lancamentoCompleto = await _lancamentoRepository.ObterCompletoAsync(lancamento.Id);
            return MapToDto(lancamentoCompleto!);
        }

        public async Task<LancamentoFinanceiroDto> AtualizarAsync(Guid id, LancamentoFinanceiroUpdateDto dto)
        {
            var lancamento = await _lancamentoRepository.ObterPorIdAsync(id);
            if (lancamento == null)
                throw new ArgumentException("Lançamento não encontrado");

            var tipoResponsavel = ParseTipoResponsavel(dto.TipoResponsavel);
            lancamento.Atualizar(dto.Valor, dto.DataLancamento, dto.Descricao, dto.Categoria, tipoResponsavel);
            await _lancamentoRepository.AtualizarAsync(lancamento);

            var lancamentoCompleto = await _lancamentoRepository.ObterCompletoAsync(id);
            return MapToDto(lancamentoCompleto!);
        }

        public async Task<LancamentoFinanceiroDto> AtualizarStatusPagamentoAsync(Guid id, AtualizarStatusPagamentoDto dto)
        {
            var lancamento = await _lancamentoRepository.ObterPorIdAsync(id);
            if (lancamento == null)
                throw new ArgumentException("Lançamento não encontrado");

            var status = ParseStatus(dto.Status);
            switch (status)
            {
                case StatusLancamento.Pago:
                    lancamento.MarcarComoPago(dto.DataPagamento);
                    break;
                case StatusLancamento.Cancelado:
                    lancamento.Cancelar();
                    break;
                case StatusLancamento.Pendente:
                    lancamento.VoltarParaPendente();
                    break;
            }

            await _lancamentoRepository.AtualizarAsync(lancamento);
            var lancamentoCompleto = await _lancamentoRepository.ObterCompletoAsync(id);
            return MapToDto(lancamentoCompleto!);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _lancamentoRepository.RemoverAsync(id);
        }

        public async Task<ResumoFinanceiroDto> ObterResumoPorPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            var (totalReceitas, totalDespesas, receitasPendentes, despesasPendentes) =
                await _lancamentoRepository.ObterResumoPorPeriodoAsync(dataInicio, dataFim);

            return new ResumoFinanceiroDto
            {
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas,
                ReceitasPendentes = receitasPendentes,
                DespesasPendentes = despesasPendentes
            };
        }

        private static TipoLancamento ParseTipo(string tipo)
        {
            return tipo.ToLower() switch
            {
                "income" or "receita" => TipoLancamento.Receita,
                "expense" or "despesa" => TipoLancamento.Despesa,
                _ => TipoLancamento.Receita
            };
        }

        private static StatusLancamento ParseStatus(string status)
        {
            return status.ToLower() switch
            {
                "pending" or "pendente" => StatusLancamento.Pendente,
                "paid" or "pago" => StatusLancamento.Pago,
                "cancelled" or "cancelado" => StatusLancamento.Cancelado,
                _ => StatusLancamento.Pendente
            };
        }

        private static TipoResponsavel ParseTipoResponsavel(string tipo)
        {
            return tipo.ToLower() switch
            {
                "patient" or "paciente" => TipoResponsavel.Paciente,
                "clinic" or "clinica" => TipoResponsavel.Clinica,
                _ => TipoResponsavel.Paciente
            };
        }

        private static LancamentoFinanceiroDto MapToDto(LancamentoFinanceiro l)
        {
            return new LancamentoFinanceiroDto
            {
                Id = l.Id,
                AtendimentoId = l.AtendimentoId,
                PacienteId = l.PacienteId,
                PacienteNome = l.Paciente?.Nome,
                CriadoPorId = l.CriadoPorId,
                CriadoPorNome = l.CriadoPor?.Nome ?? string.Empty,
                Tipo = l.Tipo == TipoLancamento.Receita ? "receita" : "despesa",
                Valor = l.Valor,
                DataLancamento = l.DataLancamento,
                DataPagamento = l.DataPagamento,
                Descricao = l.Descricao,
                Categoria = l.Categoria,
                TipoResponsavel = l.TipoResponsavel == TipoResponsavel.Paciente ? "paciente" : "clinica",
                Status = l.Status switch
                {
                    StatusLancamento.Pendente => "pendente",
                    StatusLancamento.Pago => "pago",
                    StatusLancamento.Cancelado => "cancelado",
                    _ => "pendente"
                },
                DtCadastro = l.DtCadastro
            };
        }
    }
}
