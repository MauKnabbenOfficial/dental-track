using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IModeloProcedimentoRepository : IRepositoryBase<ModeloProcedimento>
    {
        Task<List<ModeloProcedimento>> ObterPorCategoriaAsync(string categoria);
        Task<List<string>> ObterCategoriasAsync();
        Task<ModeloProcedimento?> ObterComEtapasAsync(Guid id);
    }

    public class ModeloProcedimentoRepository : RepositoryBase<ModeloProcedimento>, IModeloProcedimentoRepository
    {
        public ModeloProcedimentoRepository(AppDbContext context) : base(context) { }

        public async Task<List<ModeloProcedimento>> ObterPorCategoriaAsync(string categoria)
        {
            return await _dbSet
                .Where(m => m.Categoria.ToLower() == categoria.ToLower() && m.Ativo)
                .ToListAsync();
        }

        public async Task<List<string>> ObterCategoriasAsync()
        {
            return await _dbSet
                .Where(m => m.Ativo)
                .Select(m => m.Categoria)
                .Distinct()
                .ToListAsync();
        }

        public async Task<ModeloProcedimento?> ObterComEtapasAsync(Guid id)
        {
            return await _dbSet
                .Include(m => m.Etapas.OrderBy(e => e.OrdemExibicao))
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public override async Task<List<ModeloProcedimento>> ObterTodosAsync()
        {
            return await _dbSet
                .Include(m => m.Etapas.OrderBy(e => e.OrdemExibicao))
                .ToListAsync();
        }
    }

    public interface IEtapaModeloProcedimentoRepository : IRepositoryBase<EtapaModeloProcedimento>
    {
        Task<List<EtapaModeloProcedimento>> ObterPorModeloIdAsync(Guid modeloId);
    }

    public class EtapaModeloProcedimentoRepository : RepositoryBase<EtapaModeloProcedimento>, IEtapaModeloProcedimentoRepository
    {
        public EtapaModeloProcedimentoRepository(AppDbContext context) : base(context) { }

        public async Task<List<EtapaModeloProcedimento>> ObterPorModeloIdAsync(Guid modeloId)
        {
            return await _dbSet
                .Where(e => e.ModeloProcedimentoId == modeloId)
                .OrderBy(e => e.OrdemExibicao)
                .ToListAsync();
        }
    }
}
