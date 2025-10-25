using DentalTrack.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Application.Interfaces
{
    public interface IUsuarioService
    {
        public Task<bool> CadastrarUsuarioAsync(UsuarioCreateDto dto);
    }
}
