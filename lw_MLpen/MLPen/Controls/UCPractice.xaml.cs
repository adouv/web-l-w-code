using MLPen.Helpers;
using MLPen.Repository.Entitys;
using MLPen.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
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
    /// UCPractice.xaml 的交互逻辑
    /// </summary>
    public partial class UCPractice : UserControl
    {
        #region 变量
        private ObservableCollection<ViewModels.Classes> mClasses = new ObservableCollection<ViewModels.Classes>();
        private ObservableCollection<ViewModels.StudentView> mStudentViews = new ObservableCollection<ViewModels.StudentView>();

        private JSObject jsObject;
        /// <summary>
        /// 当前班级
        /// </summary>
        private ViewModels.Classes mCurrentClasses;
        /// <summary>
        /// 当前选择的练习卷
        /// </summary>
        private Models.ErPaperPracticeRecordModel.PracticeModel mPaperPractice;
        private string exerciseRecordId;
        private string questionId;
        private DispatcherTimer mOrderStudentTimer = new DispatcherTimer();
        private bool IsOrderStudent = false;

        public class PageData : NotifyProperty
        {
            private string _HeaderText;
            private string _PracticeTitle;
            private bool _IsPractice;

            /// <summary>
            /// 头部文本
            /// </summary>
            public string HeaderText { get { return _HeaderText; } set { _HeaderText = value; this.Notify(m => m.HeaderText); } }
            /// <summary>
            /// 练习卷标题
            /// </summary>
            public string PracticeTitle { get { return _PracticeTitle; } set { _PracticeTitle = value; this.Notify(m => m.PracticeTitle); } }
            /// <summary>
            /// 是否已选择练习卷
            /// </summary>
            public bool IsPractice { get { return _IsPractice; } set { _IsPractice = value; this.Notify(m => m.IsPractice); } }
        }
        private PageData mPageData;
        #endregion

        public UCPractice()
        {
            InitializeComponent();
            mPageData = new PageData() { HeaderText = "加载中..." };
            this.DataContext = mPageData;
            this.jsObject = new JSObject(this);
            this.mOrderStudentTimer.Interval = TimeSpan.FromSeconds(1.5);
            Loaded += (s, e) =>
            {
                initEvents();
                initDatas();
            };
        }

        #region 初始化事件
        private void initEvents()
        {
            //开始答题事件
            this.btnPractice.Click += StartStudy;
            this.btnSelectPaper.Click += (s, e) =>
            {
                this.dialogSelectPractice();
            };
            this.btnPaper.Click += (s, e) =>
            {
                this.dialogPaper();
            };
            this.selectHistory.Click += (s, e) =>
            {
                this.dialogSelectHistoryPractice();
            };
            PenController.Instance.HandlerPenStatus += PenStautsChange;

            this.mOrderStudentTimer.Tick += (s, e) => { ReOrderStudentList(); };
            Unloaded += (s, e) =>
            {
                this.mOrderStudentTimer.Stop();
            };
        }
        #endregion

        #region 初始化数据
        /// <summary>
        /// 初始化数据
        /// </summary>
        private void initDatas()
        {
            ICUser.ItemsSource = mStudentViews;
            IClasses.ItemsSource = mClasses;
            ClassesListView.ItemsSource = mClasses;
        }
        #endregion

        #region 页面事件
        /// <summary>
        /// 显示更新的班级弹出层
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ShowClassesMore(object sender, RoutedEventArgs e)
        {
            popup.IsOpen = true;
        }
        /// <summary>
        /// 表表班级切换事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ClassesChange(object sender, RoutedEventArgs e)
        {
            var item = mClasses.Where(m => m.IsChecked).FirstOrDefault();
            if (item != null)
            {
                loadStudent(item);
                ClassesListView.SelectedIndex = mClasses.IndexOf(item);
            }
        }
        /// <summary>
        /// 弹出层班级切换事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ClassesListViewChange(object sender, SelectionChangedEventArgs e)
        {
            var item = ClassesListView.SelectedItem as ViewModels.Classes;
            if (item != null)
            {
                item.IsChecked = true;
            }
        }
        #endregion

        #region 重新加载班级以及学生
        /// <summary>
        /// 重新加载班级以及学生
        /// </summary>
        internal void ReloadClasses()
        {
            mPageData.HeaderText = "加载中...";
            mClasses.Clear();
            mStudentViews.Clear();
            loadClasses();
        }
        #endregion

        #region 加载班级
        /// <summary>
        /// 加载班级
        /// </summary>
        private void loadClasses()
        {
            this.UIAsync(m =>
            {
                var api = new Api.ApiClient();
                //获取登录讲师所在园区的班级列表
                var result = api.OrganizationTeacherGardenClasses(APP.StudySession.GardenId, APP.StudySession.Account.accountId);
                if (result.flag)
                {
                    this.UICall(list =>
                    {
                        foreach (var item in list)
                        {
                            mClasses.Add(new ViewModels.Classes(item));
                        }
                        if (list.Count > 0)
                        {
                            ClassesListView.SelectedIndex = 0;
                            loadStudent(mClasses[0]);
                        }
                        else
                        {
                            mPageData.HeaderText = "没有绑定任何班级";
                            EmptyBind(true);
                        }
                    }, result.data);
                }
                else
                {
                    this.UICall(() =>
                    {
                        this.ShowMessageInformation(result.msg);
                    });
                }
            });
        }
        #endregion

        #region 加载学生
        /// <summary>
        /// 加载学生
        /// </summary>
        /// <param name="classes"></param>
        private void loadStudent(ViewModels.Classes classes)
        {
            mCurrentClasses = classes;
            mPageData.HeaderText = "加载中...";
            mStudentViews.Clear();

            this.UIAsync(m =>
            {
                var api = new Api.ApiClient();
                var result = api.StudentClassStudents(APP.StudySession.GardenId, classes.ClassId, null);
                if (result.flag)
                {
                    this.UICall(list =>
                    {
                        APP.StudySession.AllStudents = list;
                        mPageData.HeaderText = $"班主任：{classes.TeacherName}   学生人数：{list.Count}人";
                        foreach (var item in list)
                        {
                            mStudentViews.Add(new ViewModels.StudentView(item)
                            {
                                IsOnline = PenController.Instance.GetPenStatus(item.id).IsOnline,
                                IsSelected = true
                            });
                        }
                        refreshOnlineCount();
                        EmptyBind(list.Count == 0);
                    }, result.data);
                }
                else
                {
                    this.UICall(() =>
                    {
                        this.ShowMessageInformation(result.msg);
                    });
                }
            });
        }
        /// <summary>
        /// 调整学生顺序
        /// </summary>
        private void ReOrderStudentList()
        {
            var list = new List<ViewModels.StudentView>();
            list.AddRange(mStudentViews);
            lock (mStudentViews)
            {
                mStudentViews.Clear();
                foreach (var item in list.OrderByDescending(m => m.IsOnline))
                {
                    mStudentViews.Add(item);
                }
            }
            this.mOrderStudentTimer.Stop();
        }
        #endregion

        #region 头像选择事件
        /// <summary>
        /// 头像选择事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FaceSelectedChange(object sender, RoutedEventArgs e)
        {
            RefreshPracticeButton();
            if (btnPractice.IsEnabled)
            {
                btnPractice.ToolTip = null;
            }
            else
            {
                btnPractice.ToolTip = "请先选择要参加反馈练习的学生";
            }
        }
        #endregion

        #region 刷新是否可以开始答题
        /// <summary>
        /// 刷新是否可以开始答题
        /// </summary>
        private void RefreshPracticeButton()
        {
            btnPractice.IsEnabled = mPageData.IsPractice && mStudentViews.Where(m => m.IsSelected && m.IsOnline).Any();
        }
        #endregion

        #region 开始答题-进入学习页面
        /// <summary>
        /// 开始答题-进入学习页面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void StartStudy(object sender, RoutedEventArgs e)
        {
            if (!mPageData.IsPractice) return;
            btnPractice.Button("loading", "正在创建练习记录");
            this.UIAsync(win =>
            {
                //设置正在参与的学生
                var studentIds = this.mStudentViews.Where(m => m.IsOnline && m.IsSelected).Select(m => m.StudentId).ToList();

                var api = new Api.ApiClient();
                var result = api.AcademicCurrent(APP.StudySession.GardenId);
                if (result.flag)
                {
                    var dbResult = CreatePracticeRecord(studentIds, result.data);
                    if (dbResult.flag)
                    {
                        APP.StudySession.StartStudy(studentIds, mPaperPractice.paper_id.Value, dbResult.data);
                        this.UICall(() =>
                        {
                            btnPractice.Button("reset");
                            StudyWindow window = new StudyWindow();
                            window.Show();
                        });
                    }
                    else
                    {
                        this.UICall(() => { this.ShowMessageError(dbResult.msg); btnPractice.Button("reset"); });
                    }
                }
                else
                {
                    this.UICall(() => { this.ShowMessageError("获取学年失败"); btnPractice.Button("reset"); });
                }
            });
        }
        #endregion
        #region 开始答题-插入习题练习记录表
        private MSResult<string> CreatePracticeRecord(List<long> studentIds, ApiModels.Academic.Current currentAcademic)
        {
            var students = APP.StudySession.AllStudents.Where(m => studentIds.Any(c => m.id == c)).ToList();
            return APP.ISQLs.DoTrans(trans =>
            {
                //插入习题练习记录表
                var _PaperPracticeRecordID = Guid.NewGuid().ToUUID();
                trans.Insert(new ErPaperPracticeRecord()
                {
                    id = _PaperPracticeRecordID,
                    paper_id = mPaperPractice.paper_id,
                    paper_name = mPaperPractice.paper_name,
                    paper_type = mPaperPractice.paper_type,
                    paper_question_total_number = mPaperPractice.paper_question_total_number ?? 0,
                    garden_id = APP.StudySession.GardenId,
                    system_academic_year_id = currentAcademic.id,
                    system_academic_year = currentAcademic.year,
                    academic_name = currentAcademic.name,
                    class_id = mCurrentClasses.ClassId,
                    class_name = mCurrentClasses.ClassName,
                    grade_id = mCurrentClasses.GradeId,
                    grade_name = mCurrentClasses.GradeName,
                    teacher_id = APP.StudySession.Account.accountId,
                    teacher_name = APP.StudySession.Account.displayName,
                    subject_code = mPaperPractice.subject_code,
                    create_time = DateTime.Now,
                    start_time = DateTime.Now,
                    period = 1,
                    answer_question_status = 0,
                    self_judgment_status = 0,
                    week_day = 1
                });
                //将参与本次答题的所有学生信息进行封存
                var studentList = new List<ErPaperPracticeRecordStudentSealUp>();
                foreach (var student in students)
                {
                    studentList.Add(new ErPaperPracticeRecordStudentSealUp()
                    {
                        id = Guid.NewGuid().ToUUID(),
                        exercise_record_id = _PaperPracticeRecordID,
                        student_id = student.id,
                        student_name = student.name,
                        garden_id = student.gardenId,
                        grade_id = student.gradeId,
                        grade_name = student.gradeName,
                        class_id = student.classId,
                        class_name = student.className,
                        student_head_portrait = student.imgUrl,
                        student_sex = student.gender,
                        student_number = student.number
                    });
                }
                trans.InsertRange(studentList);
                return _PaperPracticeRecordID;
            });
        }
        #endregion


        private void dialogSelectPractice()
        {
            var chorme = new ChormeWindow();
            chorme.ChromeMain.SetJSObject("lwmain", jsObject);
            chorme.IsToolBar = false;
            chorme.Title = "练习卷选择";
            chorme.Width = 1030;
            chorme.Height = 630;
            chorme.Address = MSConfig.link_address_lw_select_paper;
            chorme.ShowDialog();
            if (mPaperPractice != null)
            {
                this.mPageData.PracticeTitle = mPaperPractice.paper_name;
            }
        }

        private void dialogSelectHistoryPractice()
        {
            var chorme = new ChormeWindow();
            chorme.ChromeMain.SetJSObject("lwmain", jsObject);
            chorme.IsToolBar = true;
            chorme.Title = "历史练习回看";
            chorme.Width = 1366;
            chorme.Height = 768;
            chorme.Address = MSConfig.link_address_lw_practice_record;
            chorme.ShowDialog();
            //this.textPracticePaperName.Text = practicePaperName;
        }

        private void dialogPaper()
        {
            var chorme = new ChormeWindow();
            chorme.ChromeMain.SetJSObject("lwmain", jsObject);
            chorme.IsToolBar = true;
            chorme.Title = "练习卷管理";
            chorme.Width = 1366;
            chorme.Height = 790;
            chorme.Address = MSConfig.link_address_lw_paper_manager;
            chorme.ShowDialog();
            //this.textPracticePaperName.Text = practicePaperName;
        }

        #region JSObject
        class JSObject
        {
            private UCPractice mUCPractice;
            public JSObject(UCPractice uc)
            {
                mUCPractice = uc;
            }

            /// <summary>
            /// 从前端接收选择的试卷信息。目前可以接收到信息，但是无法传递给studyWindow跟UcPractice
            /// </summary>
            /// <param name="paperId">试卷Id</param>
            /// <param name="title">试卷名称</param>
            /// <param name="paperType">试卷类型</param>
            /// <param name="subjectCode">试卷学科</param>
            public void selectPaper(string paperId, string title, string paperType, string subjectCode)
            {
                mUCPractice.mPageData.IsPractice = true;
                mUCPractice.mPaperPractice = new Models.ErPaperPracticeRecordModel.PracticeModel()
                {
                    paper_id = paperId.TryParse<int>(),
                    paper_name = title,
                    paper_type = paperType.TryParse<int>(),
                    subject_code = subjectCode
                };
                mUCPractice.UICall(() =>
                {
                    mUCPractice.RefreshPracticeButton();
                });
            }

            public void historyPaper(string exerciseRecordId)
            {
                mUCPractice.exerciseRecordId = exerciseRecordId;
                mUCPractice.UICall(() =>
                {
                    var chorme = new ChormeWindow();
                    chorme.ChromeMain.SetJSObject("lwmain", this);
                    chorme.WindowState = WindowState.Maximized;
                    chorme.IsToolBar = false;
                    chorme.Address = MSConfig.link_address_lw_record_all;
                    chorme.ShowDialog();
                });
            }

            public void historyQuestion(string exerciseRecordId, string questionId)
            {
                mUCPractice.exerciseRecordId = exerciseRecordId;
                mUCPractice.questionId = questionId;
                mUCPractice.UICall(() =>
                {
                    var chorme = new ChormeWindow();
                    chorme.ChromeMain.SetJSObject("lwmain", this);
                    chorme.WindowState = WindowState.Maximized;
                    chorme.IsToolBar = false;
                    chorme.Address = MSConfig.link_address_lw_record_single;
                    chorme.ShowDialog();
                });
            }

            /// <summary>
            /// 全班单道题的结果统揽，echart图部分接口
            /// </summary>
            /// <param name="practiceRecordId">练习卷Id</param>
            /// <param name="questionId">习题Id</param>
            /// <returns></returns>
            public string oneQuestionClassStatistics()
            {
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                Dictionary<string, object> dic = allStudentQuestionStatisticsService.oneQuestionRecordStatistics(mUCPractice.exerciseRecordId, mUCPractice.questionId);
                return MLPen.Helpers.JsonHelper.ToJSON(dic);
            }

            /// <summary>
            /// 单道题全班学生作答记录查询接口
            /// </summary>
            /// <param name="studentAnswer"></param>
            /// <param name="studentScore"></param>
            /// <param name="studentIsRight"></param>
            /// <returns></returns>
            public string oneQuestionOriginalRecordList(string studentAnswer, string studentScore, string studentIsRight)
            {
                double? score = null;
                if (studentScore != null && !studentScore.Equals("")) score = double.Parse(studentScore);
                Boolean? isRight = null;
                if (studentIsRight != null && !studentIsRight.Equals("")) isRight = Boolean.Parse(studentIsRight);
                PracticeRecordStatisticsService practiceRecordStatisticsService = new PracticeRecordStatisticsService();
                var result = practiceRecordStatisticsService.OneQuestionOriginalRecordList(mUCPractice.exerciseRecordId, mUCPractice.questionId, studentAnswer, score, isRight);

                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单次练习答题统计柱状图 试题维度
            /// </summary>
            /// <param name="practiceRecordId">练习卷Id</param>
            /// <returns></returns>
            public string OnePracticeStatistics()
            {
                PracticeRecordStatisticsService practiceRecordStatisticsService = new PracticeRecordStatisticsService();
                Dictionary<string, object> result = practiceRecordStatisticsService.practiceRecordStatistics(mUCPractice.exerciseRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单次练习答题统计柱状图 知识点维度
            /// </summary>
            /// <param name="practiceRecordId">练习卷Id</param>
            /// <returns></returns>
            public string OnePracticeKnowledgeStatistics()
            {
                AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                var result = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeStatistics(mUCPractice.exerciseRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单次练习答题基本情况统计 试题维度
            /// </summary>
            /// <param name="practiceRecordId"></param>
            /// <returns></returns>
            public string OnePracticeBaseInfo()
            {
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                var result = allStudentQuestionStatisticsService.OnePracticeQuestionBaseInfo(mUCPractice.exerciseRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }


            /// <summary>
            /// 单次练习答题基本情况统计 知识点维度
            /// </summary>
            /// <returns></returns>
            public string OnePracticeKnowledgeBaseInfo()
            {
                AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                var result = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeBaseStatistics(mUCPractice.exerciseRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);

            }

            /// <summary>
            /// 单次练习学生答题结果统计 
            /// </summary>
            /// <returns></returns>
            public string OnePracticeStudentOriginalStatistics()
            {
                SingleStudentPracticeStatisticsService studentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                var result = studentPracticeStatisticsService.OnePracticeStudentOriginalStatistics(mUCPractice.exerciseRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单个学生试卷作答分析
            /// </summary>
            public void AnalysisSingleStudentPracticeRecords(string exerciseRecordId)
            {
                SingleStudentPracticeStatisticsService singleStudentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                singleStudentPracticeStatisticsService.GetSingleStudentPracticeRecords(exerciseRecordId);
            }


            /// <summary>
            /// 更新全部学生单题作答分析
            /// </summary>
            public void UpdateAllStudentQuestionRecord(string exerciseRecordId)
            {
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                allStudentQuestionStatisticsService.UpdateAllStudentQuestionRecord(exerciseRecordId);
            }

            /// <summary>
            /// 更新全部学生试卷作答分析
            /// </summary>
            public void SaveAllStudentPracticeRecord(string exerciseRecordId)
            {
                AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                allStudentPracticeStatisticsService.SaveAllStudentPracticeRecord(exerciseRecordId);
            }

            /// <summary>
            /// 更新知识点作答分析
            /// </summary>
            public void SaveAllStudentKnowledgeRecord(string exerciseRecordId)
            {
                AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                allStudentKnowledgeStatisticsService.SaveAllStudentKnowledgeRecord(exerciseRecordId);
            }

            /// <summary>
            /// 单题
            /// </summary>
            /*public string SingleQuestionChartStatistics(string practiceRecordId, string questionId)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                Dictionary<string, object> dashboardDic = allStudentQuestionStatisticsService.DashboardChartStatistics(practiceRecordId, long.Parse(questionId));
                Dictionary<string, object> funnelFigureDic = allStudentQuestionStatisticsService.FunnelFigureChartStatistics(practiceRecordId, long.Parse(questionId));
                SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                List<object> bubbleDiagramList = singleStudentQuestionStatisticsService.BubbleDiagramChartStatistics(practiceRecordId, long.Parse(questionId));
                result.Add("dashboard", dashboardDic);
                result.Add("funnelFigure", funnelFigureDic);
                result.Add("bubbleDiagram", bubbleDiagramList);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }*/

            /// <summary>
            /// 练习历史记录标题
            /// </summary>
            public string PracticeResultTitle()
            {
                AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                var result = allStudentPracticeStatisticsService.PracticeResultTitle(mUCPractice.exerciseRecordId);
                string s = MLPen.Helpers.JsonHelper.ToJSON(result);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            public string TableChart(int type)
            {
                SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                var result = singleStudentQuestionStatisticsService.TableChart(mUCPractice.exerciseRecordId, mUCPractice.questionId.ToString(), type);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单题
            /// </summary>
            public string SingleDashBoardChartStatistics(string practiceRecordId, string questionId)
            {
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                Dictionary<string, object> result = allStudentQuestionStatisticsService.DashboardChartStatistics(practiceRecordId, questionId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单题
            /// </summary>
            public string SingleFunnelFigureChartStatistics(string practiceRecordId, string questionId)
            {
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                Dictionary<string, object> result = allStudentQuestionStatisticsService.FunnelFigureChartStatistics(practiceRecordId, questionId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 单题
            /// </summary>
            public string SingleBubbleDiagramChartStatistics(string practiceRecordId, string questionId)
            {
                SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                List<object> result = singleStudentQuestionStatisticsService.BubbleDiagramChartStatistics(practiceRecordId, questionId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 多题
            /// </summary>
           /* public string PracticeChartStatistics(string practiceRecordId, int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                Dictionary<string, object> dashboardDic = allStudentPracticeStatisticsService.AllDashboardStatistics(practiceRecordId, type);
                Dictionary<string, object> funnelFigureDic = allStudentPracticeStatisticsService.FunnelFigureChartStatistics(practiceRecordId, type);
                SingleStudentPracticeStatisticsService singleStudentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                List<object> bubbleDiagramList = singleStudentPracticeStatisticsService.AllBubbleDiagramChartStatistics(practiceRecordId, type);
                result.Add("dashboard", dashboardDic);
                result.Add("funnelFigure", funnelFigureDic);
                result.Add("bubbleDiagram", bubbleDiagramList);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }*/

            /// <summary>
            /// 多题
            /// </summary>
            public string AllDashBoardChartStatistics(int status, int type)
            {
                if (status == 0)
                {
                    AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                    Dictionary<string, object> result = allStudentPracticeStatisticsService.AllDashboardStatistics(mUCPractice.exerciseRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    Dictionary<string, object> result = allStudentQuestionStatisticsService.DashboardChartStatistics(mUCPractice.exerciseRecordId, mUCPractice.questionId);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
            }

            /// <summary>
            /// 多题
            /// </summary>
            public string AllFunnelFigureChartStatistics(int status, int type)
            {
                if (status == 0)
                {
                    AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                    Dictionary<string, object> result = allStudentPracticeStatisticsService.FunnelFigureChartStatistics(mUCPractice.exerciseRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    Dictionary<string, object> result = allStudentQuestionStatisticsService.FunnelFigureChartStatistics(mUCPractice.exerciseRecordId, mUCPractice.questionId);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }

            }

            /// <summary>
            /// 多题
            /// </summary>
            public string AllBubbleDiagramChartStatistics(int status, int type)
            {

                if (status == 0)
                {
                    SingleStudentPracticeStatisticsService singleStudentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                    List<object> result = singleStudentPracticeStatisticsService.AllBubbleDiagramChartStatistics(mUCPractice.exerciseRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                    List<object> result = singleStudentQuestionStatisticsService.BubbleDiagramChartStatistics(mUCPractice.exerciseRecordId, mUCPractice.questionId);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
            }

            /// <summary>
            /// 五彩琴键图
            /// </summary>
            public string MultiDimensionalChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.MultiDimensionalChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.MultiDimensionalChartStatistics(mUCPractice.exerciseRecordId);
                }

                String res = MLPen.Helpers.JsonHelper.ToJSON(result);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 复合柱形图
            /// </summary>
            public string MultiBarChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.MultiBarChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.MultiBarChartStatistics(mUCPractice.exerciseRecordId);
                }
                string s = MLPen.Helpers.JsonHelper.ToJSON(result);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 线数走势图
            /// </summary>
            public string LineChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.LineChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.LineChartStatistics(mUCPractice.exerciseRecordId);
                }

                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 实力散点图
            /// </summary>
            public string ScatterDiagramChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.ScatterDiagramChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.ScatterDiagramChartStatistics(mUCPractice.exerciseRecordId);
                }
                string s = MLPen.Helpers.JsonHelper.ToJSON(result);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 策略雷达
            /// </summary>
            public string RadarChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.RadarChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.RadarChartStatistics(mUCPractice.exerciseRecordId);
                }
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 认知诊断指数
            /// </summary>
            public string CognitiveIndexChartStatistics(int type)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                if (type == 1)
                {
                    AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                    result = allStudentKnowledgeStatisticsService.CognitiveIndexChartStatistics(mUCPractice.exerciseRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.CognitiveIndexChartStatistics(mUCPractice.exerciseRecordId);
                }
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 获得练习记录list
            /// </summary>
            public string GetPracticeRecordList(int? gardenId, int? gradeId, int? type, string keyWord, int? noPage, int? size)
            {
                PracticeRecordStatisticsService practiceRecordStatisticsService = new PracticeRecordStatisticsService();
                Dictionary<string, object> result = practiceRecordStatisticsService.List(gardenId, gradeId, type, keyWord, noPage, size);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }
            /// <summary>
            /// 启动word进程
            /// </summary> 
            public int startUpWordProcess()
            {
                int retVal = 0;
                ControlWordPanelService controlWordPanelService = new ControlWordPanelService();
                controlWordPanelService.updateDisplayFlagToShow();
                Thread thread = new Thread(new ThreadStart(delegate ()
                {
                    System.Windows.Forms.OpenFileDialog file = new System.Windows.Forms.OpenFileDialog();
                    System.Windows.Forms.DialogResult result = file.ShowDialog();
                    if (System.Windows.Forms.DialogResult.OK == result)
                    {
                        ProcessStartInfo startInfo = new ProcessStartInfo();
                        startInfo.FileName = "WINWORD.EXE";
                        startInfo.Arguments = file.FileName;
                        try
                        {
                            Process.Start(startInfo);
                            retVal = 1;
                        }
                        catch (Exception e)
                        {
                            MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "错误", "Cannot start Microsoft Word, please make sure it is installed");
                        }
                    }
                }));
                thread.TrySetApartmentState(ApartmentState.STA);
                thread.Start();
                thread.Join();
                return retVal;
            }
            /// <summary>
            /// 下载并打开word
            /// <param name="wordPic">word文件路径</param>
            /// <param name="wordName">word文件名</param>
            /// </summary> 
            public int downloadAndOpenFile(string wordPic, string wordName)
            {
                System.Net.WebClient myWebClient = new System.Net.WebClient();
                string docDirectory = AppDomain.CurrentDomain.BaseDirectory + "docTempDirectory\\";
                if (false == System.IO.Directory.Exists(docDirectory))
                {
                    System.IO.Directory.CreateDirectory(docDirectory);

                }
                myWebClient.DownloadFile(MSConfig.host_lw_file_server_download + wordPic + "&name=" + wordName, docDirectory + wordName);
                ControlWordPanelService controlWordPanelService = new ControlWordPanelService();
                controlWordPanelService.updateDisplayFlagToShow();
                Thread thread = new Thread(new ThreadStart(delegate ()
                {
                    ProcessStartInfo startInfo = new ProcessStartInfo();
                    startInfo.FileName = "WINWORD.EXE";
                    startInfo.Arguments = docDirectory + wordName;
                    try
                    {
                        Process.Start(startInfo);
                    }
                    catch (Exception e)
                    {
                        MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "错误", "Cannot start Microsoft Word, please make sure it is installed");
                    }
                }));
                thread.TrySetApartmentState(ApartmentState.STA);
                thread.Start();
                thread.Join();

                return 1;
            }
            /// <summary>
            /// 获取本地客户端websocketUrl地址
            /// </summary>
            public string getwebsocketUrl()
            {
                return ClientSocket.getWebsocketUrl();
            }
            /// <summary>
            /// 关闭word应用
            /// </summary>
            public void stopWordProcess()
            {
                foreach (System.Diagnostics.Process p in System.Diagnostics.Process.GetProcessesByName("WINWORD"))
                {
                    p.Kill();
                }
            }
        }
        #endregion

        #region 没有任何绑定时，显示空数据
        /// <summary>
        /// 没有任何绑定时，显示空数据
        /// </summary>
        void EmptyBind(bool isEmtpy)
        {
            if (isEmtpy)
            {
                LayoutRight.Visibility = Visibility.Collapsed;
                EmptyView.Visibility = Visibility.Visible;
            }
            else
            {
                LayoutRight.Visibility = Visibility.Visible;
                EmptyView.Visibility = Visibility.Collapsed;
            }
        }
        #endregion

        #region 通信-刷新学生设备状态
        /// <summary>
        /// 刷新学生设备状态
        /// </summary>
        private void PenStautsChange(object sender, PenEvents.StatusEventArgs e)
        {
            var pen = sender as PenDevice;

            var item = mStudentViews.Where(m => m.StudentId == pen.StudentId).FirstOrDefault();
            if (item == null) return;

            item.IsOnline = e.PenStatus.IsOnline;

            refreshOnlineCount();
        }
        /// <summary>
        /// 刷新在线学生数量
        /// </summary>
        private void refreshOnlineCount()
        {
            this.mOrderStudentTimer.Start();

            this.UICall(() =>
            {
                RefreshPracticeButton();
                txtOnlineCount.Text = mStudentViews.Where(m => m.IsOnline).Count().ToString();
            });
        }
        #endregion
    }
}
