using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IModeloEtapaRepository : IRepositoryBase<ModeloEtapa>
    {
        Task<List<ModeloEtapa>> BuscarPorNomeAsync(string nome);
    }

    public class ModeloEtapaRepository : RepositoryBase<ModeloEtapa>, IModeloEtapaRepository
    {
        public ModeloEtapaRepository(AppDbContext context) : base(context) { }

        public async Task<List<ModeloEtapa>> BuscarPorNomeAsync(string nome)
        {
            return await _dbSet
                .Where(m => m.Nome.ToLower().Contains(nome.ToLower()) && m.Ativo)
                .ToListAsync();
        }
    }
}
