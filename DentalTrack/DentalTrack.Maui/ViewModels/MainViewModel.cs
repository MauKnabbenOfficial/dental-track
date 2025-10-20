using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DentalTrack.Maui.Auth;

namespace DentalTrack.Maui.ViewModels
{
    public partial class MainViewModel : ObservableObject
    {
        private readonly IAuthService _auth;
        public MainViewModel(IAuthService auth) => _auth = auth;

        [RelayCommand]
        private async Task Logout()
        {
            await _auth.LogoutAsync();
            //await Shell.Current.GoToAsync("//Login");
        }
    }
}
