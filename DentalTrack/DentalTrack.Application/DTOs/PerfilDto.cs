namespace DentalTrack.Application.DTOs
{
    // DTO de resposta (leitura)
    public class PerfilDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public DateTime DtCadastro { get; set; }
    }

    // DTO para criação
    public class PerfilCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
    }

    // DTO para atualização
    public class PerfilUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
    }
}
