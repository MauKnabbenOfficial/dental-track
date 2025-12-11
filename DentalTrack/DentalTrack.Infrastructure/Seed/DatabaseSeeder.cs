using System.Text.Json;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DentalTrack.Infrastructure.Seed
{
    public class DatabaseSeeder
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(AppDbContext context, ILogger<DatabaseSeeder> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                // Verifica se já tem dados (além do admin que já foi adicionado via migration)
                if (await _context.Pacientes.AnyAsync())
                {
                    _logger.LogInformation("Banco de dados já possui dados. Seed ignorado.");
                    return;
                }

                _logger.LogInformation("Iniciando seed do banco de dados...");

                // Carrega o JSON
                var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Seed", "SeedData.json");

                // Se não encontrar no diretório de execução, tenta o caminho do projeto
                if (!File.Exists(jsonPath))
                {
                    // Procura na pasta da DLL
                    var assemblyLocation = typeof(DatabaseSeeder).Assembly.Location;
                    var assemblyDir = Path.GetDirectoryName(assemblyLocation);
                    jsonPath = Path.Combine(assemblyDir!, "Seed", "SeedData.json");
                }

                if (!File.Exists(jsonPath))
                {
                    _logger.LogWarning("Arquivo SeedData.json não encontrado em: {Path}", jsonPath);
                    return;
                }

                var jsonContent = await File.ReadAllTextAsync(jsonPath);
                var seedData = JsonSerializer.Deserialize<SeedDataModel>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (seedData == null)
                {
                    _logger.LogWarning("Falha ao deserializar SeedData.json");
                    return;
                }

                // Seed Usuários
                await SeedUsuariosAsync(seedData.Usuarios);

                // Seed Pacientes
                await SeedPacientesAsync(seedData.Pacientes);

                // Seed Modelos de Procedimento
                await SeedModelosProcedimentoAsync(seedData.ModelosProcedimento);

                // Seed Etapas de Modelo de Procedimento
                await SeedEtapasModeloProcedimentoAsync(seedData.EtapasModeloProcedimento);

                // Seed Atendimentos
                await SeedAtendimentosAsync(seedData.Atendimentos);

                // Seed Etapas de Atendimento
                await SeedEtapasAtendimentoAsync(seedData.EtapasAtendimento);

                // Seed Lançamentos Financeiros
                await SeedLancamentosFinanceirosAsync(seedData.LancamentosFinanceiros);

                _logger.LogInformation("Seed do banco de dados concluído com sucesso!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao realizar seed do banco de dados");
                throw;
            }
        }

        private async Task SeedUsuariosAsync(List<UsuarioSeedDto> usuarios)
        {
            foreach (var dto in usuarios)
            {
                if (await _context.Usuarios.AnyAsync(u => u.Id == Guid.Parse(dto.Id)))
                    continue;

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO Usuarios (Id, Nome, Email, SenhaHash, PerfilId, Especialidade, Avatar, EmailConfirmado, Ativo, DtCadastro)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, NULL, 1, 1, GETUTCDATE())",
                    Guid.Parse(dto.Id), dto.Nome, dto.Email, dto.SenhaHash, Guid.Parse(dto.PerfilId), dto.Especialidade);
            }
            _logger.LogInformation("Usuários inseridos: {Count}", usuarios.Count);
        }

        private async Task SeedPacientesAsync(List<PacienteSeedDto> pacientes)
        {
            foreach (var dto in pacientes)
            {
                if (await _context.Pacientes.AnyAsync(p => p.Id == Guid.Parse(dto.Id)))
                    continue;

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO Pacientes (Id, Nome, Cpf, Telefone, Email, DataNascimento, ConvenioId, ConvenioNome, Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, DtCadastro, Ativo)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12}, {13}, {14}, GETUTCDATE(), 1)",
                    Guid.Parse(dto.Id), dto.Nome, dto.Cpf, dto.Telefone, dto.Email,
                    DateTime.Parse(dto.DataNascimento), dto.ConvenioId, dto.ConvenioNome,
                    dto.Cep, dto.Logradouro, dto.Numero, dto.Complemento, dto.Bairro, dto.Cidade, dto.Estado);
            }
            _logger.LogInformation("Pacientes inseridos: {Count}", pacientes.Count);
        }

        private async Task SeedModelosProcedimentoAsync(List<ModeloProcedimentoSeedDto> modelos)
        {
            foreach (var dto in modelos)
            {
                if (await _context.ModelosProcedimento.AnyAsync(m => m.Id == Guid.Parse(dto.Id)))
                    continue;

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO ModelosProcedimento (Id, Nome, CustoBase, DuracaoEstimada, Descricao, Categoria, DtCadastro, Ativo)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, GETUTCDATE(), 1)",
                    Guid.Parse(dto.Id), dto.Nome, dto.CustoBase, dto.DuracaoEstimada, dto.Descricao, dto.Categoria);
            }
            _logger.LogInformation("Modelos de Procedimento inseridos: {Count}", modelos.Count);
        }

        private async Task SeedEtapasModeloProcedimentoAsync(List<EtapaModeloProcedimentoSeedDto> etapas)
        {
            foreach (var dto in etapas)
            {
                if (await _context.EtapasModeloProcedimento.AnyAsync(e => e.Id == Guid.Parse(dto.Id)))
                    continue;

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO EtapasModeloProcedimento (Id, ModeloProcedimentoId, Nome, OrdemExibicao, Descricao, ItensChecklistJson, DtCadastro)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, GETUTCDATE())",
                    Guid.Parse(dto.Id), Guid.Parse(dto.ModeloProcedimentoId), dto.Nome, dto.OrdemExibicao, dto.Descricao, dto.ItensChecklistJson);
            }
            _logger.LogInformation("Etapas de Modelo inseridas: {Count}", etapas.Count);
        }

        private async Task SeedAtendimentosAsync(List<AtendimentoSeedDto> atendimentos)
        {
            foreach (var dto in atendimentos)
            {
                if (await _context.Atendimentos.AnyAsync(a => a.Id == Guid.Parse(dto.Id)))
                    continue;

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO Atendimentos (Id, PacienteId, ModeloProcedimentoId, DentistaId, DataInicio, Status, EtapaAtualId, CustoTotal, Observacoes, DtCadastro)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, NULL, {6}, {7}, GETUTCDATE())",
                    Guid.Parse(dto.Id), Guid.Parse(dto.PacienteId), Guid.Parse(dto.ModeloProcedimentoId),
                    Guid.Parse(dto.DentistaId), DateTime.Parse(dto.DataInicio), dto.Status, dto.CustoTotal, dto.Observacoes);
            }
            _logger.LogInformation("Atendimentos inseridos: {Count}", atendimentos.Count);
        }

        private async Task SeedEtapasAtendimentoAsync(List<EtapaAtendimentoSeedDto> etapas)
        {
            foreach (var dto in etapas)
            {
                if (await _context.EtapasAtendimento.AnyAsync(e => e.Id == Guid.Parse(dto.Id)))
                    continue;

                DateTime? dataAgendada = string.IsNullOrEmpty(dto.DataAgendada) ? null : DateTime.Parse(dto.DataAgendada);
                DateTime? dataConclusao = string.IsNullOrEmpty(dto.DataConclusao) ? null : DateTime.Parse(dto.DataConclusao);

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO EtapasAtendimento (Id, AtendimentoId, Nome, Status, OrdemExibicao, DataAgendada, DataConclusao, Observacoes, AnexosJson, ItensChecklistJson, ChecklistConcluidoJson, DtCadastro)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, NULL, NULL, NULL, GETUTCDATE())",
                    Guid.Parse(dto.Id), Guid.Parse(dto.AtendimentoId), dto.Nome, dto.Status, dto.OrdemExibicao,
                    dataAgendada, dataConclusao, dto.Observacoes);
            }
            _logger.LogInformation("Etapas de Atendimento inseridas: {Count}", etapas.Count);
        }

        private async Task SeedLancamentosFinanceirosAsync(List<LancamentoFinanceiroSeedDto> lancamentos)
        {
            foreach (var dto in lancamentos)
            {
                if (await _context.LancamentosFinanceiros.AnyAsync(l => l.Id == Guid.Parse(dto.Id)))
                    continue;

                Guid? pacienteId = string.IsNullOrEmpty(dto.PacienteId) ? null : Guid.Parse(dto.PacienteId);

                await _context.Database.ExecuteSqlRawAsync(@"
                    INSERT INTO LancamentosFinanceiros (Id, AtendimentoId, PacienteId, CriadoPorId, Tipo, Valor, DataLancamento, DataPagamento, Descricao, Categoria, TipoResponsavel, Status, DtCadastro)
                    VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, GETUTCDATE())",
                    Guid.Parse(dto.Id), Guid.Parse(dto.AtendimentoId), pacienteId, Guid.Parse(dto.CriadoPorId),
                    dto.Tipo, dto.Valor, DateTime.Parse(dto.DataLancamento),
                    dto.Status == 2 ? DateTime.Parse(dto.DataLancamento) : (DateTime?)null,
                    dto.Descricao, dto.Categoria, dto.TipoResponsavel, dto.Status);
            }
            _logger.LogInformation("Lançamentos Financeiros inseridos: {Count}", lancamentos.Count);
        }
    }

    #region DTOs para deserialização do JSON

    public class SeedDataModel
    {
        public List<UsuarioSeedDto> Usuarios { get; set; } = new();
        public List<PacienteSeedDto> Pacientes { get; set; } = new();
        public List<ModeloProcedimentoSeedDto> ModelosProcedimento { get; set; } = new();
        public List<EtapaModeloProcedimentoSeedDto> EtapasModeloProcedimento { get; set; } = new();
        public List<AtendimentoSeedDto> Atendimentos { get; set; } = new();
        public List<EtapaAtendimentoSeedDto> EtapasAtendimento { get; set; } = new();
        public List<LancamentoFinanceiroSeedDto> LancamentosFinanceiros { get; set; } = new();
    }

    public class UsuarioSeedDto
    {
        public string Id { get; set; } = "";
        public string Nome { get; set; } = "";
        public string Email { get; set; } = "";
        public string SenhaHash { get; set; } = "";
        public string PerfilId { get; set; } = "";
        public string? Especialidade { get; set; }
    }

    public class PacienteSeedDto
    {
        public string Id { get; set; } = "";
        public string Nome { get; set; } = "";
        public string Cpf { get; set; } = "";
        public string Telefone { get; set; } = "";
        public string Email { get; set; } = "";
        public string DataNascimento { get; set; } = "";
        public string? ConvenioId { get; set; }
        public string? ConvenioNome { get; set; }
        public string? Cep { get; set; }
        public string? Logradouro { get; set; }
        public string? Numero { get; set; }
        public string? Complemento { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
    }

    public class ModeloProcedimentoSeedDto
    {
        public string Id { get; set; } = "";
        public string Nome { get; set; } = "";
        public decimal CustoBase { get; set; }
        public string DuracaoEstimada { get; set; } = "";
        public string Descricao { get; set; } = "";
        public string Categoria { get; set; } = "";
    }

    public class EtapaModeloProcedimentoSeedDto
    {
        public string Id { get; set; } = "";
        public string ModeloProcedimentoId { get; set; } = "";
        public string Nome { get; set; } = "";
        public int OrdemExibicao { get; set; }
        public string Descricao { get; set; } = "";
        public string ItensChecklistJson { get; set; } = "";
    }

    public class AtendimentoSeedDto
    {
        public string Id { get; set; } = "";
        public string PacienteId { get; set; } = "";
        public string ModeloProcedimentoId { get; set; } = "";
        public string DentistaId { get; set; } = "";
        public string DataInicio { get; set; } = "";
        public int Status { get; set; }
        public decimal CustoTotal { get; set; }
        public string? Observacoes { get; set; }
    }

    public class EtapaAtendimentoSeedDto
    {
        public string Id { get; set; } = "";
        public string AtendimentoId { get; set; } = "";
        public string Nome { get; set; } = "";
        public int Status { get; set; }
        public int OrdemExibicao { get; set; }
        public string? DataAgendada { get; set; }
        public string? DataConclusao { get; set; }
        public string? Observacoes { get; set; }
    }

    public class LancamentoFinanceiroSeedDto
    {
        public string Id { get; set; } = "";
        public string AtendimentoId { get; set; } = "";
        public string? PacienteId { get; set; }
        public string CriadoPorId { get; set; } = "";
        public int Tipo { get; set; }
        public decimal Valor { get; set; }
        public string DataLancamento { get; set; } = "";
        public string Descricao { get; set; } = "";
        public string Categoria { get; set; } = "";
        public int TipoResponsavel { get; set; }
        public int Status { get; set; }
    }

    #endregion
}
