using DentalTrack.Application.Interfaces;
using DentalTrack.Infrastructure.DB;
using DentalTrack.Infrastructure.Repositories;
using DentalTrack.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DentalTrack.Infrastructure.DependencyInjection
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Repositories
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IPerfilRepository, PerfilRepository>();
            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<IModeloProcedimentoRepository, ModeloProcedimentoRepository>();
            services.AddScoped<IEtapaModeloProcedimentoRepository, EtapaModeloProcedimentoRepository>();
            services.AddScoped<IModeloEtapaRepository, ModeloEtapaRepository>();
            services.AddScoped<IAtendimentoRepository, AtendimentoRepository>();
            services.AddScoped<IEtapaAtendimentoRepository, EtapaAtendimentoRepository>();
            services.AddScoped<ILancamentoFinanceiroRepository, LancamentoFinanceiroRepository>();

            // Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IPerfilService, PerfilService>();
            services.AddScoped<IPacienteService, PacienteService>();
            services.AddScoped<IModeloProcedimentoService, ModeloProcedimentoService>();
            services.AddScoped<IEtapaModeloProcedimentoService, EtapaModeloProcedimentoService>();
            services.AddScoped<IModeloEtapaService, ModeloEtapaService>();
            services.AddScoped<IAtendimentoService, AtendimentoService>();
            services.AddScoped<IEtapaAtendimentoService, EtapaAtendimentoService>();
            services.AddScoped<ILancamentoFinanceiroService, LancamentoFinanceiroService>();

            return services;
        }
    }
}
