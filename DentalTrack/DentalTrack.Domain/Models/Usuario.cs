using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Domain.Models
{
    public class Usuario
    {
        public Guid Id { get; private set; } // O ID é gerado, não definido externamente
        public string Nome { get; private set; }
        public string Email { get; private set; }
        public string SenhaHash { get; private set; } // NUNCA guarde a senha em texto plano
        public bool EmailConfirmado { get; private set; }
        public DateTime DtCadastro { get; private set; }
        // Adicione outras propriedades essenciais (Role, Ativo, etc.)
        // Adicione construtores e métodos para regras de negócio (ex: ConfirmarEmail, AlterarSenha)

        // Construtor para criação (exemplo básico)
        public Usuario(string nome, string email, string senhaHash)
        {
            Id = Guid.NewGuid();
            Nome = nome; // Adicionar validação aqui ou em um método
            Email = email; // Adicionar validação
            SenhaHash = senhaHash; // O hash já deve vir pronto
            EmailConfirmado = false;
            DtCadastro = DateTime.UtcNow;
        }

        // Construtor vazio para ORM (Entity Framework)
        private Usuario() { }

        // Métodos de negócio (exemplo)
        public void ConfirmarEmail() { EmailConfirmado = true; }
    }
}
