namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class ModeloProcedimentoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal CustoBase { get; set; }
        public string DuracaoEstimada { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public DateTime DtCadastro { get; set; }
        public List<EtapaModeloProcedimentoDto> Etapas { get; set; } = new();
    }

    // DTO para criação
    public class ModeloProcedimentoCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public decimal CustoBase { get; set; }
        public string DuracaoEstimada { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
    }

    // DTO para atualização
    public class ModeloProcedimentoUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public decimal CustoBase { get; set; }
        public string DuracaoEstimada { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
    }

    // DTO de resposta para Etapa do Modelo
    public class EtapaModeloProcedimentoDto
    {
        public Guid Id { get; set; }
        public Guid ModeloProcedimentoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public List<string> ItensChecklist { get; set; } = new();
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação de Etapa do Modelo
    public class EtapaModeloProcedimentoCreateDto
    {
        public Guid ModeloProcedimentoId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public List<string> ItensChecklist { get; set; } = new();
    }

    // DTO para atualização de Etapa do Modelo
    public class EtapaModeloProcedimentoUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int OrdemExibicao { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public List<string> ItensChecklist { get; set; } = new();
    }

    // DTO para reordenação de etapas
    public class ReordenarEtapasDto
    {
        public List<Guid> IdsEtapas { get; set; } = new();
    }
}
