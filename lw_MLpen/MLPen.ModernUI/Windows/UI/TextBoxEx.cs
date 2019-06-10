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
    public class TextBoxEx : TextBox
    {
        static TextBoxEx()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(TextBoxEx), new FrameworkPropertyMetadata(typeof(TextBoxEx)));
        }

        public static readonly DependencyProperty IconCodeProperty = DependencyProperty.Register("IconCode", typeof(string), typeof(TextBoxEx));
        public static readonly DependencyProperty PlaceHolderProperty = DependencyProperty.Register("PlaceHolder", typeof(string), typeof(TextBoxEx));

        /// <summary>
        /// 图标代码
        /// </summary>
        [Category("公共"), Description("图标代码")]
        public string IconCode
        {
            get { return (string)base.GetValue(IconCodeProperty); }
            set { base.SetValue(IconCodeProperty, value); }
        }

        /// <summary>
        /// 占位提示
        /// </summary>
        [Category("公共"), Description("占位提示")]
        public string PlaceHolder
        {
            get { return (string)base.GetValue(PlaceHolderProperty); }
            set { base.SetValue(PlaceHolderProperty, value); }
        }
    }
}
