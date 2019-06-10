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

namespace MLPen
{
    /// <summary>
    /// MSMessageBox.xaml 的交互逻辑
    /// </summary>
    public partial class MSMessageBox : Window
    {
        /// <summary>
        /// 对话框返回状态
        /// </summary>
        public enum MessageResult
        {
            None,
            Yes,
            No,
            Cancel,
            Ok
        }
        /// <summary>
        /// 对话框按钮类型
        /// </summary>
        public enum MSMessageBoxButton
        {
            YesOrNo,
            Cancel,
            OK,
            CancelOrOk
        }

        private MSMessageBoxButton buttonType;
        private MessageResult result = MessageResult.None;
        public MSMessageBox()
        {
            InitializeComponent();

            this.MouseLeftButtonDown += (o, e) =>
            {
                this.DragMove();
            };

            this.btnNoOrCancel.Click += (s, e) =>
            {
                switch (this.buttonType)
                {
                    case MSMessageBoxButton.YesOrNo:
                        result = MessageResult.No;
                        break;
                    case MSMessageBoxButton.Cancel:
                    case MSMessageBoxButton.CancelOrOk:
                        result = MessageResult.Cancel;
                        break;
                }
                this.DialogResult = false;
            };
            this.btnYesOrOk.Click += (s, e) =>
            {
                switch (this.buttonType)
                {
                    case MSMessageBoxButton.YesOrNo:
                        result = MessageResult.Yes;
                        break;
                    case MSMessageBoxButton.OK:
                    case MSMessageBoxButton.CancelOrOk:
                        result = MessageResult.Ok;
                        break;
                }
                this.DialogResult = true;
            };
        }
        /// <summary>
        /// 初始化对话框资料
        /// </summary>
        /// <param name="button">按钮类型</param>
        /// <param name="title">提示标题</param>
        /// <param name="content">提示内容</param>
        private void Init(MSMessageBoxButton button, string title, string content)
        {
            this.buttonType = button;
            this.lblTitle.Text = title;
            this.lblContent.Text = content;

            switch (button)
            {
                case MSMessageBoxButton.YesOrNo:
                    this.btnNoOrCancel.Content = "否";
                    this.btnYesOrOk.Content = "是";
                    this.lblIcon.Text = "\xe609";
                    this.lblIcon.Foreground = Application.Current.Resources["WarningBrush"] as SolidColorBrush;
                    this.btnNoOrCancel.IsCancel = true;
                    this.btnYesOrOk.IsDefault = true;
                    break;
                case MSMessageBoxButton.CancelOrOk:
                    this.btnNoOrCancel.Content = "取消";
                    this.btnYesOrOk.Content = "确定";
                    this.lblIcon.Text = "\xe61a";
                    this.lblIcon.Foreground = Application.Current.Resources["PrimaryBrush"] as SolidColorBrush;
                    this.btnNoOrCancel.IsCancel = true;
                    this.btnYesOrOk.IsDefault = true;
                    break;
                case MSMessageBoxButton.Cancel:
                    this.btnNoOrCancel.Content = "取消";
                    this.btnNoOrCancel.IsDefault = true;
                    this.btnYesOrOk.Visibility = Visibility.Collapsed;
                    this.lblIcon.Text = "\xe61a";
                    this.lblIcon.Foreground = Application.Current.Resources["PrimaryBrush"] as SolidColorBrush;
                    break;
                case MSMessageBoxButton.OK:
                    this.btnYesOrOk.Content = "确定";
                    this.btnYesOrOk.IsDefault = true;
                    this.btnNoOrCancel.Visibility = Visibility.Collapsed;
                    this.lblIcon.Text = "\xe61a";
                    this.lblIcon.Foreground = Application.Current.Resources["PrimaryBrush"] as SolidColorBrush;
                    break;
            }
        }

        /// <summary>
        /// 显示对话框
        /// </summary>
        /// <returns></returns>
        public static MessageResult ShowModal(MSMessageBoxButton button, string title, string content)
        {
            var win = new MSMessageBox();
            win.Init(button, title, content);
            win.ShowDialog();
            return win.result;
        }
    }
}
