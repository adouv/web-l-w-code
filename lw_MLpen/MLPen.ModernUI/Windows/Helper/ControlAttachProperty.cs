using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace MLPen.ModernUI.Windows.Helper
{
    public static class ControlAttachProperty
    {
        #region PlaceHolderProperty 占位符
        public static readonly DependencyProperty PlaceHolderProperty = DependencyProperty.RegisterAttached("PlaceHolder", typeof(string), typeof(ControlAttachProperty));
        public static string GetPlaceHolder(DependencyObject d)
        {
            return (string)d.GetValue(PlaceHolderProperty);
        }
        public static void SetPlaceHolder(DependencyObject obj, string value)
        {
            obj.SetValue(PlaceHolderProperty, value);
        }
        #endregion

        #region IconCodeProperty 图标
        public static readonly DependencyProperty IconCodeProperty = DependencyProperty.RegisterAttached("IconCode", typeof(string), typeof(ControlAttachProperty));
        public static string GetIconCode(DependencyObject d)
        {
            return (string)d.GetValue(IconCodeProperty);
        }
        public static void SetIconCode(DependencyObject obj, string value)
        {
            obj.SetValue(IconCodeProperty, value);
        }
        #endregion
    }
}
