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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.ModernUI.Windows.UI
{
    public class MSLoading : ContentControl
    {
        static MSLoading()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(MSLoading), new FrameworkPropertyMetadata(typeof(MSLoading)));
        }

        public static readonly DependencyProperty IsOpenProperty =
            DependencyProperty.Register("IsOpen", typeof(bool), typeof(MSLoading), new PropertyMetadata(false, new PropertyChangedCallback(OnIsOpenChangedChanged)));

        public static readonly DependencyProperty CornerRadiusProperty =
            DependencyProperty.Register("CornerRadius", typeof(CornerRadius), typeof(MSLoading));

        [Category("外观"), Description("是否展示")]
        public bool IsOpen
        {
            get { return (bool)GetValue(IsOpenProperty); }
            set { SetValue(IsOpenProperty, value); }
        }


        [Category("外观"), Description("圆角")]
        public CornerRadius CornerRadius
        {
            get { return (CornerRadius)GetValue(CornerRadiusProperty); }
            set { SetValue(CornerRadiusProperty, value); }
        }

        public override void OnApplyTemplate()
        {
            var element = this.GetTemplateChild("icon") as Grid;
            if (element != null)
            {
                var animation = element.Resources["animation"] as Storyboard;
                if (animation != null) animation.Begin();
            }
            base.OnApplyTemplate();
        }

        /// <summary>
        /// 选择事件
        /// </summary>
        public event RoutedEventHandler IsOpenChanged;
        /// <summary>
        /// 是否显示回答结果事件
        /// </summary>
        /// <param name="d"></param>
        /// <param name="e"></param>
        private static void OnIsOpenChangedChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var control = ((MSLoading)d);
            control.IsOpenChanged?.Invoke(control, new RoutedEventArgs());
        }
    }
}
