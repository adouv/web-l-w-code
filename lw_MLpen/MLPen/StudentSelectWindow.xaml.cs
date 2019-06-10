using MLPen.ModernUI.Windows.UI;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using System.Windows.Shapes;

namespace MLPen
{
    /// <summary>
    /// StudentSelectWindow.xaml 的交互逻辑
    /// </summary>
    public partial class StudentSelectWindow : MSFastWindow
    {
        public List<ViewModels.StudentView> mStudentViews = new List<ViewModels.StudentView>();
        public StudentSelectWindow()
        {
            InitializeComponent();
            this.Loaded += (s, e) =>
            {
                foreach (var student in APP.StudySession.GetStudyStudents())
                {
                    var penStatus = PenController.Instance.GetPenStatus(student.id);
                    var item = new ViewModels.StudentView(student);
                    item.IsSubmit = penStatus.IsSubmit;
                    item.IsWriteing = penStatus.IsWriteing;
                    item.IsOnline = penStatus.IsOnline;
                    mStudentViews.Add(item);
                };
                ICUser.ItemsSource = mStudentViews;
            };
        }

        private void SelectAllChange(object sender, RoutedEventArgs e)
        {
            var chk = sender as CheckBox;
            if (chk.IsChecked == true)
            {
                foreach (var item in mStudentViews.Where(m => m.IsSelected == false))
                {
                    item.IsSelected = true;
                }
            }
            else
            {
                foreach (var item in mStudentViews.Where(m => m.IsSelected))
                {
                    item.IsSelected = false;
                }
            }
            ChangeConfirmText();
        }

        private void FaceClick(object sender, RoutedEventArgs e)
        {
            var faceButton = sender as FaceView;
            if (faceButton.IsSelected == false)
            {
                chkSelectAll.IsChecked = false;
            }
            ChangeConfirmText();
        }

        /// <summary>
        /// 刷新按钮文本
        /// </summary>
        private void ChangeConfirmText()
        {
            var count = mStudentViews.Count;
            var selected_count = mStudentViews.Where(m => m.IsSelected).Count();
            btnConfirm.Content = $"确定({selected_count}/{count})";
        }

        /// <summary>
        /// 取消按钮事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CancelClick(object sender, RoutedEventArgs e)
        {
            this.DialogResult = false;
        }

        /// <summary>
        /// 确定按钮事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ConfirmClick(object sender, RoutedEventArgs e)
        {
            this.DialogResult = true;
        }
    }
}
