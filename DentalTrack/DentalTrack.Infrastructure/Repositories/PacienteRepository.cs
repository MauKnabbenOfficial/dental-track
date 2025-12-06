using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.Repositories
{
    public interface IPacienteRepository : IRepositoryBase<Paciente>
    {
        Task<Paciente?> ObterPorCpfAsync(string cpf);
        Task<List<Paciente>> ObterPorConvenioAsync(string convenioNome);
        Task<(List<Paciente> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            string? cpf,
            string? convenioNome,
            int pagina,
            int tamanhoPagina);
    }

    public class PacienteRepository : RepositoryBase<Paciente>, IPacienteRepository
    {
        public PacienteRepository(AppDbContext context) : base(context) { }

        public async Task<Paciente?> ObterPorCpfAsync(string cpf)
        {
            var cpfLimpo = cpf.Replace(".", "").Replace("-", "");
            return await _dbSet.FirstOrDefaultAsync(p =>
                p.Cpf.Replace(".", "").Replace("-", "") == cpfLimpo);
        }

        public async Task<List<Paciente>> ObterPorConvenioAsync(string convenioNome)
        {
            return await _dbSet
                .Where(p => p.ConvenioNome != null &&
                            p.ConvenioNome.ToLower().Contains(convenioNome.ToLower()) &&
                            p.Ativo)
                .ToListAsync();
        }

        public async Task<(List<Paciente> Dados, int Total)> BuscarPaginadoAsync(
            string? busca,
            string? cpf,
            string? convenioNome,
            int pagina,
            int tamanhoPagina)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrWhiteSpace(busca))
            {
                var buscaLower = busca.ToLower();
                query = query.Where(p =>
                    p.Nome.ToLower().Contains(buscaLower) ||
                    p.Email.ToLower().Contains(buscaLower) ||
                    p.Telefone.Contains(busca));
            }

            if (!string.IsNullOrWhiteSpace(cpf))
            {
                var cpfLimpo = cpf.Replace(".", "").Replace("-", "");
                query = query.Where(p => p.Cpf.Replace(".", "").Replace("-", "").Contains(cpfLimpo));
            }

            if (!string.IsNullOrWhiteSpace(convenioNome))
            {
                query = query.Where(p => p.ConvenioNome != null &&
                                         p.ConvenioNome.ToLower().Contains(convenioNome.ToLower()));
            }

            var total = await query.CountAsync();
            var dados = await query
                .OrderBy(p => p.Nome)
                .Skip((pagina - 1) * tamanhoPagina)
                .Take(tamanhoPagina)
                .ToListAsync();

            return (dados, total);
        }
    }
}
