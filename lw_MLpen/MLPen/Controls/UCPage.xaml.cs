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
using MLPen.ApiModels;
using MLPen.ModernUI.Windows.UI;

namespace MLPen.Controls
{
    /// <summary>
    /// UCPage.xaml 的交互逻辑
    /// </summary>
    public partial class UCPage : UserControl
    {
        #region 对外属性
        public static readonly DependencyProperty IsShowAnswerProperty = DependencyProperty.Register("IsShowAnswer", typeof(bool), typeof(UCPage), new PropertyMetadata(false, new PropertyChangedCallback(ShowAnswerInfoChanged)));
        public static readonly DependencyProperty IsShowStemProperty = DependencyProperty.Register("IsShowStem", typeof(bool), typeof(UCPage), new PropertyMetadata(false, new PropertyChangedCallback(ShowStemChanged)));
        public static readonly DependencyProperty StudentIdProperty = DependencyProperty.Register("StudentId", typeof(long), typeof(UCPage));

        [Category("外观"), Description("显示回答信息")]
        public bool IsShowAnswer
        {
            get { return (bool)GetValue(IsShowAnswerProperty); }
            set { SetValue(IsShowAnswerProperty, value); }
        }
        [Category("外观"), Description("是否显示题干")]
        public bool IsShowStem
        {
            get { return (bool)GetValue(IsShowStemProperty); }
            set { SetValue(IsShowStemProperty, value); }
        }
        [Category("外观"), Description("学生ID")]
        public long StudentId
        {
            get { return (long)GetValue(StudentIdProperty); }
            set { SetValue(StudentIdProperty, value); }
        }
        #endregion

        #region 页面数据
        public class PageData : NotifyProperty
        {
            public long _StudentId;
            public string _Name;
            public string _Face;
            public string _QuestionTitle;
            public string _IsSubmitAnswerText;
            public string _AnswerText;

            public long StudentId { get { return _StudentId; } set { _StudentId = value; this.Notify(m => m.StudentId); } }
            public string Name { get { return _Name; } set { _Name = value; this.Notify(m => m.Name); } }
            public string Face { get { return _Face; } set { _Face = value; this.Notify(m => m.Face); } }
            public string QuestionTitle { get { return _QuestionTitle; } set { _QuestionTitle = value; this.Notify(m => m.QuestionTitle); } }
            public string IsSubmitAnswerText { get { return _IsSubmitAnswerText; } set { _IsSubmitAnswerText = value; this.Notify(m => m.IsSubmitAnswerText); } }
            public string AnswerText { get { return _AnswerText; } set { _AnswerText = value; this.Notify(m => m.AnswerText); } }
        }
        public PageData mPageData = new PageData();
        #endregion

        internal event EventHandler<EventArgs> PenLoaded;
        public UCPage()
        {
            InitializeComponent();
            Dispatcher.ShutdownStarted += (object sender, EventArgs e) => { Close(); };
            Loaded += (s, e) =>
            {
                initEvents();

                this.DataContext = mPageData;
                if (APP.StudySession.PracticeRecordId.IsNotEmtpy() && APP.StudySession.QuestionID > 0)
                {
                    UpdateData(APP.StudySession.PracticeRecordId, APP.StudySession.QuestionID);
                }
                else
                {
                }
            };
            ucTablet.Loaded += (s1, e1) =>
            {
                if (ucTablet.ActualWidth == 1133)
                {
                    ucTablet.SetZoom(0.65);
                }
            };
            Unloaded += (s, e) =>
            {
                Close();
            };
        }

        public override void OnApplyTemplate()
        {
            base.OnApplyTemplate();
            lblStem.Visibility = IsShowStem ? Visibility.Visible : Visibility.Hidden;
        }

        /// <summary>
        /// 关闭，并释放所有资源
        /// </summary>
        internal void Close()
        {
            GC.SuppressFinalize(this);
        }

        #region 移动画布
        //触摸点的坐标
        Point _startPosition;
        //滚动条当前位置
        double _startVerticalOffset;
        double _startHorizontalOffset;
        private void initEvents()
        {
            ucTablet.PenLoaded += (s, e) => { PenLoaded?.Invoke(s, e); };
            this.ucTablet.MouseLeftButtonDown += TabletScroll_MouseLeftButtonDown;
            this.ucTablet.MouseLeftButtonUp += TabletScroll_MouseRightButtonUp;
            this.ucTablet.MouseLeave += UcTablet_MouseLeave;
        }

        private void UcTablet_MouseLeave(object sender, MouseEventArgs e)
        {
            this.TabletScroll.MouseMove -= TabletScroll_MouseMove;
        }

        private void TabletScroll_MouseRightButtonUp(object sender, MouseButtonEventArgs e)
        {
            this.TabletScroll.MouseMove -= TabletScroll_MouseMove;
        }

        private void TabletScroll_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.TabletScroll.MouseMove -= TabletScroll_MouseMove;
            this.TabletScroll.MouseMove += TabletScroll_MouseMove;
            //获取ScrollViewer滚动条当前位置
            _startVerticalOffset = this.TabletScroll.VerticalOffset;
            _startHorizontalOffset = this.TabletScroll.HorizontalOffset;

            //获取相对于ScrollViewer的触摸点位置
            _startPosition = e.GetPosition(this);
        }

