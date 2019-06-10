using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    /// <summary>
    /// SwitchGardenDialog.xaml 的交互逻辑
    /// </summary>
    public partial class SwitchGardenDialog : MLDialog
    {
        private int mGardenId;
        public ObservableCollection<ViewModels.Garden> mGardens = new ObservableCollection<ViewModels.Garden>();
        public SwitchGardenDialog()
        {
            InitializeComponent();

            this.DataContext = new { Gardens = mGardens };
            this.Loaded += SwitchGardenDialog_Loaded;
        }

        private void SwitchGardenDialog_Loaded(object sender, RoutedEventArgs e)
        {
            foreach (var item in APP.StudySession.Account.gardens)
            {
                mGardens.Add(new ViewModels.Garden()
                {
                    GardenId = item.gardenId,
                    GardenName = item.gardenName,
                    GardenTypeId = item.gardenTypeId
                });
            }
            CBBGardens.SelectedValue = mGardenId;
        }

        /// <summary>
        /// 打开对话框
        /// </summary>
        /// <param name="owner"></param>
        /// <returns></returns>
        internal static void OpenDialog(Window owner, Action<int> gardenSelected)
        {
            var dialog = new SwitchGardenDialog();
            dialog.Owner = owner;
            dialog.mGardenId = APP.StudySession.GardenId;
            dialog.ShowDialog();

            if (dialog.mGardenId != APP.StudySession.GardenId)
            {
                gardenSelected(dialog.mGardenId);
            }
        }

        private void GardensSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var item = CBBGardens.SelectedItem as ViewModels.Garden;
            if (item != null)
            {
                mGardenId = item.GardenId;
            }
        }
    }
}
