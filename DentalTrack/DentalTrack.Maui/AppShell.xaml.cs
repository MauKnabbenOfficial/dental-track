using CommunityToolkit.Maui.Views;
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

            Routing.RegisterRoute(nameof(UsuarioRegisterPage), typeof(UsuarioRegisterPage));
            Routing.RegisterRoute("Pacientes", typeof(PacientesPage));
            Routing.RegisterRoute("Procedimentos", typeof(ProcedimentosPage));
            Routing.RegisterRoute("Agendas", typeof(AgendasPage));
            Routing.RegisterRoute("Usuarios", typeof(UsuariosPage));
        }

        //private void OnRegistrosMenuItemClicked(object sender, EventArgs e)
        //{
        //    if (sender is Microsoft.Maui.Controls.Button btn && btn.CommandParameter is string param)
        //    {
        //        (BindingContext as HeaderViewModel)?.GoToMenuOptionCommand?.Execute(param);
        //    }

        //    // fecha o menu depois de selecionar
        //    RegistrosPopupPanel.IsVisible = false;
        //}

        private async void OnRegistrosClicked(object sender, EventArgs e)
        {
            var popup = new Views.Shared.RegistrosPopup();

            // anchor no view que disparou o evento (Button)
            if (sender is Microsoft.Maui.Controls.View anchorView)
            {
                popup.Anchor = anchorView;

                // Preferir abaixo do controle — experimente End; se abrir acima, troque por Start.
                popup.VerticalOptions = Microsoft.Maui.Primitives.LayoutAlignment.End;
            }

            var result = await Shell.Current.ShowPopupAsync(popup);
            if (result is string selected)
                (BindingContext as HeaderViewModel)?.GoToMenuOptionCommand?.Execute(selected);
        }
    }
}