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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.Controls
{
    /// <summary>
    /// UCCountdown.xaml 的交互逻辑
    /// </summary>
    public partial class UCCountdown : UserControl
    {
        public UCCountdown()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 结束
        /// </summary>
        public void PlayEnd()
        {
            this.Visibility = Visibility.Visible;
            var ani = this.root.Resources["end"] as Storyboard;
            ani.Completed += (s, e) =>
            {
                this.Visibility = Visibility.Collapsed;
            };
            ani.Begin();
        }

        /// <summary>
        /// 开始
        /// </summary>
        public void PlayStart()
        {
            this.Visibility = Visibility.Visible;
            var ani = this.root.Resources["begin"] as Storyboard;
            ani.Completed += (s, e) =>
            {
                this.Visibility = Visibility.Collapsed;
            };
            ani.Begin();
        }
    }
}
