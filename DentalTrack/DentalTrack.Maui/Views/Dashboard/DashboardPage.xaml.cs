using DentalTrack.Maui.ViewModels;

namespace DentalTrack.Maui.Views;

public partial class DashboardPage : ContentPage
{
	public DashboardPage(DashboardViewModel vm)
	{
        InitializeComponent();
        BindingContext = vm;
    }
}