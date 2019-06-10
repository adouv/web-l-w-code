using System;
using System.Globalization;
using System.Windows.Data;

namespace MLPen.Converters
{
    /// <summary>
    /// Bool取反转换
    /// </summary>
    public class NegateConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return value is bool ? !(bool)value : value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return Convert(value, targetType, parameter, culture);
        }
    }
}
