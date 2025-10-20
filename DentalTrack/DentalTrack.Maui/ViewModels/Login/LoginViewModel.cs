using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DentalTrack.Maui.Auth;

namespace DentalTrack.Maui.ViewModels
{
    public partial class LoginViewModel : ObservableObject
    {
        private readonly IAuthService _auth;

        [ObservableProperty] private string email = string.Empty;
        [ObservableProperty] private string password = string.Empty;
        [ObservableProperty] private bool rememberMe;
        [ObservableProperty] private bool isPasswordVisible;
        [ObservableProperty] private bool isBusy;
        [ObservableProperty] private string error = string.Empty;

        public bool HasError => !string.IsNullOrEmpty(error);

        public LoginViewModel(IAuthService auth) => _auth = auth;

        [RelayCommand]
        private void TogglePassword() => IsPasswordVisible = !IsPasswordVisible;

        [RelayCommand]
        private async Task Login()
        {
            if (IsBusy) return;
            try
            {
                IsBusy = true;
                Error = string.Empty;

                var ok = await _auth.LoginAsync(Email.Trim(), Password);
                if (ok)
                {
                    // se quiser, persista RememberMe num Preferences
                    await Shell.Current.GoToAsync("//Dashboard");
                }
                else
                {
                    Error = "Credenciais inválidas. Use a senha demo: 123";
                    OnPropertyChanged(nameof(HasError));
                }
            }
            finally { IsBusy = false; }
        }
    }
}
