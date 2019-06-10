using MLPen.ModernUI.Windows.UI;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.Controls
{
    /// <summary>
    /// UCAnswerPanel.xaml 的交互逻辑
    /// </summary>
    public partial class UCAnswerPanel : UserControl
    {
        public event RoutedEventHandler ClickAction;
        private bool IsShow = false;
        public List<ViewModels.StudentView> mStudentViews = new List<ViewModels.StudentView>();

        public UCAnswerPanel()
        {
            InitializeComponent();

            if (this.IsDesignMode()) return;

            this.Visibility = Visibility.Collapsed;
            initEvents();

            Loaded += (s, e) =>
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

        private void initEvents()
        {
            this.bgMain.MouseLeftButtonUp += (s, e) => { ClosePopup(); };
            this.btnClose.Click += (s, e) => { ClosePopup(); };
            PenController.Instance.HandlerPenStatus += HandlerPenStatus;
        }

        #region 事件
        private void HandlerPenStatus(object sender, PenEvents.StatusEventArgs e)
        {
            var pen = sender as PenDevice;
            var user = mStudentViews.Where(m => m.StudentId == pen.StudentId).FirstOrDefault();
            if (user != null)
            {
                user.IsSubmit = pen.PenStatus.IsSubmit;
                user.IsWriteing = pen.PenStatus.IsWriteing;
                user.IsOnline = pen.PenStatus.IsOnline;
            }
            RefreshStatusCount();
        }
        #endregion

        private void RefreshStatusCount()
        {
            this.UICall(() =>
            {
                //显示学生状态统计数量
                txtSubmitCount.Text = mStudentViews.Where(m => m.IsSubmit).Count().ToString();
                txtNoSubmitCount.Text = mStudentViews.Where(m => m.IsSubmit == false).Count().ToString();
                txtHandlerCount.Text = mStudentViews.Where(m => m.IsWriteing).Count().ToString();
            });
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

        /// <summary>
        /// 按钮事件（头像点击）
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ClickButton(object sender, RoutedEventArgs e)
        {
            ClickAction?.Invoke(sender, e);
        }

        #region 头像点击事件
        /// <summary>
        /// 头像点击事件
        /// </summary>
        public Action<FaceView, long> HandlerFaceClick;
        private void FaceClick(object sender, RoutedEventArgs e)
        {
            var btn = sender as FaceView;
            HandlerFaceClick?.Invoke(btn, btn.StudentId);
        }
        #endregion
    }
}
