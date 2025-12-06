using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DentalTrack.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
        {
            var usuario = await _usuarioRepository.ObterPorEmailAsync(dto.Email);

            if (usuario == null || !usuario.Ativo)
            {
                return new LoginResponseDto
                {
                    Sucesso = false,
                    Mensagem = "Usuário não encontrado ou inativo"
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
            {
                return new LoginResponseDto
                {
                    Sucesso = false,
                    Mensagem = "Senha incorreta"
                };
            }

            var token = GerarToken(usuario.Id, usuario.Email, usuario.Perfil?.Nome ?? "Usuario");
            var refreshToken = GerarRefreshToken();
            var expiraEm = DateTime.UtcNow.AddHours(8);

            return new LoginResponseDto
            {
                Sucesso = true,
                Mensagem = "Login realizado com sucesso",
                Usuario = new UsuarioDto
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Email = usuario.Email,
                    PerfilId = usuario.PerfilId,
                    PerfilNome = usuario.Perfil?.Nome ?? string.Empty,
                    Especialidade = usuario.Especialidade,
                    Avatar = usuario.Avatar,
                    Ativo = usuario.Ativo,
                    DtCadastro = usuario.DtCadastro
                },
                Token = token,
                RefreshToken = refreshToken,
                ExpiraEm = expiraEm
            };
        }

        public Task LogoutAsync(Guid usuarioId)
        {
            // Em uma implementação real, invalidaria o refresh token no banco
            return Task.CompletedTask;
        }

        public async Task<UsuarioDto?> ObterUsuarioAtualAsync(Guid usuarioId)
        {
            var usuario = await _usuarioRepository.ObterComPerfilAsync(usuarioId);
            if (usuario == null) return null;

            return new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                PerfilId = usuario.PerfilId,
                PerfilNome = usuario.Perfil?.Nome ?? string.Empty,
                Especialidade = usuario.Especialidade,
                Avatar = usuario.Avatar,
                Ativo = usuario.Ativo,
                DtCadastro = usuario.DtCadastro
            };
        }

        public async Task<LoginResponseDto> RefreshTokenAsync(RefreshTokenDto dto)
        {
            // Implementação simplificada - em produção, validar o refresh token no banco
            // Por enquanto, apenas retorna erro
            return await Task.FromResult(new LoginResponseDto
            {
                Sucesso = false,
                Mensagem = "Refresh token inválido ou expirado"
            });
        }

        public async Task<bool> AlterarSenhaAsync(Guid usuarioId, AlterarSenhaDto dto)
        {
            if (dto.NovaSenha != dto.ConfirmarNovaSenha)
                throw new ArgumentException("As senhas não conferem");

            var usuario = await _usuarioRepository.ObterPorIdAsync(usuarioId);
            if (usuario == null)
                throw new ArgumentException("Usuário não encontrado");

            if (!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.SenhaHash))
                throw new ArgumentException("Senha atual incorreta");

            var novaSenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
            usuario.AlterarSenha(novaSenhaHash);
            await _usuarioRepository.AtualizarAsync(usuario);

            return true;
        }

        private string GerarToken(Guid usuarioId, string email, string perfil)
        {
            var jwtKey = _configuration["JwtSettings:SecretKey"] ?? "DentalTrackSecretKey123456789012345678901234567890ABCD";
            var jwtIssuer = _configuration["JwtSettings:Issuer"] ?? "DentalTrack";
            var jwtAudience = _configuration["JwtSettings:Audience"] ?? "DentalTrackApp";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuarioId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, perfil),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GerarRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
