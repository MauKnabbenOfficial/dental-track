using CommunityToolkit.Maui;
using CommunityToolkit.Maui.Core;
using DentalTrack.Application.Interfaces;
using DentalTrack.Infrastructure.Services;
using DentalTrack.Maui.Auth;
using DentalTrack.Maui.ViewModels;
using DentalTrack.Maui.ViewModels.Shared;
using DentalTrack.Maui.Views;
using DentalTrack.Maui.Views.Shared;
using Microsoft.Extensions.Logging;

namespace DentalTrack.Maui
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            //builder.UseMauiApp<App>().ConfigureFonts(fonts =>
            //{
            //    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            //    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            //}).UseMauiCommunityToolkit();
            builder.UseMauiApp<App>().UseMauiCommunityToolkit();

#if DEBUG
            builder.Logging.AddDebug();
#endif
            builder.Services.AddScoped<IUsuarioService, UsuarioService>();
            builder.Services.AddSingleton<IAuthService, AuthServiceMock>();

            builder.Services.AddSingleton<AppShell>();
            builder.Services.AddSingleton<HeaderViewModel>();

            // Pages/ViewModels

            builder.Services.AddTransient<LoginPage>();
            builder.Services.AddTransient<LoginViewModel>();

            builder.Services.AddTransient<MainPage>();
            builder.Services.AddTransient<MainViewModel>();

            builder.Services.AddTransient<DashboardPage>();
            builder.Services.AddTransient<DashboardViewModel>();


            builder.Services.AddTransient<UsuarioRegisterPage>();
            builder.Services.AddTransient<UsuarioViewModel>();

            builder.Services.AddTransient<UsuariosPage>();


            return builder.Build();
        }
    }
}