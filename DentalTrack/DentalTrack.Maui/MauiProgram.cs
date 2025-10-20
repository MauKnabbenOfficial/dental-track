using CommunityToolkit.Maui;
using DentalTrack.Maui.Auth;
using DentalTrack.Maui.ViewModels;
using DentalTrack.Maui.ViewModels.Shared;
using DentalTrack.Maui.Views;
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

            builder.Services.AddSingleton<IAuthService, AuthServiceMock>();
            builder.Services.AddSingleton<AppShell>();

            //// Pages/ViewModels
            builder.Services.AddTransient<LoginPage>();
            builder.Services.AddTransient<LoginViewModel>();

            builder.Services.AddTransient<MainPage>();
            builder.Services.AddTransient<MainViewModel>();

            builder.Services.AddTransient<DashboardPage>();
            builder.Services.AddTransient<DashboardViewModel>();

            builder.Services.AddSingleton<HeaderViewModel>();

            return builder.Build();
        }
    }
}