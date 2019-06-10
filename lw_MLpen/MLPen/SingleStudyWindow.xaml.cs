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
using MLPen.ApiModels;
using MLPen.ViewModels;

namespace MLPen
{
    /// <summary>
    /// SingleStudyWindow.xaml 的交互逻辑
    /// </summary>
    public partial class SingleStudyWindow : Window
    {
        /// <summary>
        /// 学生ID
        /// </summary>
        private long mStudentId { get; set; }
        /// <summary>
        /// 用户练习题列表
        /// </summary>
        private List<QuestionRecordItem> mQuestionRecordList { get; set; }
        /// <summary>
        /// 学生练习题记录
        /// </summary>
        public class QuestionRecordItem
        {
            /// <summary>
            /// 练习卷ID
            /// </summary>
            public string PracticeRecordID { get; set; }
            /// <summary>
            /// 练习题ID
            /// </summary>
            public string QuestionRecordID { get; set; }
            /// <summary>
            /// 题ID
            /// </summary>
            public long? QuestionID { get; set; }
        }

        #region 页面数据
        public class Pager : NotifyProperty
        {
            private int _PageNumber;
            private int _PageCount;
            /// <summary>
            /// 当前页索引
            /// </summary>
            public int PageIndex { get; set; }
            /// <summary>
            /// 当前页码
            /// </summary>
            public int PageNumber { get { return _PageNumber; } set { _PageNumber = value; this.Notify(x => x.PageNumber); } }
            /// <summary>
            /// 总页数
            /// </summary>
            public int PageCount { get { return _PageCount; } set { _PageCount = value; this.Notify(x => x.PageCount); } }
        }
        /// <summary>
        /// 页面数据
        /// </summary>
        public class PageData : NotifyProperty
        {
            private bool _IsShowStem;
            private bool _IsShowPager;
            private Pager _Pager = new Pager();
            /// <summary>
            /// 是否显示题干
            /// </summary>
            public bool IsShowStem { get { return _IsShowStem; } set { _IsShowStem = value; this.Notify(x => x.IsShowStem); } }
            /// <summary>
            /// 是否显示分页
            /// </summary>
            public bool IsShowPager { get { return _IsShowPager; } set { _IsShowPager = value; this.Notify(x => x.IsShowPager); } }
            /// <summary>
            /// 是否显示分页
            /// </summary>
            public Pager Pager { get { return _Pager; } set { _Pager = value; this.Notify(x => x.Pager); } }
        }
        private PageData mPageData = new PageData() { IsShowStem = true };
        ///// <summary>
        ///// 习题记录封存表ID
        ///// </summary>
        //public string QuestionRecordId { get; internal set; }
        #endregion

        private Controls.UCPage mUCPage;
        public SingleStudyWindow(long studentId)
        {
            InitializeComponent();
            this.mStudentId = studentId;
            this.DataContext = mPageData;
            Loaded += (s, e) =>
            {
                initEvents();

                mUCPage = new Controls.UCPage()
                {
                    DataContext = mPageData,
                    StudentId = studentId,
                    IsShowAnswer = true
                };
                mUCPage.SetBinding(Controls.UCPage.IsShowStemProperty, new Binding("IsShowStem")
                {
                    Source = this.DataContext
                });
                ucPageLayout.Children.Add(mUCPage);
            };
            Unloaded += (s, e) =>
            {
                ucPageLayout.Children.Clear();
            };

            this.Title = "个人笔迹回放";
        }

        #region 初始化事件绑定
        private void CloseClick(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
        private void initEvents()
        {
            btnPrev.Click += PrevPager;
            btnPrev.Click += NextPager;
        }
        private void PrevPager(object sender, RoutedEventArgs e)
        {
            if (mPageData.IsShowPager == false) return;
            mPageData.Pager.PageIndex--;
            RefreshPagerButton();
        }
        private void NextPager(object sender, RoutedEventArgs e)
        {
            if (mPageData.IsShowPager == false) return;
            mPageData.Pager.PageIndex++;
            RefreshPagerButton();
        }
        private void RefreshPagerButton()
        {
            btnPrev.IsEnabled = mPageData.IsShowPager && mPageData.Pager.PageIndex > 0;
            btnNext.IsEnabled = mPageData.IsShowPager && mPageData.Pager.PageIndex < mPageData.Pager.PageCount - 1;
            mPageData.Pager.PageNumber = mPageData.Pager.PageIndex + 1;

            ShowNext();
        }
        #endregion

        /// <summary>
        /// 加载试题历史笔记
        /// </summary>
        /// <param name="practiceRecordId"></param>
        /// <param name="questionId"></param>
        internal void loadHistoryHandwritingForQuestion(string practiceRecordId, long questionId)
        {

        }

        /// <summary>
        /// 加载学生历史笔记
        /// </summary>
        /// <param name="practiceRecordId"></param>
        /// <param name="studentId"></param>
        internal void LoadHistoryHandwriting(string practiceRecordId)
        {
            Loaded += (a, b) =>
            {
                mUCPage.PenLoaded += (s, e) =>
                {
                    this.UIAsync(() =>
                    {
                        mQuestionRecordList = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.Where(m => m.paper_practice_record_id == practiceRecordId).Select(m => new QuestionRecordItem()
                        {
                            QuestionRecordID = m.id,
                            QuestionID = m.source_question_id,
                            PracticeRecordID = m.paper_practice_record_id
                        }).ToList();

                        mPageData.IsShowPager = mQuestionRecordList.Count > 0;
                        if (mPageData.IsShowPager)
                        {
                            mPageData.Pager.PageIndex = 0;
                            mPageData.Pager.PageCount = MSUtils.GetPageCount(mQuestionRecordList.Count, 1);
                            this.UICall(RefreshPagerButton);
                        }
                        else
                        {
                            this.UICall(() =>
                            {
                                this.ShowMessageError("没有练习记录.");
                                this.Close();
                            });
                        }
                    });
                };
            };
            this.Show();
        }

        #region 切换下一题
        /// <summary>
        /// 切换下一题
        /// </summary>
        private void ShowNext()
        {
            var questionRecord = mQuestionRecordList.Skip(mPageData.Pager.PageIndex).Take(1).FirstOrDefault();
            mUCPage.LoadHistoryHandwriting(questionRecord.PracticeRecordID, questionRecord.QuestionRecordID, questionRecord.QuestionID ?? 0);
        }
        #endregion
    }
}
