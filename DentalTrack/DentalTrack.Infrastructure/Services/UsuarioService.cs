using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using DentalTrack.Domain.Models;
using DentalTrack.Infrastructure.Repositories;

namespace DentalTrack.Infrastructure.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<List<UsuarioDto>> ObterTodosAsync()
        {
            var usuarios = await _usuarioRepository.ObterTodosAsync();
            return usuarios.Select(MapToDto).ToList();
        }

        public async Task<UsuarioDto?> ObterPorIdAsync(Guid id)
        {
            var usuario = await _usuarioRepository.ObterComPerfilAsync(id);
            return usuario != null ? MapToDto(usuario) : null;
        }

        public async Task<List<UsuarioDto>> ObterPorPerfilAsync(Guid perfilId)
        {
            var usuarios = await _usuarioRepository.ObterPorPerfilAsync(perfilId);
            return usuarios.Select(MapToDto).ToList();
        }

        public async Task<List<UsuarioDto>> ObterDentistasAsync()
        {
            var usuarios = await _usuarioRepository.ObterDentistasAsync();
            return usuarios.Select(MapToDto).ToList();
        }

        public async Task<UsuarioDto> CriarAsync(UsuarioCreateDto dto)
        {
            if (dto.Senha != dto.ConfirmarSenha)
                throw new ArgumentException("As senhas não conferem");

            var emailExiste = await _usuarioRepository.ObterPorEmailAsync(dto.Email);
            if (emailExiste != null)
                throw new ArgumentException("Email já cadastrado");

            var senhaHash = HashPassword(dto.Senha);
            var usuario = new Usuario(dto.Nome, dto.Email, senhaHash, dto.PerfilId, dto.Especialidade);

            await _usuarioRepository.AdicionarAsync(usuario);

            var usuarioCompleto = await _usuarioRepository.ObterComPerfilAsync(usuario.Id);
            return MapToDto(usuarioCompleto!);
        }

        public async Task<UsuarioDto> AtualizarAsync(Guid id, UsuarioUpdateDto dto)
        {
            var usuario = await _usuarioRepository.ObterComPerfilAsync(id);
            if (usuario == null)
                throw new ArgumentException("Usuário não encontrado");

            usuario.Atualizar(dto.Nome, dto.Especialidade, dto.Avatar);
            usuario.AlterarPerfil(dto.PerfilId);

            await _usuarioRepository.AtualizarAsync(usuario);

            var usuarioAtualizado = await _usuarioRepository.ObterComPerfilAsync(id);
            return MapToDto(usuarioAtualizado!);
        }

        public async Task<bool> ExcluirAsync(Guid id)
        {
            return await _usuarioRepository.RemoverAsync(id);
        }

        public async Task<bool> AtivarAsync(Guid id)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(id);
            if (usuario == null) return false;

            usuario.Ativar();
            await _usuarioRepository.AtualizarAsync(usuario);
            return true;
        }

        public async Task<bool> DesativarAsync(Guid id)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(id);
            if (usuario == null) return false;

            usuario.Desativar();
            await _usuarioRepository.AtualizarAsync(usuario);
            return true;
        }

        private static UsuarioDto MapToDto(Usuario usuario)
        {
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

        private static string HashPassword(string password)
        {
            // TODO: Implementar BCrypt ou similar
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
