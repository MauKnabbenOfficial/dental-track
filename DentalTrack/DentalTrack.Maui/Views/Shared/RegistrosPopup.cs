using CommunityToolkit.Maui.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.Views.Shared
{
    public class RegistrosPopup : Popup
    {
        public RegistrosPopup()
        {
            Color = Colors.Transparent;
            CanBeDismissedByTappingOutsideOfPopup = true;

            var btnStyle = new Style(typeof(Button));
            btnStyle.Setters.Add(new Setter { Property = Button.BackgroundColorProperty, Value = Colors.Transparent });
            btnStyle.Setters.Add(new Setter { Property = Button.TextColorProperty, Value = Colors.White }); // Ou a cor do seu app
            btnStyle.Setters.Add(new Setter { Property = Button.HorizontalOptionsProperty, Value = LayoutOptions.Fill });
            //btnStyle.Setters.Add(new Setter { Property = Button.CornerRadiusProperty, Value = 4 });

            var button1 = new Button
            {
                Text = "Usuários",
                Command = new Command(() => Close("Usuarios")),
                FontAttributes = FontAttributes.Bold,
                Style = btnStyle
            };

            //var button2 = new Button
            //{
            //    Text = "Forma de Pagamento",
            //    Command = new Command(() => Close("FormaPagamento")),
            //    Style = btnStyle
            //};


            var layout = new VerticalStackLayout
            {
                Spacing = 1,
                Children =
                {
                    button1,
                    //button2
                },
                Padding = 0
            };

            Content = new Frame
            {
                BackgroundColor = Color.FromArgb("#0E2F59"),
                CornerRadius = 8,
                //HasShadow = true,
                Margin = new Thickness(0, 100),
                Padding = 0,
                Content = layout,
                HeightRequest = 100,
                WidthRequest = 100,
                VerticalOptions = LayoutOptions.Start,
            };
        }
    }
}
