using DentalTrack.Maui.Auth;
using DentalTrack.Maui.ViewModels.Shared;
using DentalTrack.Maui.Views;

namespace DentalTrack.Maui
{
    public partial class AppShell : Shell
    {
        private readonly IAuthService _auth;

        public AppShell(IAuthService auth, HeaderViewModel vm)
        {
            InitializeComponent();
            BindingContext = vm;
            _auth = auth;

            Routing.RegisterRoute(nameof(DashboardPage), typeof(DashboardPage));
        }

        protected override async void OnNavigating(ShellNavigatingEventArgs args)
        {
            base.OnNavigating(args);

            // O destino para onde o usuário está tentando ir
            string targetRoute = args.Target.Location.OriginalString;

            // Se o usuário não está logado E está tentando ir para qualquer lugar 
            // que NÃO seja a LoginPage, cancele a navegação e mande-o para o login.

            // Use "nameof(LoginPage)" para evitar erros de digitação
            string loginRoute = $"//{nameof(LoginPage)}"; // Rota absoluta para login

            // 3. Verificação de segurança
            if (!(await _auth.IsAuthenticatedAsync()) && !targetRoute.Equals(loginRoute, StringComparison.OrdinalIgnoreCase))
            {
                // Cancela a navegação atual
                args.Cancel();

                // Redireciona para o Login.
                // Usamos "await" aqui, mas em um método "void"
                // (que é como o OnNavigating é)
                await Current.GoToAsync(loginRoute);
            }
        }
    }
}
