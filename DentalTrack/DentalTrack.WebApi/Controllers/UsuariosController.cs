using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Obtém todos os usuários
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<UsuarioDto>>> ObterTodos()
        {
            var usuarios = await _usuarioService.ObterTodosAsync();
            return Ok(usuarios);
        }

        /// <summary>
        /// Obtém um usuário por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UsuarioDto>> ObterPorId(Guid id)
        {
            var usuario = await _usuarioService.ObterPorIdAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        /// <summary>
        /// Obtém usuários por perfil
        /// </summary>
        [HttpGet("perfil/{perfilId:guid}")]
        public async Task<ActionResult<List<UsuarioDto>>> ObterPorPerfil(Guid perfilId)
        {
            var usuarios = await _usuarioService.ObterPorPerfilAsync(perfilId);
            return Ok(usuarios);
        }

        /// <summary>
        /// Obtém todos os dentistas
        /// </summary>
        [HttpGet("dentistas")]
        public async Task<ActionResult<List<UsuarioDto>>> ObterDentistas()
        {
            var dentistas = await _usuarioService.ObterDentistasAsync();
            return Ok(dentistas);
        }

        /// <summary>
        /// Cria um novo usuário
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> Criar([FromBody] UsuarioCreateDto dto)
        {
            var usuario = await _usuarioService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = usuario.Id }, usuario);
        }

        /// <summary>
        /// Atualiza um usuário existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<UsuarioDto>> Atualizar(Guid id, [FromBody] UsuarioUpdateDto dto)
        {
            var usuario = await _usuarioService.AtualizarAsync(id, dto);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        /// <summary>
        /// Exclui um usuário
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _usuarioService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Ativa um usuário
        /// </summary>
        [HttpPatch("{id:guid}/ativar")]
        public async Task<ActionResult> Ativar(Guid id)
        {
            var ativado = await _usuarioService.AtivarAsync(id);

            if (!ativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Desativa um usuário
        /// </summary>
        [HttpPatch("{id:guid}/desativar")]
        public async Task<ActionResult> Desativar(Guid id)
        {
            var desativado = await _usuarioService.DesativarAsync(id);

            if (!desativado)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
