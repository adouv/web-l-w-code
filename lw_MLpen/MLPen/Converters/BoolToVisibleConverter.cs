using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Data;

namespace MLPen.Converters
{
    public class BoolToVisibleConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var param = parameter == null ? true : bool.Parse(parameter.ToString());
            var v = (bool)value;
            return v == param ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var param = parameter == null ? true : bool.Parse(parameter.ToString());

            var visible = (Visibility)value;
            if (visible == Visibility.Visible)
            {
                return param;
            }
            else
            {
                return !param;
            }
        }
    }
}
