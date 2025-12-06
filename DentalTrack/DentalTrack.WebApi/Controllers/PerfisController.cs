using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PerfisController : ControllerBase
    {
        private readonly IPerfilService _perfilService;

        public PerfisController(IPerfilService perfilService)
        {
            _perfilService = perfilService;
        }

        /// <summary>
        /// Obtém todos os perfis
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<PerfilDto>>> ObterTodos()
        {
            var perfis = await _perfilService.ObterTodosAsync();
            return Ok(perfis);
        }

        /// <summary>
        /// Obtém um perfil por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PerfilDto>> ObterPorId(Guid id)
        {
            var perfil = await _perfilService.ObterPorIdAsync(id);

            if (perfil == null)
            {
                return NotFound();
            }

            return Ok(perfil);
        }

        /// <summary>
        /// Cria um novo perfil
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PerfilDto>> Criar([FromBody] PerfilCreateDto dto)
        {
            var perfil = await _perfilService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = perfil.Id }, perfil);
        }

        /// <summary>
        /// Atualiza um perfil existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PerfilDto>> Atualizar(Guid id, [FromBody] PerfilUpdateDto dto)
        {
            var perfil = await _perfilService.AtualizarAsync(id, dto);

            if (perfil == null)
            {
                return NotFound();
            }

            return Ok(perfil);
        }

        /// <summary>
        /// Exclui um perfil
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _perfilService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Ativa um perfil
        /// </summary>
        [HttpPatch("{id:guid}/ativar")]
        public async Task<ActionResult> Ativar(Guid id)
        {
            var ativado = await _perfilService.AtivarAsync(id);

            if (!ativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Desativa um perfil
        /// </summary>
        [HttpPatch("{id:guid}/desativar")]
        public async Task<ActionResult> Desativar(Guid id)
        {
            var desativado = await _perfilService.DesativarAsync(id);

            if (!desativado)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
