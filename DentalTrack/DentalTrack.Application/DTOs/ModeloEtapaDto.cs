namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class ModeloEtapaDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int DuracaoPadraoMinutos { get; set; }
        public List<string> ItensChecklist { get; set; } = new();
        public bool Ativo { get; set; }
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação
    public class ModeloEtapaCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int DuracaoPadraoMinutos { get; set; }
        public List<string> ItensChecklist { get; set; } = new();
    }

    // DTO para atualização
    public class ModeloEtapaUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public int DuracaoPadraoMinutos { get; set; }
        public List<string> ItensChecklist { get; set; } = new();
    }
}