        private void TabletScroll_MouseMove(object sender, MouseEventArgs e)
        {
            //获取相对于ScrollViewer的触摸点位置
            Point endPoint = e.GetPosition(this);
            //计算相对位置
            double diffOffsetY = endPoint.Y - _startPosition.Y;
            double diffOffsetX = endPoint.X - _startPosition.X;

            //ScrollViewer滚动到指定位置(指定位置=起始位置-移动的偏移量，滚动方向和手势方向相反)
            this.TabletScroll.ScrollToVerticalOffset(_startVerticalOffset - diffOffsetY);
            this.TabletScroll.ScrollToHorizontalOffset(_startHorizontalOffset - diffOffsetX);
        }
        #endregion

        /// <summary>
        /// 是否显示题干事件
        /// </summary>
        /// <param name="d"></param>
        /// <param name="e"></param>
        private static void ShowStemChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var page = ((UCPage)d);
            page.lblStem.Visibility = ((bool)e.NewValue) ? Visibility.Visible : Visibility.Collapsed;
        }
        /// <summary>
        /// 是否显示回答结果事件
        /// </summary>
        /// <param name="d"></param>
        /// <param name="e"></param>
        private static void ShowAnswerInfoChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var page = ((UCPage)d);
            page.SinglePersonView.Visibility = ((bool)e.NewValue) ? Visibility.Visible : Visibility.Collapsed;
            page.NameView.Visibility = ((bool)e.NewValue) ? Visibility.Collapsed : Visibility.Visible;
        }

        #region 按钮事件
        /// <summary>
        /// 按钮事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void IBClick(object sender, RoutedEventArgs e)
        {
            var btn = sender as IconButton;
            var tag = btn.Tag as string;
            switch (tag)
            {
                case "echo":
                    ucTablet.PenlineEcho();
                    break;
                case "enlarge":
                    ucTablet.Zoom(1.25);
                    break;
                case "narrow":
                    ucTablet.Zoom(0.8);
                    break;
            }
        }
        #endregion

        #region 加载用户数据和题的信息
        /// <summary>
        /// 加载用户数据和题的信息
        /// </summary>
        /// <param name="studentId"></param>
        /// <param name="questionRecordId"></param>
        private void UpdateData(string exercise_record_id, long questionId)
        {
            var student = APP.StudySession.GetStudyStudent(StudentId);
            var studentView = new ViewModels.StudentView(student);

            var questionRecord = APP.IDatas.ErPaperPracticeRecordQuestionSealUp
                .Where(m => m.paper_practice_record_id == exercise_record_id && m.source_question_id == questionId)
                .Select(m => new { m.first_step_stem, m.start_practice_time })
                .FirstOrDefault();

            mPageData.StudentId = StudentId;
            mPageData.Name = studentView.Name;
            mPageData.Face = studentView.Face;
            if (questionRecord != null)
            {
                mPageData.QuestionTitle = questionRecord.first_step_stem;
            }
            if (this.IsShowAnswer)
            {
                var mButtonAnswer = APP.IDatas.ErStudentButtonAnswerOriginalRecord
                    .Where(m => m.student_id == this.StudentId && m.exercise_record_id == exercise_record_id && m.question_id == questionId && m.step_number == 1)
                    .Select(m => new
                    {
                        m.is_submit,
                        m.button_item,
                        m.create_time,
                        m.step_number
                    }).OrderBy(m => m.create_time).ToList();

                if (mButtonAnswer.Count > 0)
                {
                    var lastResult = mButtonAnswer.Where(m => m.is_submit).OrderByDescending(m => m.create_time).Select(m => new { m.button_item, m.create_time }).FirstOrDefault();
                    if (lastResult != null)
                    {
                        var lastTime = (lastResult.create_time.Value - questionRecord.start_practice_time.Value).ToString(@"m'\''s'\'\''");
                        mPageData.IsSubmitAnswerText = $"提交答案：{lastResult.button_item}，总共用时：" + lastTime;
                    }
                    else
                    {
                        mPageData.IsSubmitAnswerText = "提交答案：未提交";
                    }
                    var submits = mButtonAnswer.Where(m => m.is_submit).OrderBy(m => m.create_time).ToList();
                    var list = new List<string>();
                    for (var i = 0; i < submits.Count; i++)
                    {
                        var item = submits[i];
                        var lastTime = (item.create_time.Value - questionRecord.start_practice_time.Value).ToString(@"m'\''s'\'\''");
                        list.Add($"第{MSUtils.NumberToChinese(i + 1)}次提交答案：用时{lastTime}");
                    }
                    mPageData.AnswerText = list.ToJoin("；");
                }
                else
                {
                    mPageData.IsSubmitAnswerText = "提交答案：未提交";
                    mPageData.AnswerText = "未做题";
                }
            }
        }
        #endregion

        #region 获取答题结果
        /// <summary>
        /// 获取答题结果
        /// </summary>
        private void LoadAnswerResult()
        {
        }
        #endregion

        /// <summary>
        /// 加载学生历史笔记
        /// </summary>
        /// <param name="practiceRecordId">练习卷ID</param>
        /// <param name="questionId">题ID</param>
        internal void LoadHistoryHandwriting(string practiceRecordId, string questionRecordId, long questionId)
        {
            UpdateData(practiceRecordId, questionId);

            //加载笔迹
            var handwrites = APP.IDatas.ErStudentHandwriteAnswerOriginalRecord
               .Where(m => m.student_id == this.StudentId && m.exercise_record_id == practiceRecordId && m.question_id == questionId)
               .OrderBy(m => m.create_time)
               .Select(m => m.handwrite)
               .ToList();

            if (handwrites.Count > 0)
            {
                var list = handwrites.ConvertAll(m =>
                {
                    var item = Helpers.JsonHelper.ToObject<Packs.Pendot>(m);
                    return new PenPoint(item);
                });
                ucTablet.SetHistoryHandwriting(list);
            }
        }
    }
}
