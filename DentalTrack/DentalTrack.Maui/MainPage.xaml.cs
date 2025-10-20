using DentalTrack.Maui.ViewModels;

namespace DentalTrack.Maui
{
    public partial class MainPage : ContentPage
    {
        public MainPage(MainViewModel vm)
        {
            InitializeComponent();
            BindingContext = vm;
        }
    }

}
