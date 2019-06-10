using MLPen.Flows;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 设备流程事件
    /// </summary>
    public class FlowManage
    {
        /// <summary>
        /// 流程对列
        /// </summary>
        static Dictionary<long, FlowItem> mFlowList = new Dictionary<long, FlowItem>();
        /// <summary>
        /// 笔迹状态间隔时间
        /// </summary>
        static Dictionary<long, DateTime> mHandwritingTimeout = new Dictionary<long, DateTime>();
        /// <summary>
        /// 指定时间执行流程
        /// </summary>
        static Dictionary<long, Timer> mFlowTimer = new Dictionary<long, Timer>();
        /// <summary>
        /// 答案缓存
        /// </summary>
        static Dictionary<long, Dictionary<int, string[]>> mAnswerCache = new Dictionary<long, Dictionary<int, string[]>>();

        /// <summary>
        /// 添加或下次要执行的流程
        /// </summary>
        /// <param name="flow">待执行的流程</param>
        private static void UpdateFlow(FlowItem flow)
        {
            if (flow == null) return;
            lock (mFlowList)
            {
                if (mFlowList.ContainsKey(flow.PenDevice.StudentId))
                {
                    mFlowList[flow.PenDevice.StudentId] = flow;
                }
                else
                {
                    mHandwritingTimeout.Add(flow.StudentId, DateTime.Now);
                    mFlowList.Add(flow.PenDevice.StudentId, flow);
                }
            }
        }
        private static void RemoveTimer(long studentId)
        {
            lock (mFlowTimer)
            {
                if (mFlowTimer.ContainsKey(studentId))
                {
                    mFlowTimer[studentId].Dispose();
                    mFlowTimer.Remove(studentId);
                }
            }
        }
        private static void AddTimer(FlowItem flow)
        {
            lock (mFlowTimer)
            {
                RemoveTimer(flow.StudentId);
                var timer = new Timer((state) =>
                {
                    var _flow = state as FlowItem;
                    _flow.WatiNextFlow = 0;
                    RunFlows(_flow.PenKey);
                }, flow, flow.WatiNextFlow * 1000, Timeout.Infinite);
                mFlowTimer.Add(flow.StudentId, timer);
            }
        }
        /// <summary>
        /// 是否有待处理的流程
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public static bool HasFlow(long studentId)
        {
            return mFlowList.ContainsKey(studentId) && mFlowList[studentId] != null;
        }

        /// <summary>
        /// 执行流程
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public static void RunFlows(PenKey penKey)
        {
            if (HasFlow(penKey.StudentId))
            {
                var flow = mFlowList[penKey.StudentId];
                if (flow == null) return;
                if (penKey.IsHandwriting && flow.IsHandwriting == false) return;
                if (flow.IsHandwriting && penKey.IsHandwriting && mHandwritingTimeout.ContainsKey(flow.StudentId))
                {
                    if ((DateTime.Now - mHandwritingTimeout[flow.StudentId]).TotalSeconds < 3) return;
                    mHandwritingTimeout[flow.StudentId] = DateTime.Now;
                }
                RemoveTimer(flow.StudentId);
                var nextFlow = flow.Run(penKey);
                if (nextFlow != null)
                {
                    if (flow.IsNextFlow)
                    {
                        flow.IsNextFlow = false;
                        UpdateFlow(nextFlow);
                        RunFlows(flow.PenKey);
                    }
                    else
                    {
                        if (flow.WatiNextFlow > 0)
                        {
                            AddTimer(flow);
                        }
                        UpdateFlow(nextFlow);
                    }
                }
                else
                {
                    mFlowList.Remove(flow.StudentId);
                }
            }
        }

        /// <summary>
        /// 创建答题流程
        /// </summary>
        public static void CreateAnswerFlows(Func<FlowItem, FlowItem> action)
        {
            mHandwritingTimeout.Clear();
            mFlowList.Clear();
            mAnswerCache.Clear();
            foreach (var studentId in APP.StudySession.StudentIds)
            {
                var pen = PenController.Instance.GetPen(studentId);
                if (pen != null)
                {
                    var flow = new FlowItem(pen, FlowCommand.答题_开始) { RunAction = action };

                    //二阶认知程度反馈-课堂实时反馈做题页面
                    var flow_a_1 = new FlowItem(pen, FlowCommand.答题_二阶_1) { RunAction = action, IsHandwriting = true };
                    var flow_a_2 = new FlowItem(pen, FlowCommand.答题_二阶_2) { RunAction = action, IsHandwriting = true };
                    var flow_a_3 = new FlowItem(pen, FlowCommand.答题_二阶_3) { RunAction = action };
                    //var flow_a_4 = new FlowItem(pen, FlowCommand.答题_二阶_4) { RunAction = action };
                    flow_a_1.AddFlow(flow_a_2);
                    flow_a_2.AddFlow(flow_a_3);
                    flow_a_3.AddFlow(flow_a_1);
                    //flow_a_4.AddFlow(flow_a_2);

                    //二阶认知理由反馈、三阶和四阶试题的第1阶-课堂实时反馈做题页面
                    var flow_b_1 = new FlowItem(pen, FlowCommand.答题_多阶_1) { RunAction = action, IsHandwriting = true };
                    var flow_b_2 = new FlowItem(pen, FlowCommand.答题_多阶_2) { RunAction = action, IsHandwriting = true };
                    flow_b_1.AddFlow(flow_b_2);
                    flow_b_2.AddFlow(flow_b_1);

                    //自判
                    var flow_s_1 = new FlowItem(pen, FlowCommand.自判) { RunAction = action };
                    flow_s_1.AddFlow(flow_s_1);

                    flow.AddFlow(flow_a_1);
                    flow.AddFlow(flow_b_1);
                    flow.AddFlow(flow_s_1);

                    var nextFlow = flow.Run();
                    if (nextFlow != null)
                    {
                        UpdateFlow(nextFlow);
                    }
                }
            }
        }

        /// <summary>
        /// 缓存已提交答案
        /// </summary>
        /// <param name="studentId"></param>
        /// <param name="keys"></param>
        public static void UpdateAnswer(FlowItem flow, string[] keys)
        {
            var step = APP.StudySession.IsSelfJudgment ? 0 : flow.StepNumber;
            if (mAnswerCache.ContainsKey(flow.StudentId))
            {
                if (mAnswerCache[flow.StudentId].ContainsKey(step))
                {
                    mAnswerCache[flow.StudentId][step] = keys;
                }
                else
                {
                    mAnswerCache[flow.StudentId].Add(step, keys);
                }
            }
            else
            {
                var answers = new Dictionary<int, string[]>();
                answers.Add(step, keys);
                mAnswerCache.Add(flow.StudentId, answers);
            }
        }
        /// <summary>
        /// 获取已提交的答案缓存（自动判断是否是自判或流程所在阶段）
        /// </summary>
        /// <param name="flow">当前流程</param>
        /// <param name="stepNumber">指定流程（不指定，将自动判断是否是自判或流程所在阶段）</param>
        /// <returns></returns>
        public static string[] ReadAnswer(FlowItem flow, int? stepNumber = null)
        {
            var step = stepNumber.HasValue ? stepNumber.Value : APP.StudySession.IsSelfJudgment ? 0 : flow.StepNumber;
            if (mAnswerCache.ContainsKey(flow.StudentId))
            {
                if (mAnswerCache[flow.StudentId].ContainsKey(step))
                {
                    return mAnswerCache[flow.StudentId][step];
                }
            }
            return new string[0];
        }

        /// <summary>
        /// 清理所有答题答案
        /// </summary>
        public static void ClearAnswer()
        {
            mAnswerCache.Clear();
        }
    }
}
