using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DentalTrack.Application.DTOs;
using DentalTrack.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.ViewModels
{
    public partial class UsuarioViewModel : ObservableObject
    {
        [ObservableProperty] private UsuarioCreateDto usuarioCreate = new UsuarioCreateDto();
        public UsuarioDto UsuarioEdit { get; set; } = new UsuarioDto();
        private IUsuarioService UserService { get; set; }

        public UsuarioViewModel(IUsuarioService _userService)
        {
            UserService = _userService;
        }

        [RelayCommand]
        public async Task<bool> CadastrarUsuarioAsync()
        {
            if(await UserService.CadastrarUsuarioAsync(UsuarioCreate))
            {
                await Shell.Current.DisplayAlert("PARABENS DEV PLENO!", "USUÁRIO CADASTRADO COM SUCESSO!!!", "Beleza!");
                return true;
            }
            else
            {
                return false;

            }
        }
    }
}
