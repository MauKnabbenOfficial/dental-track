using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DentalTrack.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        private Guid? ObterUsuarioIdAtual()
        {
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuarioIdClaim) || !Guid.TryParse(usuarioIdClaim, out var usuarioId))
            {
                return null;
            }
            return usuarioId;
        }

        /// <summary>
        /// Realiza login do usuário
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto dto)
        {
            var resultado = await _authService.LoginAsync(dto);

            if (!resultado.Sucesso)
            {
                return Unauthorized(resultado);
            }

            return Ok(resultado);
        }

        /// <summary>
        /// Realiza logout do usuário
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            var usuarioId = ObterUsuarioIdAtual();
            if (usuarioId == null) return Unauthorized();

            await _authService.LogoutAsync(usuarioId.Value);
            return NoContent();
        }

        /// <summary>
        /// Obtém dados do usuário autenticado
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UsuarioDto>> ObterUsuarioAtual()
        {
            var usuarioId = ObterUsuarioIdAtual();
            if (usuarioId == null) return Unauthorized();

            var usuario = await _authService.ObterUsuarioAtualAsync(usuarioId.Value);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        /// <summary>
        /// Renova o token de acesso
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var resultado = await _authService.RefreshTokenAsync(dto);

            if (!resultado.Sucesso)
            {
                return Unauthorized(resultado);
            }

            return Ok(resultado);
        }

        /// <summary>
        /// Altera a senha do usuário autenticado
        /// </summary>
        [HttpPost("alterar-senha")]
        [Authorize]
        public async Task<ActionResult> AlterarSenha([FromBody] AlterarSenhaDto dto)
        {
            var usuarioId = ObterUsuarioIdAtual();
            if (usuarioId == null) return Unauthorized();

            var sucesso = await _authService.AlterarSenhaAsync(usuarioId.Value, dto);

            if (!sucesso)
            {
                return BadRequest(new { Mensagem = "Não foi possível alterar a senha" });
            }

            return NoContent();
        }
    }
}
