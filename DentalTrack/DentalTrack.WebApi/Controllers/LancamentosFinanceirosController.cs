using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LancamentosFinanceirosController : ControllerBase
    {
        private readonly ILancamentoFinanceiroService _lancamentoService;

        public LancamentosFinanceirosController(ILancamentoFinanceiroService lancamentoService)
        {
            _lancamentoService = lancamentoService;
        }

        /// <summary>
        /// Obtém todos os lançamentos financeiros
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<LancamentoFinanceiroDto>>> ObterTodos()
        {
            var lancamentos = await _lancamentoService.ObterTodosAsync();
            return Ok(lancamentos);
        }

        /// <summary>
        /// Obtém um lançamento financeiro por ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LancamentoFinanceiroDto>> ObterPorId(Guid id)
        {
            var lancamento = await _lancamentoService.ObterPorIdAsync(id);

            if (lancamento == null)
            {
                return NotFound();
            }

            return Ok(lancamento);
        }

        /// <summary>
        /// Busca lançamentos com filtros
        /// </summary>
        [HttpGet("buscar")]
        public async Task<ActionResult<ResultadoPaginado<LancamentoFinanceiroDto>>> Buscar([FromQuery] LancamentoFiltroDto filtro)
        {
            var resultado = await _lancamentoService.BuscarAsync(filtro);
            return Ok(resultado);
        }

        /// <summary>
        /// Obtém lançamentos de um atendimento
        /// </summary>
        [HttpGet("atendimento/{atendimentoId:guid}")]
        public async Task<ActionResult<List<LancamentoFinanceiroDto>>> ObterPorAtendimento(Guid atendimentoId)
        {
            var lancamentos = await _lancamentoService.ObterPorAtendimentoAsync(atendimentoId);
            return Ok(lancamentos);
        }

        /// <summary>
        /// Obtém lançamentos de um paciente
        /// </summary>
        [HttpGet("paciente/{pacienteId:guid}")]
        public async Task<ActionResult<List<LancamentoFinanceiroDto>>> ObterPorPaciente(Guid pacienteId)
        {
            var lancamentos = await _lancamentoService.ObterPorPacienteAsync(pacienteId);
            return Ok(lancamentos);
        }

        /// <summary>
        /// Obtém lançamentos por tipo (Receita/Despesa)
        /// </summary>
        [HttpGet("tipo/{tipo}")]
        public async Task<ActionResult<List<LancamentoFinanceiroDto>>> ObterPorTipo(string tipo)
        {
            var lancamentos = await _lancamentoService.ObterPorTipoAsync(tipo);
            return Ok(lancamentos);
        }

        /// <summary>
        /// Obtém lançamentos por status
        /// </summary>
        [HttpGet("status/{status}")]
        public async Task<ActionResult<List<LancamentoFinanceiroDto>>> ObterPorStatus(string status)
        {
            var lancamentos = await _lancamentoService.ObterPorStatusAsync(status);
            return Ok(lancamentos);
        }

        /// <summary>
        /// Obtém resumo financeiro por período
        /// </summary>
        [HttpGet("resumo")]
        public async Task<ActionResult<ResumoFinanceiroDto>> ObterResumo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            var resumo = await _lancamentoService.ObterResumoPorPeriodoAsync(dataInicio, dataFim);
            return Ok(resumo);
        }

        /// <summary>
        /// Cria um novo lançamento financeiro
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<LancamentoFinanceiroDto>> Criar([FromBody] LancamentoFinanceiroCreateDto dto)
        {
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(usuarioIdClaim) || !Guid.TryParse(usuarioIdClaim, out var usuarioId))
            {
                return Unauthorized();
            }

            var lancamento = await _lancamentoService.CriarAsync(dto, usuarioId);
            return CreatedAtAction(nameof(ObterPorId), new { id = lancamento.Id }, lancamento);
        }

        /// <summary>
        /// Atualiza um lançamento financeiro existente
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<LancamentoFinanceiroDto>> Atualizar(Guid id, [FromBody] LancamentoFinanceiroUpdateDto dto)
        {
            var lancamento = await _lancamentoService.AtualizarAsync(id, dto);

            if (lancamento == null)
            {
                return NotFound();
            }

            return Ok(lancamento);
        }

        /// <summary>
        /// Atualiza o status de pagamento de um lançamento
        /// </summary>
        [HttpPatch("{id:guid}/status-pagamento")]
        public async Task<ActionResult<LancamentoFinanceiroDto>> AtualizarStatusPagamento(Guid id, [FromBody] AtualizarStatusPagamentoDto dto)
        {
            var lancamento = await _lancamentoService.AtualizarStatusPagamentoAsync(id, dto);

            if (lancamento == null)
            {
                return NotFound();
            }

            return Ok(lancamento);
        }

        /// <summary>
        /// Exclui um lançamento financeiro
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Excluir(Guid id)
        {
            var excluido = await _lancamentoService.ExcluirAsync(id);

            if (!excluido)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
