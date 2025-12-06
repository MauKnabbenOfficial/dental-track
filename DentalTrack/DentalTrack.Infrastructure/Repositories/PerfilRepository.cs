using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IPerfilRepository : IRepositoryBase<Perfil>
    {
        Task<Perfil?> ObterPorNomeAsync(string nome);
    }

    public class PerfilRepository : RepositoryBase<Perfil>, IPerfilRepository
    {
        public PerfilRepository(AppDbContext context) : base(context) { }

        public async Task<Perfil?> ObterPorNomeAsync(string nome)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.Nome == nome);
        }
    }
}
