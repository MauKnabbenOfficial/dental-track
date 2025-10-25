using DentalTrack.Maui.ViewModels;

namespace DentalTrack.Maui.Views;

public partial class UsuarioRegisterPage : ContentPage
{
	public UsuarioRegisterPage(UsuarioViewModel vm)
	{
		InitializeComponent();
		BindingContext = vm;
    }

	void OnSubmit() => (BindingContext as UsuarioViewModel)?.CadastrarUsuarioCommand.Execute(null);
}