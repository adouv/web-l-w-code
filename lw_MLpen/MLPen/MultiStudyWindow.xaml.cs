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
using MLPen.ApiModels;
using MLPen.Controls;
using MLPen.ModernUI.Windows.UI;
using MLPen.ViewModels;

namespace MLPen
{
    /// <summary>
    /// MultiStudyWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MultiStudyWindow : Window
    {
        #region 页面数据
        public class PageData : NotifyProperty
        {
            private bool _IsShowStem;
            private int _Rows;
            private int _Columns;
            private int _Screen;
            private int _PageIndex = 1;
            private int _PageCount = 0;
            public bool IsShowStem { get { return _IsShowStem; } set { _IsShowStem = value; this.Notify(x => x.IsShowStem); } }
            public int Rows { get { return _Rows; } set { _Rows = value; this.Notify(x => x.Rows); } }
            public int Columns { get { return _Columns; } set { _Columns = value; this.Notify(x => x.Columns); } }
            public int Screen { get { return _Screen; } set { _Screen = value; this.Notify(x => x.Screen); } }
            public int PageIndex { get { return _PageIndex; } set { _PageIndex = value; this.Notify(x => x.PageIndex); } }
            public int PageCount { get { return _PageCount; } set { _PageCount = value; this.Notify(x => x.PageCount); } }
        }
        /// <summary>
        /// 页面数据
        /// </summary>
        public PageData mPageData;
        #endregion

        /// <summary>
        /// 当前所有学生
        /// </summary>
        private List<Student> Students;

        public MultiStudyWindow()
        {
            InitializeComponent();
            this.Students = APP.StudySession.GetStudyStudents();
            mPageData = new PageData()
            {
                Rows = 2,
                Columns = 2,
                Screen = 4,
                IsShowStem = true,
                PageIndex = 1,
                PageCount = 1
            };
            this.DataContext = mPageData;

            Closed += (s, e) => { ClearAllPage(); };
        }

        void ClearAllPage()
        {
            UCPageLayout.Children.Clear();
        }


        private void LoadStudent()
        {
            var pageSize = mPageData.Screen;
            var totalRecord = this.Students.Count;
            mPageData.PageCount = (int)Math.Floor((totalRecord * 1.0 + pageSize * 1.0 - 1.0) / pageSize);

            //刷新按钮状态
            this.btnPrev.IsEnabled = mPageData.PageIndex > 1;
            this.btnNext.IsEnabled = mPageData.PageCount > 1 && mPageData.PageIndex < mPageData.PageCount;

            //调整布局
            ClearAllPage();
            for (var i = 0; i < pageSize; i++)
            {
                var index = ((mPageData.PageIndex - 1) * mPageData.Screen) + i;
                if (index >= totalRecord) break;

                var user = Students[index];
                var item = new UCPage()
                {
                    DataContext = mPageData,
                    StudentId = user.id,
                    Margin = new Thickness(10),
                    IsShowStem = false
                };
                item.SetBinding(UCPage.IsShowStemProperty, new Binding("IsShowStem") { Source = mPageData });
                UCPageLayout.Children.Add(item);
            };
        }

        /// <summary>
        /// 关闭窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void CloseClick(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        /// <summary>
        /// 学生选择
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void StudentSelectClick(object sender, RoutedEventArgs e)
        {
            var win = new StudentSelectWindow();
            if (win.ShowDialog() == true)
            {

            }
        }

        private void ScreenChange(object sender, RoutedEventArgs e)
        {
            switch (this.mPageData.Screen)
            {
                case 1:
                    this.mPageData.Rows = 1;
                    this.mPageData.Columns = 1;
                    break;
                case 2:
                    this.mPageData.Rows = 1;
                    this.mPageData.Columns = 2;
                    break;
                case 4:
                    this.mPageData.Rows = 2;
                    this.mPageData.Columns = 2;
                    break;
            }
            LoadStudent();
        }

        #region 分页事件
        /// <summary>
        /// 分页事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void PageClick(object sender, RoutedEventArgs e)
        {
            var btn = sender as IconButton;
            switch ((string)btn.Tag)
            {
                case "prev":
                    mPageData.PageIndex--;
                    break;
                case "next":
                    mPageData.PageIndex++;
                    break;
            }
            LoadStudent();
        }
        #endregion

        #region 加载所有学生的笔迹
        /// <summary>
        /// 加载所有学生的笔迹
        /// </summary>
        /// <param name="practiceRecordId"></param>
        /// <param name="questionId"></param>
        internal void loadHistoryHandwritingForQuestion(string practiceRecordId, string questionId)
        {

        }
        #endregion
    }
}
