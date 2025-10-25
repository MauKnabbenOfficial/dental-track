using CommunityToolkit.Maui.Core;
using CommunityToolkit.Maui.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DentalTrack.Maui.Auth;
using DentalTrack.Maui.Views.Shared;

namespace DentalTrack.Maui.ViewModels.Shared
{
    public partial class HeaderViewModel : ObservableObject
    {
        private readonly IAuthService _auth;

        [ObservableProperty] private string userName = "OLA DR PROGRAMADOR";

        public HeaderViewModel(IAuthService auth)
        {
            _auth = auth;
        }

        [RelayCommand]
        private async Task Logout()
        {
            await _auth.LogoutAsync();
        }

        [RelayCommand]
        private async Task GoToMenuOptionAsync(string page)
        {
            switch (page)
            {
                case "Inicio":
                    // Example navigation, replace with actual logic as needed
                    await Shell.Current.GoToAsync("//Dashboard");
                    break;
                default:
                    await Shell.Current.GoToAsync(page);
                    break;
            }
        }

        [RelayCommand]
        private async Task RegisterUserAction()
        {
            try
            {
                await Shell.Current.GoToAsync("UsuarioRegisterPage");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
