using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface ILancamentoFinanceiroRepository : IRepositoryBase<LancamentoFinanceiro>
    {
        Task<LancamentoFinanceiro?> ObterCompletoAsync(Guid id);
        Task<List<LancamentoFinanceiro>> ObterPorAtendimentoAsync(Guid atendimentoId);
        Task<List<LancamentoFinanceiro>> ObterPorPacienteAsync(Guid pacienteId);
        Task<List<LancamentoFinanceiro>> ObterPorTipoAsync(TipoLancamento tipo);
        Task<List<LancamentoFinanceiro>> ObterPorStatusAsync(StatusLancamento status);
        Task<(List<LancamentoFinanceiro> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            Guid? atendimentoId,
            Guid? pacienteId,
            TipoLancamento? tipo,
            StatusLancamento? status,
            DateTime? dataInicio,
            DateTime? dataFim,
            int pagina,
            int tamanhoPagina);
        Task<(decimal TotalReceitas, decimal TotalDespesas, decimal ReceitasPendentes, decimal DespesasPendentes)>
            ObterResumoPorPeriodoAsync(DateTime dataInicio, DateTime dataFim);
    }

    public class LancamentoFinanceiroRepository : RepositoryBase<LancamentoFinanceiro>, ILancamentoFinanceiroRepository
    {
        public LancamentoFinanceiroRepository(AppDbContext context) : base(context) { }

        public async Task<LancamentoFinanceiro?> ObterCompletoAsync(Guid id)
        {
            return await _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .Include(l => l.Atendimento)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<List<LancamentoFinanceiro>> ObterPorAtendimentoAsync(Guid atendimentoId)
        {
            return await _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .Where(l => l.AtendimentoId == atendimentoId)
                .OrderByDescending(l => l.DataLancamento)
                .ToListAsync();
        }

        public async Task<List<LancamentoFinanceiro>> ObterPorPacienteAsync(Guid pacienteId)
        {
            return await _dbSet
                .Include(l => l.CriadoPor)
                .Include(l => l.Atendimento)
                .Where(l => l.PacienteId == pacienteId)
                .OrderByDescending(l => l.DataLancamento)
                .ToListAsync();
        }

        public async Task<List<LancamentoFinanceiro>> ObterPorTipoAsync(TipoLancamento tipo)
        {
            return await _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .Where(l => l.Tipo == tipo)
                .OrderByDescending(l => l.DataLancamento)
                .ToListAsync();
        }

        public async Task<List<LancamentoFinanceiro>> ObterPorStatusAsync(StatusLancamento status)
        {
            return await _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .Where(l => l.Status == status)
                .OrderByDescending(l => l.DataLancamento)
                .ToListAsync();
        }

        public async Task<(List<LancamentoFinanceiro> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            Guid? atendimentoId,
            Guid? pacienteId,
            TipoLancamento? tipo,
            StatusLancamento? status,
            DateTime? dataInicio,
            DateTime? dataFim,
            int pagina,
            int tamanhoPagina)
        {
            var query = _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                var buscaLower = busca.ToLower();
                query = query.Where(l =>
                    l.Descricao.ToLower().Contains(buscaLower) ||
                    l.Categoria.ToLower().Contains(buscaLower));
            }

            if (atendimentoId.HasValue)
                query = query.Where(l => l.AtendimentoId == atendimentoId.Value);

            if (pacienteId.HasValue)
                query = query.Where(l => l.PacienteId == pacienteId.Value);

            if (tipo.HasValue)
                query = query.Where(l => l.Tipo == tipo.Value);

            if (status.HasValue)
                query = query.Where(l => l.Status == status.Value);

            if (dataInicio.HasValue)
                query = query.Where(l => l.DataLancamento >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(l => l.DataLancamento <= dataFim.Value);

            var total = await query.CountAsync();
            var dados = await query
                .OrderByDescending(l => l.DataLancamento)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (dados, total);
        }

        public async Task<(decimal TotalReceitas, decimal TotalDespesas, decimal ReceitasPendentes, decimal DespesasPendentes)>
            ObterResumoPorPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            var lancamentos = await _dbSet
                .Where(l => l.DataLancamento >= dataInicio && l.DataLancamento <= dataFim)
                .ToListAsync();

            var totalReceitas = lancamentos
                .Where(l => l.Tipo == TipoLancamento.Receita && l.Status == StatusLancamento.Pago)
                .Sum(l => l.Valor);

            var totalDespesas = lancamentos
                .Where(l => l.Tipo == TipoLancamento.Despesa && l.Status == StatusLancamento.Pago)
                .Sum(l => l.Valor);

            var receitasPendentes = lancamentos
                .Where(l => l.Tipo == TipoLancamento.Receita && l.Status == StatusLancamento.Pendente)
                .Sum(l => l.Valor);

            var despesasPendentes = lancamentos
                .Where(l => l.Tipo == TipoLancamento.Despesa && l.Status == StatusLancamento.Pendente)
                .Sum(l => l.Valor);

            return (totalReceitas, totalDespesas, receitasPendentes, despesasPendentes);
        }

        public override async Task<List<LancamentoFinanceiro>> ObterTodosAsync()
        {
            return await _dbSet
                .Include(l => l.Paciente)
                .Include(l => l.CriadoPor)
                .OrderByDescending(l => l.DataLancamento)
                .ToListAsync();
        }
    }
}
