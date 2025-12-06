using DentalTrack.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DentalTrack.Infrastructure.DB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Perfil> Perfis => Set<Perfil>();
        public DbSet<Paciente> Pacientes => Set<Paciente>();
        public DbSet<ModeloProcedimento> ModelosProcedimento => Set<ModeloProcedimento>();
        public DbSet<EtapaModeloProcedimento> EtapasModeloProcedimento => Set<EtapaModeloProcedimento>();
        public DbSet<ModeloEtapa> ModelosEtapa => Set<ModeloEtapa>();
        public DbSet<Atendimento> Atendimentos => Set<Atendimento>();
        public DbSet<EtapaAtendimento> EtapasAtendimento => Set<EtapaAtendimento>();
        public DbSet<LancamentoFinanceiro> LancamentosFinanceiros => Set<LancamentoFinanceiro>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========== PERFIL ==========
            modelBuilder.Entity<Perfil>(entity =>
            {
                entity.ToTable("Perfis");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Descricao).HasMaxLength(500);
                entity.HasIndex(e => e.Nome).IsUnique();
            });

            // ========== USUARIO ==========
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
                entity.Property(e => e.SenhaHash).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Especialidade).HasMaxLength(200);
                entity.Property(e => e.Avatar).HasMaxLength(500);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.HasOne(e => e.Perfil)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(e => e.PerfilId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========== PACIENTE ==========
            modelBuilder.Entity<Paciente>(entity =>
            {
                entity.ToTable("Pacientes");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Cpf).HasMaxLength(14).IsRequired();
                entity.Property(e => e.Telefone).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(200).IsRequired();
                entity.Property(e => e.ConvenioId).HasMaxLength(100);
                entity.Property(e => e.ConvenioNome).HasMaxLength(200);
                entity.Property(e => e.Cep).HasMaxLength(10);
                entity.Property(e => e.Logradouro).HasMaxLength(300);
                entity.Property(e => e.Numero).HasMaxLength(20);
                entity.Property(e => e.Complemento).HasMaxLength(200);
                entity.Property(e => e.Bairro).HasMaxLength(200);
                entity.Property(e => e.Cidade).HasMaxLength(200);
                entity.Property(e => e.Estado).HasMaxLength(2);
                entity.HasIndex(e => e.Cpf).IsUnique();
            });

            // ========== MODELO PROCEDIMENTO ==========
            modelBuilder.Entity<ModeloProcedimento>(entity =>
            {
                entity.ToTable("ModelosProcedimento");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.CustoBase).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DuracaoEstimada).HasMaxLength(50);
                entity.Property(e => e.Descricao).HasMaxLength(1000);
                entity.Property(e => e.Categoria).HasMaxLength(100);
            });

            // ========== ETAPA MODELO PROCEDIMENTO ==========
            modelBuilder.Entity<EtapaModeloProcedimento>(entity =>
            {
                entity.ToTable("EtapasModeloProcedimento");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Descricao).HasMaxLength(1000);
                entity.Property(e => e.ItensChecklistJson).HasColumnType("nvarchar(max)");

                entity.HasOne(e => e.ModeloProcedimento)
                    .WithMany(m => m.Etapas)
                    .HasForeignKey(e => e.ModeloProcedimentoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ========== MODELO ETAPA ==========
            modelBuilder.Entity<ModeloEtapa>(entity =>
            {
                entity.ToTable("ModelosEtapa");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Descricao).HasMaxLength(1000);
                entity.Property(e => e.ItensChecklistJson).HasColumnType("nvarchar(max)");
            });

            // ========== ATENDIMENTO ==========
            modelBuilder.Entity<Atendimento>(entity =>
            {
                entity.ToTable("Atendimentos");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustoTotal).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Observacoes).HasMaxLength(2000);
                entity.Property(e => e.Status).HasConversion<int>();

                entity.HasOne(e => e.Paciente)
                    .WithMany(p => p.Atendimentos)
                    .HasForeignKey(e => e.PacienteId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ModeloProcedimento)
                    .WithMany(m => m.Atendimentos)
                    .HasForeignKey(e => e.ModeloProcedimentoId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Dentista)
                    .WithMany(u => u.Atendimentos)
                    .HasForeignKey(e => e.DentistaId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========== ETAPA ATENDIMENTO ==========
            modelBuilder.Entity<EtapaAtendimento>(entity =>
            {
                entity.ToTable("EtapasAtendimento");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Observacoes).HasMaxLength(2000);
                entity.Property(e => e.AnexosJson).HasColumnType("nvarchar(max)");
                entity.Property(e => e.ItensChecklistJson).HasColumnType("nvarchar(max)");
                entity.Property(e => e.ChecklistConcluidoJson).HasColumnType("nvarchar(max)");
                entity.Property(e => e.Status).HasConversion<int>();

                entity.HasOne(e => e.Atendimento)
                    .WithMany(a => a.Etapas)
                    .HasForeignKey(e => e.AtendimentoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ========== LANCAMENTO FINANCEIRO ==========
            modelBuilder.Entity<LancamentoFinanceiro>(entity =>
            {
                entity.ToTable("LancamentosFinanceiros");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Valor).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Descricao).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Categoria).HasMaxLength(100);
                entity.Property(e => e.Tipo).HasConversion<int>();
                entity.Property(e => e.TipoResponsavel).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();

                entity.HasOne(e => e.Atendimento)
                    .WithMany(a => a.LancamentosFinanceiros)
                    .HasForeignKey(e => e.AtendimentoId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Paciente)
                    .WithMany(p => p.LancamentosFinanceiros)
                    .HasForeignKey(e => e.PacienteId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CriadoPor)
                    .WithMany(u => u.LancamentosCriados)
                    .HasForeignKey(e => e.CriadoPorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ========== SEED DATA - PERFIS PADRÃO ==========
            modelBuilder.Entity<Perfil>().HasData(
                new { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Nome = "Admin", Descricao = "Administrador do sistema", Ativo = true, DtCadastro = DateTime.UtcNow },
                new { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Nome = "Dentista", Descricao = "Profissional dentista", Ativo = true, DtCadastro = DateTime.UtcNow },
                new { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Nome = "Recepcionista", Descricao = "Recepcionista da clínica", Ativo = true, DtCadastro = DateTime.UtcNow }
            );

            // ========== SEED DATA - USUÁRIO ADMIN MESTRE ==========
            // Senha: admin123 (hash BCrypt válido)
            modelBuilder.Entity<Usuario>().HasData(
                new
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Nome = "Administrador",
                    Email = "admin@dentaltrack.com",
                    SenhaHash = "$2a$11$8exE8GCa34lMzsE29t5y9ujB5Yiz5qjaFOV2MMc.Sghvs/9K3/Qey", // admin123
                    PerfilId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Especialidade = (string?)null,
                    Avatar = (string?)null,
                    EmailConfirmado = true,
                    Ativo = true,
                    DtCadastro = DateTime.UtcNow
                }
            );
        }
    }
}
