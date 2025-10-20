using DentalTrack.Maui.Auth;
using DentalTrack.Maui.ViewModels.Shared;
using System.Threading.Tasks;

namespace DentalTrack.Maui.Views.Shared;

public partial class HeaderView : ContentView
{
    public HeaderView()
    {
        InitializeComponent();
        this.Loaded += (s, e) =>
        {
            // Evita rodar de novo se o header for re-carregado
            if (this.BindingContext != null)
                return;

            // 3. Pega o IServiceProvider do contexto do MAUI...
            var services = this.Handler.MauiContext.Services;

            // 4. ...e pede o seu ViewModel.
            // O DI vai injetar seu HeaderViewModel aqui.
            this.BindingContext = services.GetService<HeaderViewModel>();
        };
    }
}