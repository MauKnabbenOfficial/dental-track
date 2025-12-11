using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ModelosEtapasController : ControllerBase
    {
        private readonly IModeloEtapaService _modeloEtapaService;

        public ModelosEtapasController(IModeloEtapaService modeloEtapaService)
        {
            _modeloEtapaService = modeloEtapaService;
        }

        /// <summary>
        /// Obtém todos os modelos de etapas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ModeloEtapaDto>>> ObterTodos()
        {
            var modelos = await _modeloEtapaService.ObterTodosAsync();
            return Ok(modelos);
        }

        /// <summary>
        /// Obtém um modelo de etapa por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ModeloEtapaDto>> ObterPorId(Guid id)
        {
            var modelo = await _modeloEtapaService.ObterPorIdAsync(id);

            if (modelo == null)
            {
                return NotFound();
            }

            return Ok(modelo);
        }

        /// <summary>
        /// Busca modelos de etapas por nome
        /// </summary>
        [HttpGet("buscar")]
        public async Task<ActionResult<List<ModeloEtapaDto>>> BuscarPorNome([FromQuery] string nome)
        {
            var modelos = await _modeloEtapaService.BuscarPorNomeAsync(nome);
            return Ok(modelos);
        }

        /// <summary>
        /// Cria um novo modelo de etapa
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ModeloEtapaDto>> Criar([FromBody] ModeloEtapaCreateDto dto)
        {
            var modelo = await _modeloEtapaService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = modelo.Id }, modelo);
        }

        /// <summary>
        /// Atualiza um modelo de etapa existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ModeloEtapaDto>> Atualizar(Guid id, [FromBody] ModeloEtapaUpdateDto dto)
        {
            var modelo = await _modeloEtapaService.AtualizarAsync(id, dto);

            if (modelo == null)
            {
                return NotFound();
            }

            return Ok(modelo);
        }

        /// <summary>
        /// Exclui um modelo de etapa
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _modeloEtapaService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Ativa um modelo de etapa
        /// </summary>
        [HttpPatch("{id:guid}/ativar")]
        public async Task<ActionResult> Ativar(Guid id)
        {
            var ativado = await _modeloEtapaService.AtivarAsync(id);

            if (!ativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Desativa um modelo de etapa
        /// </summary>
        [HttpPatch("{id:guid}/desativar")]
        public async Task<ActionResult> Desativar(Guid id)
        {
            var desativado = await _modeloEtapaService.DesativarAsync(id);

            if (!desativado)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
