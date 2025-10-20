using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DentalTrack.Maui.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.ViewModels.Shared
{
    public partial class HeaderViewModel : ObservableObject
    {
        private readonly IAuthService _auth;
        [ObservableProperty] private string userName = "OLA DR PROGRAMADOR";

        public HeaderViewModel(IAuthService auth) => _auth = auth;

        [RelayCommand]
        private async Task Logout()
        {
            await _auth.LogoutAsync();
        }
    }
}
