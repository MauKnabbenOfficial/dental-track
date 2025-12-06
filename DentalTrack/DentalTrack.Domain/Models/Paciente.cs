namespace DentalTrack.Domain.Models
{
    /// <summary>
    /// Paciente da clínica odontológica
    /// </summary>
    public class Paciente
    {
        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public string Cpf { get; private set; }
        public string Telefone { get; private set; }
        public string Email { get; private set; }
        public DateTime DataNascimento { get; private set; }

        // Convênio
        public string? ConvenioId { get; private set; }
        public string? ConvenioNome { get; private set; }

        // Endereço
        public string? Cep { get; private set; }
        public string? Logradouro { get; private set; }
        public string? Numero { get; private set; }
        public string? Complemento { get; private set; }
        public string? Bairro { get; private set; }
        public string? Cidade { get; private set; }
        public string? Estado { get; private set; }

        public DateTime DtCadastro { get; private set; }
        public bool Ativo { get; private set; }

        // Navegação
        public ICollection<Atendimento> Atendimentos { get; private set; } = new List<Atendimento>();
        public ICollection<LancamentoFinanceiro> LancamentosFinanceiros { get; private set; } = new List<LancamentoFinanceiro>();

        // Construtor para criação
        public Paciente(
            string nome,
            string cpf,
            string telefone,
            string email,
            DateTime dataNascimento)
        {
            Id = Guid.NewGuid();
            Nome = nome;
            Cpf = cpf;
            Telefone = telefone;
            Email = email;
            DataNascimento = dataNascimento;
            DtCadastro = DateTime.UtcNow;
            Ativo = true;
        }

        // Construtor para EF
        private Paciente() { }

        // Métodos de negócio
        public void Atualizar(
            string nome,
            string telefone,
            string email,
            DateTime dataNascimento)
        {
            Nome = nome;
            Telefone = telefone;
            Email = email;
            DataNascimento = dataNascimento;
        }

        public void AtualizarConvenio(string? convenioId, string? convenioNome)
        {
            ConvenioId = convenioId;
            ConvenioNome = convenioNome;
        }

        public void AtualizarEndereco(
            string? cep,
            string? logradouro,
            string? numero,
            string? complemento,
            string? bairro,
            string? cidade,
            string? estado)
        {
            Cep = cep;
            Logradouro = logradouro;
            Numero = numero;
            Complemento = complemento;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
        }

        public void Ativar() => Ativo = true;
        public void Desativar() => Ativo = false;
    }
}
