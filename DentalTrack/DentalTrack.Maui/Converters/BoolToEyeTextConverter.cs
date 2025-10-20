using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DentalTrack.Maui.Converters
{
    public class BoolToEyeTextConverter : IValueConverter
    {
        public string ShowText { get; set; } = "Mostrar";
        public string HideText { get; set; } = "Ocultar";

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
            => value is bool isVisible && isVisible ? HideText : ShowText;

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
            => throw new NotSupportedException();
    }
}
