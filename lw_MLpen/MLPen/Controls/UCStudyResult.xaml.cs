using System;
using System.Collections.Generic;
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

namespace MLPen.Controls
{
    /// <summary>
    /// UCStudyResult.xaml 的交互逻辑
    /// </summary>
    public partial class UCStudyResult : UserControl
    {
        private bool IsShow = false;

        public UCStudyResult()
        {
            InitializeComponent();

            this.Visibility = Visibility.Collapsed;
            initEvents();

            Loaded += (s, e) =>
            {
            };
        }

        private void ClosePop(object sender, RoutedEventArgs e)
        {
            this.Visibility = Visibility.Collapsed;
        }

        private void initEvents()
        {
            this.btnClose.Click += (s, e) => { ClosePopup(); };
        }

        /// <summary>
        /// 显示
        /// </summary>
        internal void ShowPopup()
        {
            if (this.IsShow) return;

            this.Visibility = Visibility.Visible;
            this.IsShow = true;
        }

        /// <summary>
        /// 关闭
        /// </summary>
        public void ClosePopup()
        {
            this.IsShow = false;
            this.Visibility = Visibility.Collapsed;
        }
    }
}
