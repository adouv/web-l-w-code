using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using MLPen.Packs;
using MLPen.Tcp;

namespace MLPen
{
    /// <summary>
    /// 笔-设备
    /// </summary>
    public class PenDevice
    {
        #region 字段
        private IPAddress mIpAddress;
        private TcpClient mTcpClient;
        private byte[] mDeviceId;
        private int _onlineTimeout = 30;//秒
        private double _writeingTimeout = 1;//秒

        private DateTime _onlineTime = DateTime.Now;
        private DateTime _writeingTime = DateTime.Now;
        private Timer _timerOnline = new Timer(1000);
        private Timer _timerWriteing = new Timer(100);

        /// <summary>
        /// 当前题的笔记（缓存）
        /// </summary>
        private List<PenPoint> mPenLines = new List<PenPoint>();
        #endregion

        #region 构造函数
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="connection"></param>
        public PenDevice(long studentId)
        {
            this.StudentId = studentId;
            this._timerOnline.Elapsed += TimeoutCheck;
            this._timerWriteing.Elapsed += WriteingTick;
        }
        #endregion

        #region 属性
        /// <summary>
        /// 学生ID
        /// </summary>
        public long StudentId { get; private set; }
        /// <summary>
        /// 答题状态
        /// </summary>
        public PenStatus PenStatus { get; private set; } = new PenStatus();
        /// <summary>
        /// 是否正在运行中
        /// </summary>
        public bool IsRuning { get; private set; }
        /// <summary>
        /// 每一阶的答题结果，0-自判结果
        /// </summary>
        public Dictionary<int, string[]> AnswerKeys { get; private set; } = new Dictionary<int, string[]>();
        #endregion

        #region 私有方法 
        private void TimeoutCheck(object sender, ElapsedEventArgs e)
        {
            if (this.PenStatus.IsOnline && DateTime.Now > _onlineTime.AddSeconds(_onlineTimeout))
            {
                this.SetOnline(false);
            }
        }
        /// <summary>
        /// 实时检查用户的书写状态
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void WriteingTick(object sender, ElapsedEventArgs e)
        {
            if (this.PenStatus.IsOnline && this.PenStatus.IsWriteing && (APP.StudySession.IsAnswer || APP.StudySession.IsSelfJudgment))
            {
                if (DateTime.Now > _writeingTime.AddSeconds(_writeingTimeout))
                {
                    this.SetWriteing(false);
                }
            }
        }
        #endregion

        #region 事件
        /// <summary>
        /// 设备状态事件
        /// </summary>
        public event EventHandler<PenEvents.StatusEventArgs> HandlerPenStatus;
        private void OnPenStatus()
        {
            HandlerPenStatus?.Invoke(this, new PenEvents.StatusEventArgs(this.PenStatus));
        }
        /// <summary>
        /// 设备笔迹事件
        /// </summary>
        public event EventHandler<PenEvents.WriteingEventArgs> HandlerWriteing;
        private void OnHandlerWriteing(List<Pendot> pendot)
        {
            var points = pendot.ConvertAll(m => new PenPoint(m));
            try
            {
                mPenLines.AddRange(points.Where(m => m != null));
                HandlerWriteing?.Invoke(this, new PenEvents.WriteingEventArgs(points));
            }
            catch { }
        }
        #endregion

