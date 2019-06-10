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
    public class NavButton : Button
    {
        static NavButton()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(NavButton), new FrameworkPropertyMetadata(typeof(NavButton)));
        }

        public static readonly DependencyProperty IconSourceProperty = DependencyProperty.Register("IconSource", typeof(ImageSource), typeof(NavButton), null);
        public static readonly DependencyProperty ImageHeightProperty = DependencyProperty.Register("ImageHeight", typeof(double), typeof(NavButton), new PropertyMetadata(50D));
        public static readonly DependencyProperty ImageWidthProperty = DependencyProperty.Register("ImageWidth", typeof(double), typeof(NavButton), new PropertyMetadata(50D));
        public static readonly DependencyProperty MaskOpacityProperty = DependencyProperty.Register("MaskOpacity", typeof(double), typeof(NavButton), new PropertyMetadata(0.3D));
        public static readonly DependencyProperty IsActiveProperty = DependencyProperty.Register("IsActive", typeof(bool), typeof(NavButton), new PropertyMetadata(false));

        public NavButton()
        {
            this.DefaultStyleKey = typeof(NavButton);
        }
        /// <summary>
        /// 图标地址
        /// </summary>
        [Category("布局"), Description("图标地址")]
        public ImageSource IconSource
        {
            get { return base.GetValue(IconSourceProperty) as ImageSource; }
            set { base.SetValue(IconSourceProperty, value); }
        }
        /// <summary>
        /// 图片高度
        /// </summary>
        [Category("布局"), Description("图片高度")]
        public double ImageHeight
        {
            get { return (double)GetValue(ImageHeightProperty); }
            set { SetValue(ImageHeightProperty, value); }
        }
        /// <summary>
        /// 图片宽度
        /// </summary>
        [Category("布局"), Description("图片宽度")]
        public double ImageWidth
        {
            get { return (double)GetValue(ImageWidthProperty); }
            set { SetValue(ImageHeightProperty, value); }
        }
        /// <summary>
        /// 图片宽度
        /// </summary>
        [Category("布局"), Description("遮罩透明度")]
        public double MaskOpacity
        {
            get { return (double)GetValue(MaskOpacityProperty); }
            set { SetValue(MaskOpacityProperty, value); }
        }

        [Category("布局"), Description("是否选中")]
        public bool IsActive
        {
            get { return (bool)GetValue(IsActiveProperty); }
            set { SetValue(IsActiveProperty, value); }
        }
    }
}
