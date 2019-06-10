using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Flows
{
    public enum FlowType
    {
        任意,
        按键,
        笔迹
    }
    /// <summary>
    /// 答案缓存
    /// </summary>
    public enum AnswerCache
    {
        SelfJudgment,
        Step1,
        Step2,
        Step3,
        Step4
    }
    public enum FlowCommand
    {
        答题_开始,
        答题_二阶_1,
        答题_二阶_2,
        答题_二阶_3,
        答题_多阶_1,
        答题_多阶_2,
        自判,
    }

    /// <summary>
    /// 流程项
    /// </summary>
    public class FlowItem
    {
        /// <summary>
        /// 创建流程
        /// </summary>
        /// <param name="pen">学生设备</param>
        /// <param name="command">执行命令</param>
        public FlowItem(PenDevice pen, FlowCommand command)
        {
            this.StudentId = pen.StudentId;
            this.PenDevice = pen;
            this.Command = command;
        }

        #region 属性
        /// <summary>
        /// 学生ID
        /// </summary>
        public long StudentId { get; private set; }
        /// <summary>
        /// 学生设备
        /// </summary>
        public PenDevice PenDevice { get; private set; }
        /// <summary>
        /// 执行命令
        /// </summary>
        public FlowCommand Command { get; private set; }
        /// <summary>
        /// 当前按键，如果没有可能是笔迹
        /// </summary>
        public PenKey PenKey { get; private set; }
        /// <summary>
        /// 下一个流程
        /// </summary>
        public List<FlowItem> NextFlows { get; set; } = new List<FlowItem>();
        /// <summary>
        /// 是否需要立即执行下一个流程
        /// </summary>
        public bool IsNextFlow { get; set; } = false;
        /// <summary>
        /// 等待多少秒进入下一阶（秒），需要IsNextFlow=false
        /// </summary>
        public int WatiNextFlow { get; set; } = 0;
        /// <summary>
        /// 上级流程
        /// </summary>
        public FlowItem ParentFlow { get; set; }
        /// <summary>
        /// 是否充值笔迹
        /// </summary>
        public bool IsHandwriting { get; internal set; } = false;
        /// <summary>
        /// 执行事件
        /// </summary>
        public Func<FlowItem, FlowItem> RunAction { get; internal set; }
        /// <summary>
        /// 指定当前流程为第几阶
        /// </summary>
        public int StepNumber { get; set; } = 1;
        /// <summary>
        /// 是否是单选题
        /// </summary>
        public bool IsSingleChoice { get; set; }
        /// <summary>
        /// 是否是客观题
        /// </summary>
        public bool IsAutoGrade { get; set; }
        #endregion

        /// <summary>
        /// 发送指定文本
        /// </summary>
        /// <param name="sb"></param>
        public void SendText(StringBuilder sb)
        {
            PenController.Instance.SendText(this.StudentId, sb.ToString());
        }
        /// <summary>
        /// 执行流程
        /// </summary>
        internal FlowItem Run(PenKey penKey)
        {
            this.PenKey = penKey;
            return RunAction?.Invoke(this);
        }
        /// <summary>
        /// 开始执行流程
        /// </summary>
        /// <returns></returns>
        internal FlowItem Run()
        {
            return Run(null);
        }

        #region 添加子流程
        /// <summary>
        /// 添加子流程
        /// </summary>
        /// <param name="childFlow">下级流程</param>
        internal void AddFlow(FlowItem childFlow)
        {
            childFlow.ParentFlow = this;
            NextFlows.Add(childFlow);
        }
        #endregion
    }
}
