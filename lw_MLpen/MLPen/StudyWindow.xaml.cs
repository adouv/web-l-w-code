using MLPen.ModernUI.Windows.UI;
using MLPen.Repository.Entitys;
using MLPen.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace MLPen
{
    /// <summary>
    /// StudyWindow.xaml 的交互逻辑
    /// </summary>
    public partial class StudyWindow : Window
    {
        #region 变量
        /// <summary>
        /// 习题列表
        /// </summary>
        private List<ApiModels.QuestionPractice> mQuestions = new List<ApiModels.QuestionPractice>();
        /// <summary>
        /// 学生按键缓存
        /// </summary>
        private List<PenKey> mButtonCaches = new List<PenKey>();
        /// <summary>
        /// 当前习题
        /// </summary>
        private ApiModels.QuestionPractice mQuestion;
        /// <summary>
        /// 练习题记录封存表ID
        /// </summary>
        public string QuestionRecordID { get; internal set; }
        /// <summary>
        /// 练习题索引
        /// </summary>
        private int mPageIndex = 0;
        /// <summary>
        /// 练习题页面
        /// </summary>
        private int mPageNum => mPageIndex + 1;
        /// <summary>
        /// 总页数（习题总数）
        /// </summary>
        private int mPageSize = 0;
        /// <summary>
        /// 当前第几阶段（1-一阶，2-二阶，3-三阶，4-四阶）
        /// </summary>
        private int mStepNumber = 1;
        /// <summary>
        /// 总共有多少个阶段
        /// </summary>
        private int mMaxStep = 2;
        ///// <summary>
        ///// 是否可以显示阶段操作面板
        ///// </summary>
        //private bool mIsShowStepPanel = false;
        /// <summary>
        /// 自判模式
        /// </summary>
        private string mSelfJudgmentMode;
        /// <summary>
        /// 自判满分值
        /// </summary>
        private int mSelfJudgmentScore;
        /// <summary>
        /// 默认缩放级别
        /// </summary>
        private double mScale = 0.0;
        /// <summary>
        /// 移动时间间隔
        /// </summary>
        private DateTime mMoveTime;
        /// <summary>
        /// 页面数据
        /// </summary>
        public class PageData : NotifyProperty
        {
            private string _QuestionStepText;
            private string _PagingInfo;
            private bool _IsShowNextStepButton;
            private bool _IsShowStep;

            public string StepText
            {
                get { return _QuestionStepText; }
                set { _QuestionStepText = value; this.Notify(m => m.StepText); }
            }
            /// <summary>
            /// 是否显示下一阶段操作按钮
            /// </summary>
            public bool IsShowNextStepButton
            {
                get { return _IsShowNextStepButton; }
                set { _IsShowNextStepButton = value; this.Notify(m => m.IsShowNextStepButton); }
            }
            /// <summary>
            /// 是否显示阶段面板
            /// </summary>
            public bool IsShowStep
            {
                get { return _IsShowStep; }
                set { _IsShowStep = value; this.Notify(m => m.IsShowStep); }
            }
            /// <summary>
            /// 当前正在答题/自判的信息
            /// </summary>
            public string PagingInfo
            {
                get { return _PagingInfo; }
                set { _PagingInfo = value; this.Notify(m => m.PagingInfo); }
            }
        }
        private PageData mPageData = new PageData();
        #endregion

        #region 初始化
        public StudyWindow()
        {
            InitializeComponent();
            this.jsObject = new JSObject(this);
            this.DataContext = mPageData;
            Loaded += (s, e) =>
            {
                init();
                initEvents();
                initQuestions();
            };
        }
        private void init()
        {
            Chrome.SetParent(this);
            var left = this.Width - ucTool.Width - ucTool.Margin.Right;
            var top = this.Height - ucTool.Height - ucTool.Margin.Bottom;
            ucTool.Margin = new Thickness(left, top, 0, 0);
            ucTool.HorizontalAlignment = HorizontalAlignment.Left;
            ucTool.VerticalAlignment = VerticalAlignment.Top;
            ucTool.SetWindow(this);
        }
        #endregion
        #region 初始化事件
        private Point oldPoint = new Point();
        private JSObject jsObject;
        /// <summary>
        /// 初始化事件
        /// </summary>
        private void initEvents()
        {
            this.ucTool.MouseLeftButtonDown += (s, e) =>
            {
                oldPoint = e.GetPosition(null);
                ucTool.Cursor = Cursors.Hand;
                mMoveTime = DateTime.Now;
                ucTool.CaptureMouse();
            };
            this.ucTool.MouseLeftButtonUp += (s, e) =>
            {
                ucTool.ReleaseMouseCapture();

                var maxWidth = this.Width;
                var maxHeight = this.Height;
                var margin = ucTool.Margin;

                if (margin.Left < 0)
                {
                    margin = new Thickness(0, margin.Top, 0, 0);
                }
                else if (margin.Left + ucTool.Width > maxWidth)
                {
                    margin = new Thickness(maxWidth - ucTool.Width, margin.Top, 0, 0);
                }
                if (margin.Top < 0)
                {
                    margin = new Thickness(margin.Left, 0, 0, 0);
                }
                else if (margin.Top + ucTool.Height > maxHeight)
                {
                    margin = new Thickness(margin.Left, maxHeight - ucTool.Height, 0, 0);
                }
                ucTool.Margin = margin;
            };
            this.ucTool.MouseMove += (s, e) =>
            {
                if (e.LeftButton == MouseButtonState.Pressed)
                {
                    if ((DateTime.Now - mMoveTime).TotalMilliseconds > 100)
                    {
                        double dx = e.GetPosition(null).X - oldPoint.X + ucTool.Margin.Left;
                        double dy = e.GetPosition(null).Y - oldPoint.Y + ucTool.Margin.Top;
                        ucTool.Margin = new Thickness(dx, dy, 0, 0);
                        oldPoint = e.GetPosition(null);
                    }
                }
            };
            this.ucTool.BeginQuestionClick += BeginQuestionClick;
            this.ucTool.EndQuestionClick += EndQuestionClick;
            this.ucTool.SelfJudgeStartClick += StartSelfJudgmentClick;
            this.ucTool.SelfJudgeEndClick += StopSelfJudgmentClick;
            this.ucTool.AnswerResultClick += ShowAnswerResult;
            this.ucTool.ExitAnswerClick += ExitAnswer;

            //答题反馈面板事件
            ucAnswerPanel.ClickAction += (s, e) =>
            {
                var btn = s as ButtonBase;
                var tag = btn.Tag as string;
                switch (tag)
                {
                    case "result"://打开：结果通览
                        {
                            dialogSingleStatistics();
                        }
                        break;
                    case "handwriting"://打开：笔迹统览
                        {
                            var msw = new MultiStudyWindow();
                            msw.ShowDialog();
                        }
                        break;
                }
            };
            ucAnswerPanel.HandlerFaceClick = HandlerFaceClick;
        }
        #endregion

        #region 反馈面板头像点击事件
        /// <summary>
        /// 反馈面板头像点击事件
        /// </summary>
        /// <param name="btn"></param>
        /// <param name="studentId"></param>
        private void HandlerFaceClick(FaceView btn, long studentId)
        {
            var ssw = new SingleStudyWindow(studentId);
            ssw.ShowDialog();
        }
        #endregion

        #region 更新加载提示
        /// <summary>
        /// 更新加载提示
        /// </summary>
        /// <param name="text"></param>
        private void UpdateLoadingText(string text)
        {
            this.UICall(m =>
            {
                Loading.Content = m;
            }, text);
        }
        #endregion

        #region 加载试题列表
        /// <summary>
        /// 加载试题列表
        /// </summary>
        private void initQuestions()
        {
            UpdateLoadingText("开始获取数据.");
            Loading.IsOpen = true;

            this.UIAsync(m =>
            {
                GetQuestionOfPracticePaper(result =>
                {
                    if (result.flag)
                    {
                        PenController.Instance.SendText("现已进入实时反馈练习模式，请做好答题准备。");
                        this.UICall(LoadQuestion);
                    }
                    else
                    {
                        this.UICall(() =>
                        {
                            this.ShowMessageError(result.msg);
                            this.Close();
                        });
                    }
                });
            });
        }
        #endregion

        #region 获取试卷下的习题列表
        /// <summary>
        /// 获取试卷下的习题列表
        /// </summary>
        /// <param name="callback"></param>
        private void GetQuestionOfPracticePaper(Action<MSResult> callback)
        {
            UpdateLoadingText("正在获取试卷习题.");
            var api = new Api.ApiClient();
            var result = api.QuestionOfPracticePaper(APP.StudySession.GardenId, APP.StudySession.PracticeId, m =>
            {
                this.mQuestions = m;
            });
            if (result.flag)
            {
                if (this.mQuestions.Count == 0)
                {
                    callback(MSResult.Init("该练习卷下没有任何习题."));
                }
                else
                {
                    this.mPageSize = this.mQuestions.Count; //总记录数
                    APP.IDatas.ErPracticeRecord.Update(m => m.id == APP.StudySession.PracticeRecordId, m => new ErPaperPracticeRecord()
                    {
                        paper_question_total_number = this.mPageSize
                    });
                    callback(MSResult.Init());
                }
            }
            else
            {
                callback(result);
            }
        }
        #endregion

        #region 加载/显示习题
        /// <summary>
        /// 加载/显示习题（题）
        /// </summary>
        private void LoadQuestion()
        {
            PenController.Instance.ResetStatus();
            mButtonCaches.Clear();

            //刷新按钮状态
            this.btnFirst.IsEnabled = this.mPageIndex > 0;
            this.btnPrev.IsEnabled = this.btnFirst.IsEnabled;
            this.btnNext.IsEnabled = this.mPageSize > 1 && this.mPageIndex < this.mPageSize - 1;
            this.btnLast.IsEnabled = this.btnNext.IsEnabled;

            this.mQuestion = mQuestions[this.mPageIndex];
            this.mStepNumber = 1;//分页操作后，阶段还原到第一阶

            //总共有几阶
            this.mMaxStep = this.mQuestion.PropertiesList == null ? 0 : this.mQuestion.PropertiesList.Count + 1;

            this.mPageData.IsShowStep = false;
            this.mPageData.IsShowNextStepButton = true;

            showHtml();
        }
        private void showHtml()
        {
            //更新当前习题和阶段
            APP.StudySession.UpdateQuestion(this.mQuestion.questionId, this.mStepNumber);
            if (mQuestion.stepType != "SECOND_ORDER_COGNITIVE_DEGREE")
            {
                this.mPageData.StepText = "本题为{0}阶试题，当前在第{1}阶。".Formats(this.mMaxStep, this.mStepNumber);
            }
            var html = string.Empty;
            if (this.mStepNumber == 1)
            {
                html = this.mQuestion.questionContent.contentHtml;
            }
            else
            {
                html = this.mQuestion.PropertiesList[this.mStepNumber - 2].ContentHtml;
            }

            var color = "#333333";
            var doc = Helpers.HtmlDocHelper.Create(html);

            var mSelectTypeName = this.mQuestion.questionType.name;
            var mStepTypeName = this.mQuestion.mStepTypeName;
            var title = mSelectTypeName;

            if (mSelectTypeName.IsNotEmtpy() && mStepTypeName.IsNotEmtpy())
            {
                title = $"{mSelectTypeName} - {mStepTypeName}";
            }
            else
            {
                title = $"{mSelectTypeName}{mStepTypeName}";
            }

            doc.formatQuestion(color, title, this.mPageIndex + 1, this.mPageSize);
            Chrome.LoadHtml(doc.OuterHtml);

            //进入习题开时计时
            ucTool.BeginSubTime();

            Loading.IsOpen = false;
        }
        #endregion

        #region 缩放习题
        private void ScalePanel(object sender, RoutedEventArgs e)
        {
            var btn = sender as IconButton;
            var type = btn.Tag as string;
            switch (type)
            {
                case "up":
                    mScale += 1;
                    if (mScale > 8) mScale = 8;
                    break;
                case "down":
                    mScale -= 1;
                    if (mScale < -8) mScale = -8;
                    break;
                case "reset":
                    mScale = 0;
                    break;
            }
            Chrome.ScaleWeb(mScale);
        }
        #endregion

        #region 分页
        private void PageClick(object sender, RoutedEventArgs e)
        {
            var btn = sender as IconButton;
            var type = btn.Tag as string;
            switch (type)
            {
                case "first":
                    mPageIndex = 0;
                    break;
                case "prev":
                    mPageIndex--;
                    break;
                case "next":
                    mPageIndex++;
                    break;
                case "last":
                    mPageIndex = this.mQuestions.Count - 1;
                    break;
            }
            LoadQuestion();
        }
        #endregion
        #region 下一阶段
        private void NextStepClick(object sender, RoutedEventArgs e)
        {
            this.mStepNumber = this.mStepNumber + 1;
            if (this.mStepNumber <= this.mMaxStep)
            {
                mButtonCaches.Clear();
                showHtml();
            }
            if (this.mStepNumber >= this.mMaxStep)
            {
                ucTool.btnEndAnswer.IsEnabled = true;
                this.mPageData.IsShowNextStepButton = false;
            }
        }
        #endregion

        #region 按键流程
        private MSResult SaveToFlowButton(Flows.FlowItem flow, bool isSave = false)
        {
            if (flow.PenKey.IsHandwriting) return MSResult.Init();

            var pen = flow.PenDevice;
            var penKey = flow.PenKey;

            if (APP.StudySession.IsSelfJudgment)
            {
                if (penKey.IsOK == false) mButtonCaches.Add(penKey);
            }
            else if (flow.IsSingleChoice || !penKey.IsOK)
            {
                if (!isSave) isSave = flow.IsSingleChoice;
                mButtonCaches.Add(penKey);
            }

            if (penKey.IsOK || isSave || flow.StepNumber > 1)
            {
                var keys = mButtonCaches.Where(m => m.StudentId == penKey.StudentId).Select(m => m.Key).ToArray();
                if (keys.Length > 0)
                {
                    var button_item = string.Empty;
                    if (APP.StudySession.IsSelfJudgment) button_item = keys.ToJoin("");
                    else button_item = keys.ToJoin(",");

                    APP.IDatas.ErStudentButtonAnswerOriginalRecord.Insert(new ErStudentButtonAnswerOriginalRecord()
                    {
                        id = Guid.NewGuid().ToUUID(),
                        student_id = penKey.StudentId,
                        question_id = this.mQuestion.questionId,
                        exercise_record_id = APP.StudySession.PracticeRecordId,
                        button_item = button_item,
                        is_submit = true,
                        is_self_judgment = APP.StudySession.IsSelfJudgment,
                        step_number = flow.StepNumber, //注意这个位置的数据
                        create_time = DateTime.Now
                    });

                    //设置当前答题流程答案
                    if (APP.StudySession.IsSelfJudgment) FlowManage.UpdateAnswer(flow, keys.ToArray());
                    else FlowManage.UpdateAnswer(flow, keys.Distinct().ToArray());

                    //移出当前学生的答题按键
                    mButtonCaches.RemoveAll(m => m.StudentId == penKey.StudentId);

                    if (penKey.IsOK || isSave) pen.SetSubmit(true);
                }
            }
            else if (APP.StudySession.IsSelfJudgment == false)
            {
                var keys = mButtonCaches.Where(m => m.StudentId == penKey.StudentId).Select(m => m.Key).ToArray();
                //设置当前答题流程答案
                FlowManage.UpdateAnswer(flow, keys.Distinct().ToArray());
            }
            return MSResult.Init();
        }
        private void StartAnswerFlow()
        {
            FlowManage.CreateAnswerFlows(flow =>
            {
                if (flow.Command == Flows.FlowCommand.答题_二阶_3)
                {
                    flow.StepNumber = 2;
                }
                else
                {
                    flow.StepNumber = mStepNumber;
                }

                if (flow.StepNumber == 1)
                {
                    flow.IsSingleChoice = this.mQuestion.questionType.selectType == "1";//是否可以进入下一个流程
                    flow.IsAutoGrade = this.mQuestion.questionType.autoGrade == true;//是否是客观题
                }
                else
                {
                    try
                    {
                        var _propertie = this.mQuestion.PropertiesList[flow.StepNumber];
                        flow.IsSingleChoice = _propertie.selectType.IsEmpty() ? true : _propertie.selectType == "1";//是否可以进入下一个流程
                    }
                    catch { flow.IsSingleChoice = true; }
                    try
                    {
                        var _propertie = this.mQuestion.PropertiesList[flow.StepNumber];
                        flow.IsAutoGrade = _propertie.autoGrade.HasValue ? _propertie.autoGrade.Value : true;//是否是客观题
                    }
                    catch { flow.IsAutoGrade = true; }
                }
                if (flow.IsAutoGrade && flow.PenKey != null && flow.PenKey.IsHandwriting) return flow; //忽略本次流程

                switch (flow.Command)
                {
                    case Flows.FlowCommand.答题_开始:
                        {
                            var sb = new StringBuilder();
                            Flows.FlowItem nextFlow = null;
                            if (APP.StudySession.IsSelfJudgment)
                            {
                                if (mSelfJudgmentMode == "score") sb.AppendLine($"本题满分为{mSelfJudgmentScore}分，请用数字按键为自己的作答判分，按OK键提交。若要更改判分重复上部操作即可。");
                                else sb.AppendLine($"本题为对错自判模式，请用右侧的对错按钮为自己的作答给出判定，按键按下后即可提交。若要更改重复按相应按键即可。");

                                nextFlow = flow.NextFlows.Where(m => m.Command == Flows.FlowCommand.自判).FirstOrDefault();
                            }
                            else
                            {
                                sb.AppendLine("操作提示：");
                                if (mQuestion.stepType == "SECOND_ORDER_COGNITIVE_DEGREE")
                                {
                                    sb.AppendLine("　单选题点击按钮立刻提交，多选或主观题连续选择按钮或书写完毕后用OK键提交。要更改答案重复操作即可。");

                                    nextFlow = flow.NextFlows.Where(m => m.Command == Flows.FlowCommand.答题_二阶_1).FirstOrDefault();
                                }
                                else
                                {
                                    switch (mQuestion.stepType)
                                    {
                                        case "SECOND_ORDER_COGNITIVE_REASON":
                                            sb.AppendLine("你目前即将要作答的试题为2阶认知理由反馈试题。该类试题的某阶题目一旦答完不支持回退修改，请谨慎操作和提交。");
                                            break;
                                        case "THIRD_ORDER_COGNITIVE":
                                            sb.AppendLine("你目前即将要作答的试题为3阶试题。该类试题的某阶题目一旦答完不支持回退修改，请谨慎操作和提交。");
                                            break;
                                        case "FOURTH_ORDER_COGNITIVE":
                                            sb.AppendLine("你目前即将要作答的试题为4阶试题。该类试题的某阶题目一旦答完不支持回退修改，请谨慎操作和提交。");
                                            break;
                                    }

                                    nextFlow = flow.NextFlows.Where(m => m.Command == Flows.FlowCommand.答题_多阶_1).FirstOrDefault();
                                }
                            }
                            flow.SendText(sb);
                            return nextFlow;
                        }
                    case Flows.FlowCommand.答题_二阶_1:
                        {
                            if (flow.IsAutoGrade)
                            {
                                if (flow.PenKey.IsOK || flow.IsSingleChoice)
                                {
                                    if (mButtonCaches.Any(m => m.StudentId == flow.StudentId) || flow.IsSingleChoice)
                                    {
                                        SaveToFlowButton(flow);
                                        flow.IsNextFlow = true; //立即进入下一流程
                                    }
                                    else
                                    {
                                        var sb = new StringBuilder();
                                        sb.AppendLine("请至少选择一个答案。");
                                        flow.SendText(sb);
                                        return flow;
                                    }
                                }
                                else
                                {
                                    SaveToFlowButton(flow);

                                    var keys = FlowManage.ReadAnswer(flow, flow.StepNumber);
                                    var sb = new StringBuilder();
                                    sb.AppendLine($"目前作答的是第{mStepNumber}题：");
                                    sb.AppendLine("你目前已选中的选项为：" + keys.ToJoin("、"));
                                    flow.SendText(sb);
                                    return flow;
                                }
                            }
                            else
                            {
                                if (flow.PenKey.IsOK)
                                {
                                    SaveToFlowButton(flow);
                                    flow.IsNextFlow = true; //立即进入下一流程
                                }
                                else
                                {
                                    var sb = new StringBuilder();
                                    sb.AppendLine($"目前作答的是第{mStepNumber}题：");
                                    if (flow.PenKey.IsHandwriting)
                                    {
                                        sb.AppendLine("你目前正在书写...");
                                    }
                                    else
                                    {
                                        sb.AppendLine("你现在没有书写...");
                                    }
                                    flow.SendText(sb);
                                    return flow;
                                }
                            }
                        }
                        break;
                    case Flows.FlowCommand.答题_二阶_2:
                        {
                            var sb = new StringBuilder();
                            var item = mQuestion.PropertiesList[0];
                            sb.AppendLine(item.questionStem);
                            foreach (var option in item.OptionList)
                            {
                                sb.AppendLine("{0}、{1}".Formats(option.option, option.content));
                            }
                            flow.SendText(sb);
                        }
                        break;
                    case Flows.FlowCommand.答题_二阶_3:
                        {
                            var optionContent = mQuestion.PropertiesList[0].OptionList.Where(m => m.option == flow.PenKey.Key).Select(m => m.content).FirstOrDefault();
                            if (optionContent.IsNotEmtpy())
                            {
                                SaveToFlowButton(flow);

                                var sb = new StringBuilder();
                                sb.AppendLine($"目前作答的是第{mStepNumber}题：");
                                if (this.mQuestion.questionType.autoGrade == true)
                                {
                                    //客观题
                                    sb.AppendLine("已提交选项为：" + FlowManage.ReadAnswer(flow, 1).ToJoin("、"));
                                }
                                else
                                {
                                    //主观题
                                    sb.AppendLine("书写答案已提交。");
                                }
                                sb.AppendLine("确定程度为：" + optionContent);
                                flow.SendText(sb);
                            }
                            else
                            {
                                var sb = new StringBuilder();
                                sb.AppendLine("请不要操作无关按键。");
                                flow.SendText(sb);
                                flow.WatiNextFlow = 2;
                                return flow.ParentFlow;
                            }
                        }
                        break;
                    case Flows.FlowCommand.答题_多阶_1:
                        {
                            var sb = new StringBuilder();
                            sb.AppendLine($"目前作答的是第{mStepNumber}题的第{flow.StepNumber}阶({(flow.IsAutoGrade ? "客观题" : "主观题")})，本题共{mMaxStep}阶。");

                            if (flow.IsAutoGrade)
                            {
                                if (flow.PenKey.IsOK || flow.IsSingleChoice)
                                {
                                    if (mButtonCaches.Any(m => m.StudentId == flow.StudentId) || flow.IsSingleChoice)
                                    {
                                        SaveToFlowButton(flow);

                                        //由于是多阶，所以这里还需要判断是否是最后一阶
                                        if (mStepNumber >= mMaxStep)
                                        {
                                            flow.IsNextFlow = true; //立即进入下一流程
                                        }
                                    }
                                    else
                                    {
                                        sb.AppendLine("请至少选择一个答案后再提交。");
                                        flow.SendText(sb);
                                        return flow;
                                    }
                                }
                                else
                                {
                                    SaveToFlowButton(flow);
                                }
                                if (flow.IsNextFlow == false)
                                {
                                    var keys = FlowManage.ReadAnswer(flow);
                                    if (keys.Length > 0)
                                    {
                                        sb.AppendLine("你已选中:" + keys.ToJoin("、"));
                                    }
                                    else
                                    {
                                        sb.AppendLine("请至少选择一个答案后再提交。");
                                    }
                                    flow.SendText(sb);
                                    return flow;
                                }
                            }
                            else
                            {
                                if (flow.PenKey.IsOK)
                                {
                                    SaveToFlowButton(flow);

                                    //由于是多阶，所以这里还需要判断是否是最后一阶
                                    if (mStepNumber >= mMaxStep)
                                    {
                                        flow.IsNextFlow = true; //立即进入下一流程
                                    }
                                    else
                                    {
                                        sb.AppendLine("书写答案已提交。");
                                        flow.SendText(sb);
                                        return flow;
                                    }
                                }
                                else
                                {
                                    if (flow.PenKey.IsHandwriting)
                                    {
                                        sb.AppendLine("你目前正在书写...");
                                        sb.AppendLine();
                                        sb.AppendLine("书写完成按OK键提交。");
                                    }
                                    else
                                    {
                                        sb.AppendLine("你现在没有书写...");
                                    }
                                    flow.SendText(sb);
                                    return flow;
                                }
                            }
                        }
                        break;
                    case Flows.FlowCommand.答题_多阶_2:
                        {
                            var sb = new StringBuilder();
                            sb.AppendLine($"你已作答完成第{mStepNumber}题的全部{mMaxStep}阶试题。");
                            for (var i = 1; i <= mMaxStep; i++)
                            {
                                if (flow.IsAutoGrade)
                                {
                                    var keys = FlowManage.ReadAnswer(flow, i);
                                    sb.AppendLine($"{i}阶提交答案:" + keys.ToJoin("、"));
                                }
                                else
                                {
                                    sb.AppendLine($"{i}阶书写答案:已提交");
                                }
                            }
                            flow.SendText(sb);
                        }
                        break;
                    case Flows.FlowCommand.自判:
                        {
                            var sb = new StringBuilder();
                            sb.AppendLine($"目前自判的是第{mStepNumber}题：");

                            if (mSelfJudgmentMode == "score")
                            {
                                sb.AppendLine($"本题满分为{mSelfJudgmentScore}分");

                                flow.PenKey.ConvertToNumber(); //还原成数字
                                if (flow.PenKey.IsOK || Helpers.ValidateHelper.IsIntegerNotNagtive(flow.PenKey.Key))
                                {
                                    var score = mButtonCaches.Where(m => m.StudentId == flow.StudentId).Select(m => m.Key).ToArray().ToJoin("") + (flow.PenKey.IsOK ? "" : flow.PenKey.Key);
                                    var scoreInt = score.TryParse<int>();
                                    if (scoreInt > mSelfJudgmentScore)
                                    {
                                        //移出当前学生的答题按键
                                        mButtonCaches.RemoveAll(m => m.StudentId == flow.StudentId);
                                        sb.AppendLine("输入值不能大于本题满分，本次输入无效,");
                                    }
                                    else
                                    {
                                        SaveToFlowButton(flow); //保存时，会判断最大分数是否大于了最大分值
                                        var keys = FlowManage.ReadAnswer(flow);
                                        if (flow.PenKey.IsOK && keys.Length > 0)
                                        {
                                            sb.AppendLine($"你提交的自判分数为:\r\n{scoreInt}分。");
                                        }
                                        else if (keys.Length > 0)
                                        {
                                            sb.AppendLine();
                                            sb.AppendLine("自判分数为：" + scoreInt + "分。");
                                            sb.AppendLine();
                                            sb.AppendLine("确定请按OK键");
                                        }
                                        else
                                        {
                                            sb.AppendLine("正在等待你提交自判分数...");
                                        }

                                    }
                                }
                                else
                                {
                                    sb.AppendLine("输入错误,请按数字键。");
                                }
                            }
                            else
                            {
                                sb.AppendLine();
                                if (flow.PenKey.Key == "NO" || flow.PenKey.Key == "YES")
                                {
                                    SaveToFlowButton(flow, true);
                                    var key = FlowManage.ReadAnswer(flow).FirstOrDefault();
                                    sb.AppendLine("你提交的自判结果:\r\n" + (key == "YES" ? "     答对" : "     答错。"));
                                }
                                else
                                {
                                    sb.AppendLine("输入错误,请按对错键。");
                                }
                            }
                            flow.SendText(sb);
                        }
                        break;
                }
                return flow.NextFlows.FirstOrDefault();
            });
        }
        #endregion

        #region 开始答题-按钮事件
        private void BeginQuestionClick(object sender, RoutedEventArgs e)
        {
            this.ucTool.btnBeginAnswer.IsEnabled = false;
            this.ucTool.btnEndAnswer.IsEnabled = false;
            this.ucTool.btnBeginSelfJudgment.IsEnabled = false;
            this.ucTool.btnEndSelfJudgment.IsEnabled = false;
            vPager.Visibility = Visibility.Collapsed;

            Helpers.AudioHelper.Play("countdown-start", m => { ucCountdown.PlayStart(); }, m => { StartAnswer(); });
        }
        #endregion
        #region 结束答题-按钮事件
        private void EndQuestionClick(object sender, RoutedEventArgs e)
        {
            this.ucTool.btnEndAnswer.IsEnabled = false;
            this.ucTool.btnBeginSelfJudgment.IsEnabled = false;
            Helpers.AudioHelper.Play("countdown-end", m => { ucCountdown.PlayEnd(); }, m => { StopAnswer(false); });
        }
        #endregion
        #region 开始答题-入口
        private void StartAnswer()
        {
            mButtonCaches.Clear();
            this.mPageData.IsShowStep = mQuestion.stepType != "SECOND_ORDER_COGNITIVE_DEGREE";
            this.ucTool.btnBeginSelfJudgment.IsEnabled = true;
            this.ucTool.btnEndAnswer.IsEnabled = true;

            ucTool.BeginAnswerTime();
            StartAnswerFlow();

            //正式开始答题，更新数据库
            this.UIAsync(win =>
            {
                CreateAndUpdatePracticeRecordDB(false);
                APP.StudySession.StartAnswer();
                PenController.Instance.StartMonitor();
                delete();
            });
        }
        #endregion
        #region 结束答题-入口
        private void StopAnswer(bool isSelfJudgment)
        {
            if (isSelfJudgment && APP.StudySession.IsAnswer == false) return; //如果是自判题让其结束，同时并没有真正答题，则退出

            APP.StudySession.StopAnswer(); //先修改状态
            PenController.Instance.StopMonitor(); //停止笔盒操作
            PenController.Instance.ResetStatus(); //重置答题状态
            if (!isSelfJudgment) PenController.Instance.SendText("当前试题答题已结束，你的所有操作将无效。");

            this.ucTool.EndAnswerTime();
            this.ucTool.btnBeginAnswer.IsEnabled = true;
            this.ucTool.btnBeginSelfJudgment.IsEnabled = true;
            this.vPager.Visibility = Visibility.Visible;
            this.vPagingInfo.Visibility = Visibility.Collapsed;

            this.mPageData.IsShowStep = false;//不显示阶段

            this.UIAsync(win =>
            {
                APP.IDatas.ErPaperPracticeRecordQuestionSealUp.DoTrans(trans =>
                {
                    //更新练习记录
                    trans.Update<ErPaperPracticeRecord>(m => m.id == APP.StudySession.PracticeRecordId, m => new ErPaperPracticeRecord()
                    {
                        answer_question_status = 0
                    });
                    //更新当前试题的作答基础数据
                    trans.Update(
                    m => m.paper_practice_record_id == APP.StudySession.PracticeRecordId && m.source_question_id == this.mQuestion.questionId,
                    m => new ErPaperPracticeRecordQuestionSealUp()
                    {
                        end_practice_time = DateTime.Now,
                    });

                });

                if (isSelfJudgment == false && this.mQuestion.questionType.autoGrade == true)
                {
                    this.UICall(OpenSingleReport);
                }
            });
        }
        #endregion

        #region 开始自判-按钮事件
        private void StartSelfJudgmentClick(object sender, RoutedEventArgs e)
        {
            var dialog = new Dialogs.SelfJudgmentModeDialog();
            var success = dialog.ShowDialog();
            if (success != true) return;

            StopAnswer(true);

            mSelfJudgmentMode = dialog.SelfJudgmentMode;
            mSelfJudgmentScore = dialog.Score;

            this.ucTool.btnBeginAnswer.IsEnabled = false;
            this.ucTool.btnEndAnswer.IsEnabled = false;
            this.ucTool.btnBeginSelfJudgment.IsEnabled = false;
            this.ucTool.btnEndSelfJudgment.IsEnabled = false;
            this.vPager.Visibility = Visibility.Collapsed;
            this.vPagingInfo.Visibility = Visibility.Visible;
            this.mPageData.PagingInfo = "当前正在自判中";

            //自判模式，始终不显示阶段面板操作
            this.mPageData.IsShowStep = false;

            APP.StudySession.StartSelfJudgment();
            Helpers.AudioHelper.Play(@"self-judgment-start", m => { ucCountdown.PlayStart(); }, m => { StartSelfJudgment(); });
        }
        #endregion
        #region 结束自判-按钮事件
        private void StopSelfJudgmentClick(object sender, RoutedEventArgs e)
        {
            ucTool.btnEndSelfJudgment.IsEnabled = false;
            Helpers.AudioHelper.Play("self-judgment-end", m => { ucCountdown.PlayEnd(); }, m => { StopSelfJudgment(); });
        }
        #endregion
        #region 开始自判-入口
        /// <summary>
        /// 开始自判
        /// </summary>
        private void StartSelfJudgment()
        {
            ucTool.btnEndSelfJudgment.IsEnabled = true;
            this.UIAsync(win =>
            {
                CreateAndUpdatePracticeRecordDB(true);

                APP.ISQLs.DoTrans(trans =>
                {
                    delete();
                    //更新练习记录
                    trans.Update<ErPaperPracticeRecord>(m => m.id == APP.StudySession.PracticeRecordId, m => new ErPaperPracticeRecord()
                    {
                        self_judgment_status = 1,
                    });
                    //更新当前试题的作答基础数据
                    trans.Update<ErPaperPracticeRecordQuestionSealUp>(
                    m => m.paper_practice_record_id == APP.StudySession.PracticeRecordId && m.source_question_id == this.mQuestion.questionId,
                    m => new ErPaperPracticeRecordQuestionSealUp()
                    {
                        self_judgment_start_time = DateTime.Now,
                        self_judgment_count = m.self_judgment_count + 1,
                        self_judgment_model = mSelfJudgmentMode == "score" ? 0 : 1,
                        self_judgment_full_score = mSelfJudgmentScore
                    });
                });
                PenController.Instance.StartMonitor();
                StartAnswerFlow();
            });
        }
        #endregion
        #region 结束自判-入口
        /// <summary>
        /// 开始自判-入口
        /// </summary>
        private void StopSelfJudgment()
        {
            APP.StudySession.StopSelfJudgment(); //修改状态
            PenController.Instance.StopMonitor(); //停止笔盒操作
            PenController.Instance.ResetStatus(); //重置答题状态
            PenController.Instance.SendText("当前试题自判已结束，你的所有操作将无效。");

            this.vPager.Visibility = Visibility.Visible;
            this.ucTool.btnBeginAnswer.IsEnabled = true;
            this.ucTool.btnEndAnswer.IsEnabled = false;
            this.ucTool.btnBeginSelfJudgment.IsEnabled = true;
            this.ucTool.btnEndSelfJudgment.IsEnabled = false;

            this.UIAsync(win =>
            {
                APP.ISQLs.DoTrans(trans =>
                {
                    //更新练习记录
                    trans.Update<ErPaperPracticeRecord>(m => m.id == APP.StudySession.PracticeRecordId, m => new ErPaperPracticeRecord()
                    {
                        self_judgment_status = 2,
                    });
                    //更新当前试题的作答基础数据
                    trans.Update<ErPaperPracticeRecordQuestionSealUp>(
                    m => m.paper_practice_record_id == APP.StudySession.PracticeRecordId && m.source_question_id == this.mQuestion.questionId,
                    m => new ErPaperPracticeRecordQuestionSealUp()
                    {
                        self_judgment_end_time = DateTime.Now
                    });
                });

                this.UICall(OpenSingleReport);
            });
        }
        #endregion

        #region 创建或更新练习记录（开始答题/开始自判）
        /// <summary>
        /// 创建或更新练习记录（开始答题/开始自判）
        /// </summary>
        private void CreateAndUpdatePracticeRecordDB(bool isSelfJudgment)
        {
            APP.IDatas.ErPaperPracticeRecordQuestionSealUp.DoTrans(trans =>
            {
                //更新练习题状态
                trans.Update<ErPaperPracticeRecord>(
                m => m.id == APP.StudySession.PracticeRecordId,
                m => new ErPaperPracticeRecord()
                {
                    answer_question_status = 1
                });

                //封存当前试题的作答基础数据
                if (trans.Any(m => m.paper_practice_record_id == APP.StudySession.PracticeRecordId && m.source_question_id == this.mQuestion.questionId) == false)
                {
                    QuestionRecordID = Guid.NewGuid().ToUUID();
                    //可以自动阅卷的题，对正确答案做排序
                    if (this.mQuestion.questionType.autoGrade == true)
                    {
                        string correctAnswer = "";
                        if (this.mQuestion.questionContent.answer != null || !"".Equals(this.mQuestion.questionContent.answer))
                        {
                            List<char> correctAnswerList = this.mQuestion.questionContent.answer.ToCharArray().ToList();
                            correctAnswerList.Sort();
                            correctAnswer = string.Join("", correctAnswerList);
                        }
                        this.mQuestion.questionContent.answer = correctAnswer;

                    }

                    trans.Insert(new ErPaperPracticeRecordQuestionSealUp()
                    {
                        id = QuestionRecordID,
                        paper_practice_record_id = APP.StudySession.PracticeRecordId,
                        source_question_id = this.mQuestion.questionId,
                        question_order = this.mQuestion.paperOrder,
                        question_step_number = mMaxStep.ToString(),
                        question_stem_type = this.mQuestion.stepType,
                        self_judgment_count = 0,
                        first_step_stem = this.mQuestion.questionContent.content,
                        first_step_option = null,//不知道是哪个字段（先不管）

                        first_step_correct_option = this.mQuestion.questionContent.answer,
                        first_step_analysis = this.mQuestion.questionContent.analysis
                    });
                    if (!isSelfJudgment)
                    {
                        trans.Update(c => c.id == QuestionRecordID, c => new ErPaperPracticeRecordQuestionSealUp()
                        {
                            practice_count = 1,
                            start_practice_time = DateTime.Now,
                        });
                    }
                    if (this.mQuestion.PropertiesList != null && this.mQuestion.PropertiesList.Count > 0)
                    {
                        //封存其他几阶
                        for (var i = 0; i < this.mQuestion.PropertiesList.Count; i++)
                        {
                            var pItem = this.mQuestion.PropertiesList[i];
                            var step_stem = pItem.questionStem;
                            var step_option = pItem.options;
                            var step_correct_option = pItem.answer;
                            switch (i)
                            {
                                case 0:
                                    trans.Update(c => c.id == QuestionRecordID, c => new ErPaperPracticeRecordQuestionSealUp()
                                    {
                                        second_step_stem = step_stem,
                                        second_step_option = step_option,
                                        second_step_correct_option = step_correct_option,
                                    });
                                    break;
                                case 1:
                                    trans.Update(c => c.id == QuestionRecordID, c => new ErPaperPracticeRecordQuestionSealUp()
                                    {
                                        third_step_stem = step_stem,
                                        third_step_option = step_option,
                                        third_step_correct_option = step_correct_option,
                                    });
                                    break;
                                case 2:
                                    trans.Update<ErPaperPracticeRecordQuestionSealUp>(c => c.id == QuestionRecordID, c => new ErPaperPracticeRecordQuestionSealUp()
                                    {
                                        forth_step_stem = step_stem,
                                        forth_step_option = step_option,
                                        forth_step_correct_option = step_correct_option,
                                    });
                                    break;
                            }
                        }
                    }
                }
                else if (!isSelfJudgment)
                {
                    //更新当前试题作答结束时间
                    trans.Update(
                    m => m.paper_practice_record_id == APP.StudySession.PracticeRecordId && m.source_question_id == this.mQuestion.questionId,
                    m => new ErPaperPracticeRecordQuestionSealUp()
                    {
                        start_practice_time = DateTime.Now,
                        practice_count = m.practice_count + 1
                    });
                }
            });
        }
        #endregion

        #region 答判情况
        private void ShowAnswerResult(object sender, RoutedEventArgs e)
        {
            ucAnswerPanel.ShowPopup();
        }
        #endregion

        #region 退出做题
        /// <summary>
        /// 退出做题
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ExitAnswer(object sender, RoutedEventArgs e)
        {
            Loading.Content = "请稍候...";
            Loading.IsOpen = true;

            //if (APP.StudySession.IsAnswer) StopAnswer(false);
            //if (APP.StudySession.IsSelfJudgment) StopSelfJudgment();

            this.UIAsync(() =>
            {
                var result = APP.ISQLs.DoTrans(trans =>
                {
                    //更新练习记录
                    trans.Update<ErPaperPracticeRecord>(m => m.id == APP.StudySession.PracticeRecordId, m => new ErPaperPracticeRecord()
                    {
                        end_time = DateTime.Now
                    });
                });
                if (result.flag)
                {
                    PenController.Instance.SendText("当前试卷做题已整体结束，你的所有操作将无效。");
                    bool flag = analysis();
                    APP.StudySession.ExitStudy();

                    this.UICall(() =>
                    {
                        if (flag)
                        {
                            var chorme = new ChormeWindow();
                            chorme.ChromeMain.SetJSObject("lwmain", jsObject);
                            chorme.WindowState = WindowState.Maximized;
                            chorme.IsToolBar = false;
                            chorme.Address = MSConfig.link_address_lw_record_all;
                            chorme.Show();
                        }
                        Loading.IsOpen = false;
                        this.Close();
                    });
                }
                else
                {
                    this.UICall(() =>
                    {
                        Loading.IsOpen = false;
                        this.ShowMessageError(result.msg);
                    });
                }
            });
        }

        public void delete()
        {
            var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, this.mQuestion.questionId);
            if (questionSealUp == null) return;
            APP.IDatas.ErOriginalRecord.Delete<ErOriginalRecord>(e => e.exercise_record_id == APP.StudySession.PracticeRecordId && e.question_id == questionSealUp.id);
            APP.IDatas.ErAllStudentQuestionRecord.Delete<ErAllStudentQuestionRecord>(e => e.exercise_record_id == APP.StudySession.PracticeRecordId && e.question_id == questionSealUp.id);
            APP.IDatas.ErSingleStudentQuestionRecord.Delete<ErSingleStudentQuestionRecord>(e => e.exercise_record_id == APP.StudySession.PracticeRecordId && e.question_id == questionSealUp.id);
        }

        private bool analysis()
        {
            try
            {
                string exerciseRecordId = APP.StudySession.PracticeRecordId;
                SingleStudentPracticeStatisticsService singleStudentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                singleStudentPracticeStatisticsService.GetSingleStudentPracticeRecords(exerciseRecordId);
                AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                allStudentQuestionStatisticsService.UpdateAllStudentQuestionRecord(exerciseRecordId);
                AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                allStudentPracticeStatisticsService.SaveAllStudentPracticeRecord(exerciseRecordId);
                AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                allStudentKnowledgeStatisticsService.SaveAllStudentKnowledgeRecord(exerciseRecordId);
                return true;
            }
            catch (Exception e)
            {
                //打印log
                return false;
            }

        }

        private bool analysisOrignial()
        {
            OriginalRecordService original = new OriginalRecordService();
            //var practiceRecord = APP.IDatas.ErPracticeRecord.GetOne();
            bool flag = original.analysisOriginal(APP.StudySession.PracticeRecordId, mQuestion.questionId);
            return flag;
        }

        private void analysisSingle()
        {
            OriginalRecordService original = new OriginalRecordService();
            original.analysisSingle(APP.StudySession.PracticeRecordId, mQuestion.questionId);
        }
        #endregion

        #region OpenSingleReport
        /// <summary>
        /// 
        /// </summary>
        private void OpenSingleReport()
        {
            this.UIAsync(win =>
            {
                bool flag = analysisOrignial();
                if (flag)
                {
                    analysisSingle();

                    this.UICall(() =>
                    {
                        dialogSingleStatistics();
                    });
                }

            });
        }
        #endregion

        private void dialogSingleStatistics()
        {
            var chorme = new ChormeWindow();
            chorme.ChromeMain.SetJSObject("lwmain", jsObject);
            chorme.WindowState = WindowState.Maximized;
            chorme.IsToolBar = false;
            chorme.Address = MSConfig.link_address_lw_record_single;
            chorme.ShowDialog();
        }

        #region JSObject
        class JSObject
        {
            private StudyWindow mStudyWindow;

            public JSObject(StudyWindow sw)
            {
                mStudyWindow = sw;
            }

            /// <summary>
            /// 练习历史记录标题
            /// </summary>
            public string PracticeResultTitle()
            {
                AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                var result = allStudentPracticeStatisticsService.PracticeResultTitle(APP.StudySession.PracticeRecordId);
                string s = MLPen.Helpers.JsonHelper.ToJSON(result);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            public string TableChart(int type)
            {
                var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                var result = singleStudentQuestionStatisticsService.TableChart(APP.StudySession.PracticeRecordId, questionSealUp.id, type);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }

            /// <summary>
            /// 多题
            /// </summary>
            public string AllDashBoardChartStatistics(int status, int type)
            {
                if (status == 0)
                {
                    AllStudentPracticeStatisticsService allStudentPracticeStatisticsService = new AllStudentPracticeStatisticsService();
                    Dictionary<string, object> result = allStudentPracticeStatisticsService.AllDashboardStatistics(APP.StudySession.PracticeRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    Dictionary<string, object> result = allStudentQuestionStatisticsService.DashboardChartStatistics(APP.StudySession.PracticeRecordId, questionSealUp.id);
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
                    Dictionary<string, object> result = allStudentPracticeStatisticsService.FunnelFigureChartStatistics(APP.StudySession.PracticeRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    Dictionary<string, object> result = allStudentQuestionStatisticsService.FunnelFigureChartStatistics(APP.StudySession.PracticeRecordId, questionSealUp.id);
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
                    List<object> result = singleStudentPracticeStatisticsService.AllBubbleDiagramChartStatistics(APP.StudySession.PracticeRecordId, type);
                    return MLPen.Helpers.JsonHelper.ToJSON(result);
                }
                else
                {
                    var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                    SingleStudentQuestionStatisticsService singleStudentQuestionStatisticsService = new SingleStudentQuestionStatisticsService();
                    List<object> result = singleStudentQuestionStatisticsService.BubbleDiagramChartStatistics(APP.StudySession.PracticeRecordId, questionSealUp.id);
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
                    result = allStudentKnowledgeStatisticsService.MultiDimensionalChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.MultiDimensionalChartStatistics(APP.StudySession.PracticeRecordId);
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
                    result = allStudentKnowledgeStatisticsService.MultiBarChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.MultiBarChartStatistics(APP.StudySession.PracticeRecordId);
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
                    result = allStudentKnowledgeStatisticsService.LineChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.LineChartStatistics(APP.StudySession.PracticeRecordId);
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
                    result = allStudentKnowledgeStatisticsService.ScatterDiagramChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.ScatterDiagramChartStatistics(APP.StudySession.PracticeRecordId);
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
                    result = allStudentKnowledgeStatisticsService.RadarChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.RadarChartStatistics(APP.StudySession.PracticeRecordId);
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
                    result = allStudentKnowledgeStatisticsService.CognitiveIndexChartStatistics(APP.StudySession.PracticeRecordId);
                }
                else
                {
                    AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
                    result = allStudentQuestionStatisticsService.CognitiveIndexChartStatistics(APP.StudySession.PracticeRecordId);
                }
                return MLPen.Helpers.JsonHelper.ToJSON(result);
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
                var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                Dictionary<string, object> dic = allStudentQuestionStatisticsService.oneQuestionRecordStatistics(APP.StudySession.PracticeRecordId, questionSealUp.id);
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
                var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(APP.StudySession.PracticeRecordId, mStudyWindow.mQuestion.questionId);
                var result = practiceRecordStatisticsService.OneQuestionOriginalRecordList(APP.StudySession.PracticeRecordId, questionSealUp.id, studentAnswer, score, isRight);

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
                Dictionary<string, object> result = practiceRecordStatisticsService.practiceRecordStatistics(APP.StudySession.PracticeRecordId);
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
                var result = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeStatistics(APP.StudySession.PracticeRecordId);
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
                var result = allStudentQuestionStatisticsService.OnePracticeQuestionBaseInfo(APP.StudySession.PracticeRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }


            /// <summary>
            /// 单次练习答题基本情况统计 知识点维度
            /// </summary>
            /// <returns></returns>
            public string OnePracticeKnowledgeBaseInfo()
            {
                AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
                var result = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeBaseStatistics(APP.StudySession.PracticeRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);

            }

            /// <summary>
            /// 单次练习学生答题结果统计 
            /// </summary>
            /// <returns></returns>
            public string OnePracticeStudentOriginalStatistics()
            {
                SingleStudentPracticeStatisticsService studentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
                var result = studentPracticeStatisticsService.OnePracticeStudentOriginalStatistics(APP.StudySession.PracticeRecordId);
                return MLPen.Helpers.JsonHelper.ToJSON(result);
            }
        }


        #endregion
    }
}
