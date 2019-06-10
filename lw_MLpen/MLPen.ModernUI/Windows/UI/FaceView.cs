using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.ModernUI.Windows.UI
{
    public class FaceView : ButtonBase
    {
        static FaceView()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(FaceView), new FrameworkPropertyMetadata(typeof(FaceView)));
        }

        public static readonly DependencyProperty FaceSourceProperty =
            DependencyProperty.Register("FaceSource", typeof(ImageSource), typeof(FaceView), null);
        public static readonly DependencyProperty IconSizeProperty =
            DependencyProperty.Register("IconSize", typeof(double), typeof(FaceView), new PropertyMetadata(68D));
        public static readonly DependencyProperty IsSelectedProperty =
            DependencyProperty.Register("IsSelected", typeof(bool), typeof(FaceView), new PropertyMetadata(false, new PropertyChangedCallback(OnSelectedChanged)));
        public static readonly DependencyProperty IsWriteProperty =
            DependencyProperty.Register("IsWrite", typeof(bool), typeof(FaceView), new PropertyMetadata(false));
        public static readonly DependencyProperty IsSubmitProperty =
            DependencyProperty.Register("IsSubmit", typeof(bool), typeof(FaceView), new PropertyMetadata(false));
        public static readonly DependencyProperty StudentIdProperty =
            DependencyProperty.Register("StudentId", typeof(long), typeof(FaceView), new PropertyMetadata((long)0));

        public FaceView()
        {
            initEvent();
        }

        /// <summary>
        /// 图标宽度
        /// </summary>
        [Category("外观"), Description("图标宽度")]
        public double IconSize
        {
            get { return (double)GetValue(IconSizeProperty); }
            set { SetValue(IconSizeProperty, value); }
        }
        /// <summary>
        /// 头像地址
        /// </summary>
        [Category("外观"), Description("头像地址")]
        public ImageSource FaceSource
        {
            get { return (ImageSource)base.GetValue(FaceSourceProperty); }
            set { base.SetValue(FaceSourceProperty, value); }
        }

        /// <summary>
        /// 是否选中（默认专用）
        /// </summary>
        [Category("外观"), Description("是否选中")]
        public bool IsSelected
        {
            get { return (bool)base.GetValue(IsSelectedProperty); }
            set { base.SetValue(IsSelectedProperty, value); }
        }
        /// <summary>
        /// 是否正在书写（FaceViewStatus专用）
        /// </summary>
        [Category("外观"), Description("是否正在书写")]
        public bool IsWrite
        {
            get { return (bool)base.GetValue(IsWriteProperty); }
            set { base.SetValue(IsWriteProperty, value); }
        }
        /// <summary>
        /// 是否已经提交（FaceViewStatus专用）
        /// </summary>
        [Category("外观"), Description("是否已经提交")]
        public bool IsSubmit
        {
            get { return (bool)base.GetValue(IsSubmitProperty); }
            set { base.SetValue(IsSubmitProperty, value); }
        }
        /// <summary>
        /// 学生ID
        /// </summary>
        [Category("外观"), Description("学生ID")]
        public long StudentId
        {
            get { return (long)base.GetValue(StudentIdProperty); }
            set { base.SetValue(StudentIdProperty, value); }
        }

        #region 初始化事件
        private void initEvent()
        {
            this.Click += (e, s) =>
            {
                if (IsEnabled) IsSelected = !IsSelected;
            };
        }
        #endregion

        /// <summary>
        /// 选择事件
        /// </summary>
        public event RoutedEventHandler SelectedChanged;
        /// <summary>
        /// 是否显示回答结果事件
        /// </summary>
        /// <param name="d"></param>
        /// <param name="e"></param>
        private static void OnSelectedChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var control = ((FaceView)d);
            control.SelectedChanged?.Invoke(control, new RoutedEventArgs());
        }
    }
}