        #region 共公方法
        /// <summary>
        /// 开始答题或自判
        /// </summary>
        public void Start()
        {
            mPenLines.Clear();
            this.IsRuning = true;
            this._timerWriteing.Start();
        }
        /// <summary>
        /// 结束答题或自判
        /// </summary>
        public void Stop()
        {
            this.IsRuning = false;
            this._timerWriteing.Stop();
        }
        /// <summary>
        /// 绑定设备的UDP连接
        /// </summary>
        internal void BindDevice(IPAddress iPAddress, byte[] deviceId)
        {
            this.mIpAddress = iPAddress;
            APP.IDatas.TStudentDeviceService.UpdateDevice(new Models.TStudentDeviceModel.Update
            {
                id = StudentId,
                deviceid = string.Join(",", deviceId),
                deviceip = this.mIpAddress.ToString()
            });
        }
        /// <summary>
        /// 绑定设备的TCP连接
        /// </summary>
        internal void BindDevice(TcpState state, byte[] deviceId)
        {
            this.mTcpClient = state.TcpClient;
            this.mDeviceId = deviceId;
            this.mIpAddress = ((IPEndPoint)mTcpClient.Client.RemoteEndPoint).Address;

            APP.IDatas.TStudentDeviceService.UpdateDevice(new Models.TStudentDeviceModel.Update
            {
                id = StudentId,
                deviceid = string.Join(",", deviceId),
                deviceip = this.mIpAddress.ToString()
            });
            this.SetOnline(true);
        }
        /// <summary>
        /// 绑定IP地址
        /// </summary>
        /// <param name="address"></param>
        internal void BindIPAddress(IPAddress address)
        {
            this.mIpAddress = address;
            APP.IDatas.TStudentDeviceService.UpdateIPAddress(this.StudentId, this.mIpAddress.ToString());
        }
        /// <summary>
        /// 设置上线状态
        /// </summary>
        public void SetOnline(bool isOnline)
        {
            if (isOnline) this._onlineTime = DateTime.Now;
            if (this.PenStatus.IsOnline == isOnline) return;
            this.PenStatus.IsOnline = isOnline;
            if (isOnline)
            {
                this._timerOnline.Start();
            }
            else
            {
                this._timerOnline.Stop();
            }
            OnPenStatus();
        }
        /// <summary>
        /// 设置提交状态
        /// </summary>
        /// <param name="status"></param>
        public void SetSubmit(bool isSubmit)
        {
            if (this.IsRuning == false) return;
            if (this.PenStatus.IsSubmit == isSubmit) return;
            this.PenStatus.IsSubmit = isSubmit;
            OnPenStatus();
        }
        /// <summary>
        /// 设置书写状态
        /// </summary>
        /// <param name="status"></param>
        public void SetWriteing(bool isWriteing)
        {
            if (this.IsRuning == false) return;
            if (isWriteing) this._writeingTime = DateTime.Now;
            if (this.PenStatus.IsWriteing == isWriteing) return;
            this.PenStatus.IsWriteing = isWriteing;
            OnPenStatus();
        }
        /// <summary>
        /// 获取当前用户的笔迹
        /// </summary>
        /// <returns></returns>
        public List<PenPoint> GetPoints()
        {
            return new List<PenPoint>(mPenLines);
        }
        #endregion

        #region 写入坐标
        /// <summary>
        /// 写入坐标
        /// </summary>
        /// <param name="pendot"></param>
        public void WriteingDot(List<Pendot> pendot)
        {
            if (this.IsRuning == false) return;
            OnHandlerWriteing(pendot);
        }
        #endregion

        #region 检查设备ID是否绑定
        private bool CheckDeviceBind()
        {
            if (mDeviceId == null)
            {
                this.mDeviceId = APP.IDatas.TStudentDeviceService.ReadDeviceId(StudentId);
            }
            return this.mDeviceId != null;
        }
        #endregion

        //#region 设置当前答题流程答案
        ///// <summary>
        ///// 设置当前答题流程答案
        ///// </summary>
        ///// <param name="command"></param>
        ///// <param name="result"></param>
        //public void SetFlowAnswers(Flows.FlowCommand command, string result)
        //{
        //    if (FlowAnswers.ContainsKey(command))
        //    {
        //        FlowAnswers[command] = result;
        //    }
        //    else
        //    {
        //        FlowAnswers.Add(command, result);
        //    }
        //}
        //#endregion

        #region 向设备发送文本内容
        /// <summary>
        /// 向设备发送文本内容
        /// </summary>
        /// <param name="text"></param>
        public void SendText(string text, bool isTcp)
        {
            if (!isTcp)
            {
                var ret = CheckDeviceBind();
                if (ret == false) return;
            }

            var pack = PackHelper.CreateSend(this.mDeviceId);
            var datas = pack.SendTextPack(text, isTcp);
            if (isTcp)
            {
                PenController.Instance.PendSend(datas, this.mTcpClient);
            }
            else if (this.mIpAddress != null)
            {
                PenController.Instance.PendSend(datas, this.mIpAddress);
            }
        }
        #endregion

        #region 重置笔的状态
        /// <summary>
        /// 重置笔的状态
        /// </summary>
        internal void ResetStatus()
        {
            this.PenStatus.IsSubmit = false;
            this.PenStatus.IsWriteing = false;
            OnPenStatus();
        }
        #endregion
    }
}
