using DentalTrack.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.DB
{
    public class DbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options) { }

        // Exemplos:
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        //public DbSet<Paciente> Pacientes => Set<Paciente>();
        //public DbSet<Cirurgia> Cirurgias => Set<Cirurgia>();
        //public DbSet<Procedimento> Procedimentos => Set<Procedimento>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DbContext).Assembly);
        }
    }
}
