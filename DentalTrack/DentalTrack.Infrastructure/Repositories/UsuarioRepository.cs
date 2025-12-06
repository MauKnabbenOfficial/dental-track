using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IUsuarioRepository : IRepositoryBase<Usuario>
    {
        Task<Usuario?> ObterPorEmailAsync(string email);
        Task<List<Usuario>> ObterPorPerfilAsync(Guid perfilId);
        Task<List<Usuario>> ObterDentistasAsync();
        Task<Usuario?> ObterComPerfilAsync(Guid id);
    }

    public class UsuarioRepository : RepositoryBase<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(AppDbContext context) : base(context) { }

        public async Task<Usuario?> ObterPorEmailAsync(string email)
        {
            return await _dbSet
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<Usuario>> ObterPorPerfilAsync(Guid perfilId)
        {
            return await _dbSet
                .Include(u => u.Perfil)
                .Where(u => u.PerfilId == perfilId && u.Ativo)
                .ToListAsync();
        }

        public async Task<List<Usuario>> ObterDentistasAsync()
        {
            return await _dbSet
                .Include(u => u.Perfil)
                .Where(u => u.Perfil.Nome == "Dentista" && u.Ativo)
                .ToListAsync();
        }

        public async Task<Usuario?> ObterComPerfilAsync(Guid id)
        {
            return await _dbSet
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public override async Task<List<Usuario>> ObterTodosAsync()
        {
            return await _dbSet
                .Include(u => u.Perfil)
                .ToListAsync();
        }
    }
}
