using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IAtendimentoRepository : IRepositoryBase<Atendimento>
    {
        Task<Atendimento?> ObterCompletoAsync(Guid id);
        Task<List<Atendimento>> ObterPorPacienteAsync(Guid pacienteId);
        Task<List<Atendimento>> ObterPorDentistaAsync(Guid dentistaId);
        Task<List<Atendimento>> ObterPorStatusAsync(StatusAtendimento status);
        Task<(List<Atendimento> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            Guid? pacienteId,
            Guid? dentistaId,
            StatusAtendimento? status,
            DateTime? dataInicio,
            DateTime? dataFim,
            int pagina,
            int tamanhoPagina);
    }

    public class AtendimentoRepository : RepositoryBase<Atendimento>, IAtendimentoRepository
    {
        public AtendimentoRepository(AppDbContext context) : base(context) { }

        public async Task<Atendimento?> ObterCompletoAsync(Guid id)
        {
            return await _dbSet
                .Include(a => a.Paciente)
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Dentista)
                    .ThenInclude(d => d.Perfil)
                .Include(a => a.Etapas.OrderBy(e => e.OrdemExibicao))
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Atendimento>> ObterPorPacienteAsync(Guid pacienteId)
        {
            return await _dbSet
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Dentista)
                .Include(a => a.Etapas.OrderBy(e => e.OrdemExibicao))
                .Where(a => a.PacienteId == pacienteId)
                .OrderByDescending(a => a.DataInicio)
                .ToListAsync();
        }

        public async Task<List<Atendimento>> ObterPorDentistaAsync(Guid dentistaId)
        {
            return await _dbSet
                .Include(a => a.Paciente)
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Etapas.OrderBy(e => e.OrdemExibicao))
                .Where(a => a.DentistaId == dentistaId)
                .OrderByDescending(a => a.DataInicio)
                .ToListAsync();
        }

        public async Task<List<Atendimento>> ObterPorStatusAsync(StatusAtendimento status)
        {
            return await _dbSet
                .Include(a => a.Paciente)
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Dentista)
                .Where(a => a.Status == status)
                .OrderByDescending(a => a.DataInicio)
                .ToListAsync();
        }

        public async Task<(List<Atendimento> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            Guid? pacienteId,
            Guid? dentistaId,
            StatusAtendimento? status,
            DateTime? dataInicio,
            DateTime? dataFim,
            int pagina,
            int tamanhoPagina)
        {
            var query = _dbSet
                .Include(a => a.Paciente)
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Dentista)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                var buscaLower = busca.ToLower();
                query = query.Where(a =>
                    (a.Observacoes != null && a.Observacoes.ToLower().Contains(buscaLower)) ||
                    a.Paciente.Nome.ToLower().Contains(buscaLower) ||
                    a.ModeloProcedimento.Nome.ToLower().Contains(buscaLower));
            }

            if (pacienteId.HasValue)
                query = query.Where(a => a.PacienteId == pacienteId.Value);

            if (dentistaId.HasValue)
                query = query.Where(a => a.DentistaId == dentistaId.Value);

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            if (dataInicio.HasValue)
                query = query.Where(a => a.DataInicio >= dataInicio.Value);

            if (dataFim.HasValue)
                query = query.Where(a => a.DataInicio <= dataFim.Value);

            var total = await query.CountAsync();
            var dados = await query
                .OrderByDescending(a => a.DataInicio)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (dados, total);
        }

        public override async Task<List<Atendimento>> ObterTodosAsync()
        {
            return await _dbSet
                .Include(a => a.Paciente)
                .Include(a => a.ModeloProcedimento)
                .Include(a => a.Dentista)
                .Include(a => a.Etapas.OrderBy(e => e.OrdemExibicao))
                .OrderByDescending(a => a.DataInicio)
                .ToListAsync();
        }
    }

    public interface IEtapaAtendimentoRepository : IRepositoryBase<EtapaAtendimento>
    {
        Task<List<EtapaAtendimento>> ObterPorAtendimentoIdAsync(Guid atendimentoId);
    }

    public class EtapaAtendimentoRepository : RepositoryBase<EtapaAtendimento>, IEtapaAtendimentoRepository
    {
        public EtapaAtendimentoRepository(AppDbContext context) : base(context) { }

        public async Task<List<EtapaAtendimento>> ObterPorAtendimentoIdAsync(Guid atendimentoId)
        {
            return await _dbSet
                .Where(e => e.AtendimentoId == atendimentoId)
                .OrderBy(e => e.OrdemExibicao)
                .ToListAsync();
        }
    }
}
