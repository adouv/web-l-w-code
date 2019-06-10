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
    public partial class MSFastWindow : Window
    {
        static MSFastWindow()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(MSFastWindow), new FrameworkPropertyMetadata(typeof(MSFastWindow)));
        }

        public static readonly DependencyProperty IsMinimizeProperty = DependencyProperty.Register("IsMinimize", typeof(bool), typeof(MSFastWindow), new PropertyMetadata(true));
        public static readonly DependencyProperty IsToolBarProperty = DependencyProperty.Register("IsToolBar", typeof(bool), typeof(MSFastWindow), new PropertyMetadata(true));

        public MSFastWindow()
        {
            this.DefaultStyleKey = typeof(MSFastWindow);

            CommandBindings.Add(new CommandBinding(SystemCommands.CloseWindowCommand, CloseWindow));
            CommandBindings.Add(new CommandBinding(SystemCommands.MinimizeWindowCommand, MinimizeWindow, CanMinimizeWindow));
        }

        #region Window Commands
        private void CanResizeWindow(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = ResizeMode == ResizeMode.CanResize || ResizeMode == ResizeMode.CanResizeWithGrip;
        }
        private void CanMinimizeWindow(object sender, CanExecuteRoutedEventArgs e)
        {
            e.CanExecute = ResizeMode != ResizeMode.NoResize;
        }
        private void CloseWindow(object sender, ExecutedRoutedEventArgs e)
        {
            this.Close();
        }
        private void MaximizeWindow(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.MaximizeWindow(this);
        }
        private void MinimizeWindow(object sender, ExecutedRoutedEventArgs e)
        {
            SystemCommands.MinimizeWindow(this);
        }
        #endregion

        [Category("外观"), Description("是否最小化")]
        public bool IsMinimize
        {
            get { return (bool)GetValue(IsMinimizeProperty); }
            set { SetValue(IsMinimizeProperty, value); }
        }
        [Category("外观"), Description("是否显示标题栏")]
        public bool IsToolBar
        {
            get { return (bool)GetValue(IsToolBarProperty); }
            set { SetValue(IsToolBarProperty, value); }
        }

        protected override void OnMouseLeftButtonDown(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonDown(e);
            if (e.ButtonState == MouseButtonState.Pressed) DragMove();
        }
    }
}
