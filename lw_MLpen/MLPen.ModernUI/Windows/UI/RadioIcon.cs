using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.ModernUI.Windows.UI
{
    public class RadioIcon : RadioButton
    {
        static RadioIcon()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(RadioIcon), new FrameworkPropertyMetadata(typeof(RadioIcon)));
        }

        public static readonly DependencyProperty IconSizeProperty = DependencyProperty.Register("IconSize", typeof(double), typeof(RadioIcon), new PropertyMetadata(19D));
        public static readonly DependencyProperty IconTextProperty = DependencyProperty.Register("IconText", typeof(string), typeof(RadioIcon), new PropertyMetadata("\xe691"));

        /// <summary>
        /// 字体图标大小
        /// </summary>
        [Category("外观"), Description("字体图标大小")]
        public double IconSize
        {
            get { return (double)GetValue(IconSizeProperty); }
            set { SetValue(IconSizeProperty, value); }
        }
        /// <summary>
        /// 字体图标大小
        /// </summary>
        [Category("外观"), Description("字体图标")]
        public string IconText
        {
            get { return (string)GetValue(IconTextProperty); }
            set { SetValue(IconTextProperty, value); }
        }
    }
}
