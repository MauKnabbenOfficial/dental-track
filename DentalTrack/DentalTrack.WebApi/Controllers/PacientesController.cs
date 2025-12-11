using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PacientesController : ControllerBase
    {
        private readonly IPacienteService _pacienteService;

        public PacientesController(IPacienteService pacienteService)
        {
            _pacienteService = pacienteService;
        }

        /// <summary>
        /// Obtém todos os pacientes
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<PacienteDto>>> ObterTodos()
        {
            var pacientes = await _pacienteService.ObterTodosAsync();
            return Ok(pacientes);
        }

        /// <summary>
        /// Obtém um paciente por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PacienteDto>> ObterPorId(Guid id)
        {
            var paciente = await _pacienteService.ObterPorIdAsync(id);

            if (paciente == null)
            {
                return NotFound();
            }

            return Ok(paciente);
        }

        /// <summary>
        /// Obtém um paciente por CPF
        /// </summary>
        [HttpGet("cpf/{cpf}")]
        public async Task<ActionResult<PacienteDto>> ObterPorCpf(string cpf)
        {
            var paciente = await _pacienteService.ObterPorCpfAsync(cpf);

            if (paciente == null)
            {
                return NotFound();
            }

            return Ok(paciente);
        }

        /// <summary>
        /// Busca pacientes com filtros
        /// </summary>
        [HttpGet("buscar")]
        public async Task<ActionResult<ResultadoPaginado<PacienteDto>>> Buscar([FromQuery] PacienteFiltroDto filtro)
        {
            var resultado = await _pacienteService.BuscarAsync(filtro);
            return Ok(resultado);
        }

        /// <summary>
        /// Obtém pacientes por convênio
        /// </summary>
        [HttpGet("convenio/{convenioNome}")]
        public async Task<ActionResult<List<PacienteDto>>> ObterPorConvenio(string convenioNome)
        {
            var pacientes = await _pacienteService.ObterPorConvenioAsync(convenioNome);
            return Ok(pacientes);
        }

        /// <summary>
        /// Cria um novo paciente
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PacienteDto>> Criar([FromBody] PacienteCreateDto dto)
        {
            var paciente = await _pacienteService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = paciente.Id }, paciente);
        }

        /// <summary>
        /// Atualiza um paciente existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PacienteDto>> Atualizar(Guid id, [FromBody] PacienteUpdateDto dto)
        {
            var paciente = await _pacienteService.AtualizarAsync(id, dto);

            if (paciente == null)
            {
                return NotFound();
            }

            return Ok(paciente);
        }

        /// <summary>
        /// Exclui um paciente
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _pacienteService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Ativa um paciente
        /// </summary>
        [HttpPatch("{id:guid}/ativar")]
        public async Task<ActionResult> Ativar(Guid id)
        {
            var ativado = await _pacienteService.AtivarAsync(id);

            if (!ativado)
            {
                return NotFound();
            }

            return NoContent();
        }

        /// <summary>
        /// Desativa um paciente
        /// </summary>
        [HttpPatch("{id:guid}/desativar")]
        public async Task<ActionResult> Desativar(Guid id)
        {
            var desativado = await _pacienteService.DesativarAsync(id);

            if (!desativado)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
