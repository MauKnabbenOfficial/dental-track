using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ModelosProcedimentosController : ControllerBase
    {
        private readonly IModeloProcedimentoService _modeloProcedimentoService;
        private readonly IEtapaModeloProcedimentoService _etapaService;

        public ModelosProcedimentosController(
            IModeloProcedimentoService modeloProcedimentoService,
            IEtapaModeloProcedimentoService etapaService)
        {
            _modeloProcedimentoService = modeloProcedimentoService;
            _etapaService = etapaService;
        }

        #region Modelos de Procedimento

        /// <summary>
        /// Obtém todos os modelos de procedimentos
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ModeloProcedimentoDto>>> ObterTodos()
        {
            var modelos = await _modeloProcedimentoService.ObterTodosAsync();
            return Ok(modelos);
        }

        /// <summary>
        /// Obtém um modelo de procedimento por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ModeloProcedimentoDto>> ObterPorId(Guid id)
        {
            var modelo = await _modeloProcedimentoService.ObterPorIdAsync(id);

            if (modelo == null)
            {
                return NotFound();
            }

            return Ok(modelo);
        }

        /// <summary>
        /// Obtém modelos de procedimento por categoria
        /// </summary>
        [HttpGet("categoria/{categoria}")]
        public async Task<ActionResult<List<ModeloProcedimentoDto>>> ObterPorCategoria(string categoria)
        {
            var modelos = await _modeloProcedimentoService.ObterPorCategoriaAsync(categoria);
            return Ok(modelos);
        }

        /// <summary>
        /// Obtém todas as categorias disponíveis
        /// </summary>
        [HttpGet("categorias")]
        public async Task<ActionResult<List<string>>> ObterCategorias()
        {
            var categorias = await _modeloProcedimentoService.ObterCategoriasAsync();
            return Ok(categorias);
        }

        /// <summary>
        /// Cria um novo modelo de procedimento
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ModeloProcedimentoDto>> Criar([FromBody] ModeloProcedimentoCreateDto dto)
        {
            var modelo = await _modeloProcedimentoService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = modelo.Id }, modelo);
        }

        /// <summary>
        /// Atualiza um modelo de procedimento existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ModeloProcedimentoDto>> Atualizar(Guid id, [FromBody] ModeloProcedimentoUpdateDto dto)
        {
            var modelo = await _modeloProcedimentoService.AtualizarAsync(id, dto);

            if (modelo == null)
            {
                return NotFound();
            }

            return Ok(modelo);
        }

        /// <summary>
        /// Exclui um modelo de procedimento
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _modeloProcedimentoService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Ativa um modelo de procedimento
        /// </summary>
        [HttpPatch("{id:guid}/ativar")]
        public async Task<ActionResult> Ativar(Guid id)
        {
            var ativado = await _modeloProcedimentoService.AtivarAsync(id);

            if (!ativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Desativa um modelo de procedimento
        /// </summary>
        [HttpPatch("{id:guid}/desativar")]
        public async Task<ActionResult> Desativar(Guid id)
        {
            var desativado = await _modeloProcedimentoService.DesativarAsync(id);

            if (!desativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        #endregion

        #region Etapas do Modelo de Procedimento

        /// <summary>
        /// Obtém todas as etapas de um modelo de procedimento
        /// </summary>
        [HttpGet("{modeloId:guid}/etapas")]
        public async Task<ActionResult<List<EtapaModeloProcedimentoDto>>> ObterEtapas(Guid modeloId)
        {
            var etapas = await _etapaService.ObterPorModeloIdAsync(modeloId);
            return Ok(etapas);
        }

        /// <summary>
        /// Obtém uma etapa específica
        /// </summary>
        [HttpGet("{modeloId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult<EtapaModeloProcedimentoDto>> ObterEtapa(Guid modeloId, Guid etapaId)
        {
            var etapa = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapa == null || etapa.ModeloProcedimentoId != modeloId)
            {
                return NotFound();
            }

            return Ok(etapa);
        }

        /// <summary>
        /// Adiciona uma etapa ao modelo de procedimento
        /// </summary>
        [HttpPost("{modeloId:guid}/etapas")]
        public async Task<ActionResult<EtapaModeloProcedimentoDto>> AdicionarEtapa(Guid modeloId, [FromBody] EtapaModeloProcedimentoCreateDto dto)
        {
            dto.ModeloProcedimentoId = modeloId;
            var etapa = await _etapaService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterEtapa), new { modeloId, etapaId = etapa.Id }, etapa);
        }

        /// <summary>
        /// Atualiza uma etapa do modelo de procedimento
        /// </summary>
        [HttpPut("{modeloId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult<EtapaModeloProcedimentoDto>> AtualizarEtapa(Guid modeloId, Guid etapaId, [FromBody] EtapaModeloProcedimentoUpdateDto dto)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.ModeloProcedimentoId != modeloId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.AtualizarAsync(etapaId, dto);
            return Ok(etapa);
        }

        /// <summary>
        /// Remove uma etapa do modelo de procedimento
        /// </summary>
        [HttpDelete("{modeloId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult> RemoverEtapa(Guid modeloId, Guid etapaId)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.ModeloProcedimentoId != modeloId)
            {
                return NotFound();
            }

            await _etapaService.ExcluirAsync(etapaId);
            return NoContent();
        }

        /// <summary>
        /// Reordena as etapas de um modelo de procedimento
        /// </summary>
        [HttpPatch("{modeloId:guid}/etapas/reordenar")]
        public async Task<ActionResult> ReordenarEtapas(Guid modeloId, [FromBody] ReordenarEtapasDto dto)
        {
            var sucesso = await _etapaService.ReordenarAsync(modeloId, dto.IdsEtapas);

            if (!sucesso)
            {
                return BadRequest(new { Mensagem = "Não foi possível reordenar as etapas" });
            }

            return NoContent();
        }

        #endregion
    }
}
