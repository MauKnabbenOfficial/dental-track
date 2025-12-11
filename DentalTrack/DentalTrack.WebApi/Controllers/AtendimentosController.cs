using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AtendimentosController : ControllerBase
    {
        private readonly IAtendimentoService _atendimentoService;
        private readonly IEtapaAtendimentoService _etapaService;

        public AtendimentosController(
            IAtendimentoService atendimentoService,
            IEtapaAtendimentoService etapaService)
        {
            _atendimentoService = atendimentoService;
            _etapaService = etapaService;
        }

        #region Atendimentos

        /// <summary>
        /// Obtém todos os atendimentos
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<AtendimentoDto>>> ObterTodos()
        {
            var atendimentos = await _atendimentoService.ObterTodosAsync();
            return Ok(atendimentos);
        }

        /// <summary>
        /// Obtém um atendimento por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AtendimentoDto>> ObterPorId(Guid id)
        {
            var atendimento = await _atendimentoService.ObterPorIdAsync(id);

            if (atendimento == null)
            {
                return NotFound();
            }

            return Ok(atendimento);
        }

        /// <summary>
        /// Busca atendimentos com filtros
        /// </summary>
        [HttpGet("buscar")]
        public async Task<ActionResult<ResultadoPaginado<AtendimentoDto>>> Buscar([FromQuery] AtendimentoFiltroDto filtro)
        {
            var resultado = await _atendimentoService.BuscarAsync(filtro);
            return Ok(resultado);
        }

        /// <summary>
        /// Obtém atendimentos de um paciente
        /// </summary>
        [HttpGet("paciente/{pacienteId:guid}")]
        public async Task<ActionResult<List<AtendimentoDto>>> ObterPorPaciente(Guid pacienteId)
        {
            var atendimentos = await _atendimentoService.ObterPorPacienteAsync(pacienteId);
            return Ok(atendimentos);
        }

        /// <summary>
        /// Obtém atendimentos de um dentista
        /// </summary>
        [HttpGet("dentista/{dentistaId:guid}")]
        public async Task<ActionResult<List<AtendimentoDto>>> ObterPorDentista(Guid dentistaId)
        {
            var atendimentos = await _atendimentoService.ObterPorDentistaAsync(dentistaId);
            return Ok(atendimentos);
        }

        /// <summary>
        /// Obtém atendimentos por status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<AtendimentoDto>>> ObterPorStatus(string status)
        {
            var atendimentos = await _atendimentoService.ObterPorStatusAsync(status);
            return Ok(atendimentos);
        }

        /// <summary>
        /// Cria um novo atendimento
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AtendimentoDto>> Criar([FromBody] AtendimentoCreateDto dto)
        {
            var atendimento = await _atendimentoService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = atendimento.Id }, atendimento);
        }

        /// <summary>
        /// Cria um novo atendimento com etapas
        /// </summary>
        [HttpPost("com-etapas")]
        public async Task<ActionResult<AtendimentoDto>> CriarComEtapas([FromBody] AtendimentoComEtapasCreateDto dto)
        {
            var (atendimento, etapas) = await _atendimentoService.CriarComEtapasAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = atendimento.Id }, atendimento);
        }

        /// <summary>
        /// Atualiza um atendimento existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<AtendimentoDto>> Atualizar(Guid id, [FromBody] AtendimentoUpdateDto dto)
        {
            var atendimento = await _atendimentoService.AtualizarAsync(id, dto);

            if (atendimento == null)
            {
                return NotFound();
            }

            return Ok(atendimento);
        }

        /// <summary>
        /// Altera o status de um atendimento
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        public async Task<ActionResult> AlterarStatus(Guid id, [FromBody] string status)
        {
            var sucesso = await _atendimentoService.AlterarStatusAsync(id, status);

            if (!sucesso)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Exclui um atendimento
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _atendimentoService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        #endregion

        #region Etapas do Atendimento

        /// <summary>
        /// Obtém todas as etapas de um atendimento
        /// </summary>
        [HttpGet("{atendimentoId:guid}/etapas")]
        public async Task<ActionResult<List<EtapaAtendimentoDto>>> ObterEtapas(Guid atendimentoId)
        {
            var etapas = await _etapaService.ObterPorAtendimentoIdAsync(atendimentoId);
            return Ok(etapas);
        }

        /// <summary>
        /// Obtém uma etapa específica
        /// </summary>
        [HttpGet("{atendimentoId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult<EtapaAtendimentoDto>> ObterEtapa(Guid atendimentoId, Guid etapaId)
        {
            var etapa = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapa == null || etapa.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            return Ok(etapa);
        }

        /// <summary>
        /// Adiciona uma etapa ao atendimento
        /// </summary>
        [HttpPost("{atendimentoId:guid}/etapas")]
        public async Task<ActionResult<EtapaAtendimentoDto>> AdicionarEtapa(Guid atendimentoId, [FromBody] EtapaAtendimentoCreateDto dto)
        {
            var etapa = await _etapaService.CriarAsync(atendimentoId, dto);
            return CreatedAtAction(nameof(ObterEtapa), new { atendimentoId, etapaId = etapa.Id }, etapa);
        }

        /// <summary>
        /// Atualiza uma etapa do atendimento
        /// </summary>
        [HttpPut("{atendimentoId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult<EtapaAtendimentoDto>> AtualizarEtapa(Guid atendimentoId, Guid etapaId, [FromBody] EtapaAtendimentoUpdateDto dto)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.AtualizarAsync(etapaId, dto);
            return Ok(etapa);
        }

        /// <summary>
        /// Atualiza o status de uma etapa
        /// </summary>
        [HttpPatch("{atendimentoId:guid}/etapas/{etapaId:guid}/status")]
        public async Task<ActionResult<EtapaAtendimentoDto>> AtualizarStatusEtapa(Guid atendimentoId, Guid etapaId, [FromBody] AtualizarStatusEtapaDto dto)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.AtualizarStatusAsync(etapaId, dto);
            return Ok(etapa);
        }

        /// <summary>
        /// Atualiza o checklist de uma etapa
        /// </summary>
        [HttpPatch("{atendimentoId:guid}/etapas/{etapaId:guid}/checklist")]
        public async Task<ActionResult<EtapaAtendimentoDto>> AtualizarChecklistEtapa(Guid atendimentoId, Guid etapaId, [FromBody] AtualizarChecklistDto dto)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.AtualizarChecklistAsync(etapaId, dto);
            return Ok(etapa);
        }

        /// <summary>
        /// Adiciona um anexo a uma etapa
        /// </summary>
        [HttpPost("{atendimentoId:guid}/etapas/{etapaId:guid}/anexos")]
        public async Task<ActionResult<EtapaAtendimentoDto>> AdicionarAnexo(Guid atendimentoId, Guid etapaId, [FromBody] string anexo)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.AdicionarAnexoAsync(etapaId, anexo);
            return Ok(etapa);
        }

        /// <summary>
        /// Remove um anexo de uma etapa
        /// </summary>
        [HttpDelete("{atendimentoId:guid}/etapas/{etapaId:guid}/anexos")]
        public async Task<ActionResult<EtapaAtendimentoDto>> RemoverAnexo(Guid atendimentoId, Guid etapaId, [FromQuery] string anexo)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            var etapa = await _etapaService.RemoverAnexoAsync(etapaId, anexo);
            return Ok(etapa);
        }

        /// <summary>
        /// Remove uma etapa do atendimento
        /// </summary>
        [HttpDelete("{atendimentoId:guid}/etapas/{etapaId:guid}")]
        public async Task<ActionResult> RemoverEtapa(Guid atendimentoId, Guid etapaId)
        {
            var etapaExistente = await _etapaService.ObterPorIdAsync(etapaId);

            if (etapaExistente == null || etapaExistente.AtendimentoId != atendimentoId)
            {
                return NotFound();
            }

            await _etapaService.ExcluirAsync(etapaId);
            return NoContent();
        }

        #endregion
    }
}
