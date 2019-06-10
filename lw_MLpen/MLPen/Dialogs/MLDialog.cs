using MLPen.ModernUI.Windows.UI;
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
using System.Windows.Shapes;

namespace MLPen.Dialogs
{
    public partial class MLDialog : MSFastWindow
    {
        public MLDialog()
        {
            this.WindowStyle = WindowStyle.None;
            this.WindowState = WindowState.Normal;
            this.WindowStartupLocation = WindowStartupLocation.CenterOwner;
            this.IsMinimize = false;
        }
    }
}
