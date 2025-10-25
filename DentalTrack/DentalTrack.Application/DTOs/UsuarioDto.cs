using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Application.DTOs
{
    public class UsuarioDto
    {
        
    }

    public class UsuarioCreateDto
    {
        // Propriedades que a TELA DE CADASTRO precisa enviar
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; } // Senha em texto plano, será hasheada depois
        public string ConfirmarSenha { get; set; }

        // Adicione validações se usar FluentValidation ou DataAnnotations
    }
}
