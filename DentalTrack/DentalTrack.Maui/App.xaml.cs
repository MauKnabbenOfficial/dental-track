using DentalTrack.Maui.Auth;

namespace DentalTrack.Maui
{
    public partial class App : Microsoft.Maui.Controls.Application
    {
        private readonly IAuthService _auth;

        public App(IAuthService auth, AppShell appShell)
        {
            InitializeComponent();
            _auth = auth;
            MainPage = appShell;
        }

        protected override async void OnStart()
        {
            base.OnStart();
            await NavigateByAuthAsync();
        }

        private async Task NavigateByAuthAsync()
        {
            //var autenticado = false;
            if (await _auth.IsAuthenticatedAsync())
                //if (autenticado)
                await Shell.Current.GoToAsync("//Dashboard");   // rota protegida
            else
                await Shell.Current.GoToAsync("//Login");  // rota pública
        }

    }
}
