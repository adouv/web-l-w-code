using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.ModernUI.Windows.UI
{
    public class IconButton : ButtonBase
    {
        static IconButton()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(IconButton), new FrameworkPropertyMetadata(typeof(IconButton)));
        }

        public static readonly DependencyProperty CornerRadiusProperty = DependencyProperty.Register("CornerRadius", typeof(CornerRadius), typeof(IconButton));
        //public static readonly DependencyProperty ActiveBrushProperty = DependencyProperty.Register("ActiveBrush", typeof(Brush), typeof(IconButton), new PropertyMetadata(null));

        [Category("外观"), Description("圆角")]
        public CornerRadius CornerRadius
        {
            get { return (CornerRadius)GetValue(CornerRadiusProperty); }
            set { SetValue(CornerRadiusProperty, value); }
        }

        //[Category("画笔"), Description("点击后颜色")]
        //public Brush ActiveBrush
        //{
        //    get { return (Brush)GetValue(ActiveBrushProperty); }
        //    set { SetValue(ActiveBrushProperty, value); }
        //}
    }
}
