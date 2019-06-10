using MLPen.Services;
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
using System.Windows.Threading;

namespace MLPen.Controls
{
    /// <summary>
    /// UCTool.xaml 的交互逻辑
    /// </summary>
    public partial class UCTool : UserControl
    {
        private Window parentWindow;
        private Point point = new Point();
        

        /// <summary>
        /// 开始答题点击事件
        /// </summary>
        public event RoutedEventHandler BeginQuestionClick;
        /// <summary>
        /// 结束答题点击事件
        /// </summary>
        public event RoutedEventHandler EndQuestionClick;
        /// <summary>
        /// 开始自判点击事件
        /// </summary>
        public event RoutedEventHandler SelfJudgeStartClick;
        /// <summary>
        /// 结束自判点击事件
        /// </summary>
        public event RoutedEventHandler SelfJudgeEndClick;
        /// <summary>
        /// 答判情况点击事件
        /// </summary>
        public event RoutedEventHandler AnswerResultClick;
        /// <summary>
        /// 退出做题事件
        /// </summary>
        public event RoutedEventHandler ExitAnswerClick;

        private DispatcherTimer mAnswerTimer;
        private DispatcherTimer mSubTimer;

        /// <summary>
        /// 答题时间
        /// </summary>
        public TimeSpan AnswerTime;
        /// <summary>
        /// 停留小计
        /// </summary>
        public TimeSpan SubTime;

        public class PageData : NotifyProperty
        {
            private string _AnswerTimeText;
            public string AnswerTimeText { get { return _AnswerTimeText; } set { _AnswerTimeText = value; this.Notify(m => m.AnswerTimeText); } }
            private string _SubTimeText;
            public string SubTimeText { get { return _SubTimeText; } set { _SubTimeText = value; this.Notify(m => m.SubTimeText); } }
        }

        private PageData data = new PageData()
        {
            AnswerTimeText = "00:00:00",
            SubTimeText = "00:00:00"
        };

        public UCTool()
        {
            InitializeComponent();

            this.DataContext = data;

            AnswerTime = new TimeSpan();
            SubTime = new TimeSpan();

            mAnswerTimer = new DispatcherTimer()
            {
                Interval = TimeSpan.FromMilliseconds(1000)
            };
            mAnswerTimer.Tick += MAnswerTimer_Tick;

            mSubTimer = new DispatcherTimer()
            {
                Interval = TimeSpan.FromMilliseconds(1000)
            };
            mSubTimer.Tick += MSubTimer_Tick;

            Loaded += (s, e) =>
            {
                InitEvents();
            };
        }

        public void SetWindow(Window window)
        {
            this.parentWindow = window;
        }

        private void InitEvents()
        {
            //退出
            this.btnExit.Click += (s, e) =>
            {
                var ret = MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.YesOrNo, "友情提示", "您确定要退出做题吗？");
                if (ret == MSMessageBox.MessageResult.Yes)
                {
                    ExitAnswerClick?.Invoke(this, e);
                }
            };

            //收缩
            this.btnCollect.Click += (s, e) =>
            {
                this.Height = 97;
                this.toolBg.ImageSource = MSUtils.GetLocalImage("/Assets/Images/bg-tool-close.png");
            };

            //展开
            this.MouseLeftButtonDown += (s, e) =>
            {
                point.X = this.Margin.Left;
                point.Y = this.Margin.Top;
            };
            this.MouseLeftButtonUp += (s, e) =>
            {
                var x = point.X - this.Margin.Left;
                var y = point.Y - this.Margin.Top;
                if (x < 1 && x > -1 && y < 1 && y > -1)
                {
                    this.Height = 446;
                    this.toolBg.ImageSource = MSUtils.GetLocalImage("/Assets/Images/bg-tool-open.png");
                }
            };

            //配置
            this.btnSettings.Click += (s, e) =>
            {
                var win = new StudySettingsWindow();
                win.ShowDialog();
            };
            
        }

        /// <summary>
        /// 按钮事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ClickButton(object sender, RoutedEventArgs e)
        {
            var btn = sender as Button;
            var tag = btn.Tag as string;
            switch (tag)
            {
                case "begin_answer":
                    BeginQuestionClick?.Invoke(this, e);
                    break;
                case "end_answer":
                    EndQuestionClick?.Invoke(this, e);
                    break;
                case "begin_self_check":
                    SelfJudgeStartClick?.Invoke(this, e);
                    break;
                case "end_self_check":
                    SelfJudgeEndClick?.Invoke(this, e);
                    break;
                case "result":
                    AnswerResultClick?.Invoke(this, e);
                    break;
            }
        }

        private void analysisOrignial()
        {
            OriginalRecordService original = new OriginalRecordService();
            var practiceRecord = APP.IDatas.ErPracticeRecord.GetOne();
            //original.analysisOriginal(practiceRecord.id, )
        }

        #region 答题时间
        private void MAnswerTimer_Tick(object sender, EventArgs e)
        {
            AnswerTime = AnswerTime.Add(new TimeSpan(0, 0, 1));
            data.AnswerTimeText = AnswerTime.ToString(@"hh\:mm\:ss");
        }
        /// <summary>
        /// 开始计时
        /// </summary>
        public void BeginAnswerTime()
        {
            AnswerTime = new TimeSpan();
            mAnswerTimer.Start();
        }
        /// <summary>
        /// 停止计时
        /// </summary>
        public void EndAnswerTime()
        {
            mAnswerTimer.Stop();
            data.AnswerTimeText = "00:00:00";
        }
        #endregion

        #region 每题停留时间
        private void MSubTimer_Tick(object sender, EventArgs e)
        {
            SubTime = SubTime.Add(new TimeSpan(0, 0, 1));
            data.SubTimeText = SubTime.ToString(@"hh\:mm\:ss");
        }
        public void BeginSubTime()
        {
            SubTime = new TimeSpan();
            mSubTimer.Start();
        }
        public void EndSubTime()
        {
            mSubTimer.Stop();
            data.SubTimeText = "00:00:00";
        }
        #endregion

       
    }
}
