using DentalTrack.Maui.ViewModels;

namespace DentalTrack.Maui.Views;

public partial class LoginPage : ContentPage
{

    public LoginPage(LoginViewModel vm)
    {
        InitializeComponent();
        BindingContext = vm;
    }

    void OnPasswordCompleted(object sender, EventArgs e)
        => (BindingContext as LoginViewModel)?.LoginCommand.Execute(null);
}