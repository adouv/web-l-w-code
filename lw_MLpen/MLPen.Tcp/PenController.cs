using MLPen.Packs;
using MLPen.Tcp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MLPen
{
    public class PenController
    {
        #region 构造函数
        private static PenController _Instance;
        /// <summary>
        /// 实例
        /// </summary>
        public static PenController Instance
        {
            get
            {
                if (_Instance == null) _Instance = new PenController();
                return _Instance;
            }
        }
        private PenController() { }
        #endregion

        #region Fields
        /// <summary>
        /// Tcp服务
        /// </summary>
        private TcpServer mTcpServer;
        /// <summary>
        /// Udp服务
        /// </summary>
        private UdpServer mUdpServer;
        /// <summary>
        /// 所有连接的笔
        /// </summary>
        private List<PenDevice> mPenDeviceList { get; set; } = new List<PenDevice>();
        #endregion

        #region 通信启动与停止
        /// <summary>
        /// 启动通信
        /// </summary>
        /// <returns></returns>
        public void Start()
        {
            //启动TCP
            mTcpServer = new TcpServer(MSConfig.port);
            mTcpServer.HandleClientConnected = TcpHandleClientConnected;
            mTcpServer.HandleClientDisconnected = TcpHandleClientDisconnected;
            mTcpServer.HandleException = TcpHandleException;
            mTcpServer.HandleDataReceived = TcpHandleDataReceived;
            mTcpServer.Start(int.MaxValue);

            //启动UDP
            mUdpServer = new UdpServer(MSConfig.server_port, MSConfig.client_port);
            mUdpServer.HandleException = UdpHandleException;
            mUdpServer.HandleDataReceived = UdpHandleDataReceived;
            mUdpServer.Start();
        }
        /// <summary>
        /// 退出通信
        /// </summary>
        public void Exit()
        {
            mTcpServer.Stop();
            mUdpServer.Stop();
        }
        #endregion

        #region 事件
        /// <summary>
        /// 设备状态事件
        /// </summary>
        public event EventHandler<PenEvents.StatusEventArgs> HandlerPenStatus;
        private void OnPenStatus(object sender, PenEvents.StatusEventArgs e)
        {
            HandlerPenStatus?.Invoke(sender, e);
        }
        #endregion

        #region Tcp异常处理程序
        /// <summary>
        /// Tcp异常处理程序
        /// </summary>
        /// <param name="ex"></param>
        public void TcpHandleException(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        #endregion
        #region Tcp服务端事件
        /// <summary>
        /// Tcp客户端连接事件
        /// </summary>
        /// <param name="server"></param>
        /// <param name="connection"></param>
        public void TcpHandleClientConnected(TcpState client)
        {
            Console.WriteLine("有客户端连接");
        }
        /// <summary>
        /// Tcp客户端断开事件
        /// </summary>
        /// <param name="server"></param>
        /// <param name="connection"></param>
        public void TcpHandleClientDisconnected(TcpState client)
        {
            Console.WriteLine("客户端断开");
        }
        #endregion
        #region Tcp客户端事件
        /// <summary>
        /// Tcp接收到客户端数据事件
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="server"></param>
        public void TcpHandleDataReceived(TcpState client, byte[] datas)
        {
            var pack = Packs.PackHelper.Create(datas);
            if (!pack.IsValidSuccess) return;

            byte[] data = null;
            switch (pack.header.cmd)
            {
                case 0x01:
                    return;
                case 0x02:
                    var info = pack.GetPack<Packs.BaseInfo>();
                    if (info.epenuid == 0) info.epenuid = 9;//这是我专用测试使用。
                    var pen = CreateOrGetPen(info.epenuid);
                    pen.BindDevice(client, pack.header.deviceid);

                    data = pack.ReplyInformationReporting();
                    mTcpServer.Send(client.TcpClient, data);

                    new System.Threading.Thread((state) =>
                    {
                        System.Threading.Thread.Sleep(1000);
                        pen.SendText("\r\n\r\n马良笔——让i更懂你", true);

                        System.Threading.Thread.Sleep(2000);
                        var _client = (TcpClient)state;
                        var exitBytes = pack.SendExitPack();
                        mTcpServer.Send(_client, exitBytes);
                    }).Start(client.TcpClient);

                    ////临时
                    //data = pack.OpenUser(info,0x1);
                    //mTcpServer.Send(client.TcpClient, data);

                    //Thread.Sleep(500);
                    //data = pack.OpenUser(info, 0x2);
                    //mTcpServer.Send(client.TcpClient, data);
                    break;
                case 0x0A:
                    return;
            }
        }
        #endregion

        #region Udp异常处理程序
        /// <summary>
        /// Udp异常处理程序
        /// </summary>
        /// <param name="ex"></param>
        public void UdpHandleException(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
        #endregion
        #region Udp客户端事件
        /// <summary>
        /// Udp接收到客户端数据事件
        /// </summary>
        /// <param name="connection"></param>
        /// <param name="server"></param>
        public void UdpHandleDataReceived(UdpServer server, UdpState udpState)
        {
            var type = udpState.Buffer[0];
            if (type != 0x55) return;

            var packet_type = udpState.Buffer.GetRange(2, 1)[0];
            switch (packet_type)
            {
                case 0x01: //坐标
                    {
                        if (APP.StudySession.IsAnswer || APP.StudySession.IsSelfJudgment)
                        {
                            var pendot = udpState.Buffer.ToStruct<Packs.Pendot>();
                            if (pendot.penid == 0) pendot.penid = 9;//这是我专用测试使用

                            var pen = CreateOrGetPen(pendot.penid);
                            if (APP.StudySession.HasStudy(pen.StudentId) == false) break;

                            FlowManage.RunFlows(new PenKey(pendot.penid));

                            pen.SetWriteing(true);
                            QueueManage.Instance.AddPendot(pendot);
                        }
                    }
                    break;
                case 0x02: //心跳
                    {
                        var heartbeat = udpState.Buffer.ToStruct<HeartbeatPack>();
                        if (heartbeat.penid == 0) heartbeat.penid = 9;//这是我专用测试使用
                        var pen = CreateOrGetPen(heartbeat.penid);
                        pen.BindDevice(udpState.IpEndPoint.Address, heartbeat.deviceid);//10秒左右更新一次
                    }
                    break;
                case 0x03: //按键
                    {
                        //原样应答
                        server.Send(udpState.Buffer, udpState.IpEndPoint);
                        if (APP.StudySession.IsAnswer || APP.StudySession.IsSelfJudgment)
                        {
                            var problem = udpState.Buffer.ToStruct<Packs.Problem>();
                            if (problem.penid == 0) problem.penid = 9;//这是我专用测试使用

                            var pen = CreateOrGetPen(problem.penid);
                            if (APP.StudySession.HasStudy(pen.StudentId) == false) break;

                            FlowManage.RunFlows(new PenKey(problem));
                        }
                    }
                    break;
            }
        }
        #endregion

        #region 创建或获取设备
        /// <summary>
        /// 获取笔
        /// </summary>
        /// <param name="studenId"></param>
        /// <returns></returns>
        public PenDevice GetPen(long studenId)
        {
            return mPenDeviceList.Where(m => m.StudentId == studenId).FirstOrDefault();
        }
        /// <summary>
        /// 创建或获取笔
        /// </summary>
        /// <param name="info"></param>
        private PenDevice CreateOrGetPen(long studentId)
        {
            var pen = GetPen(studentId);
            if (pen == null)
            {
                pen = new PenDevice(studentId);
                pen.HandlerPenStatus += OnPenStatus;
                mPenDeviceList.Add(pen);
            }
            pen.SetOnline(true);
            return pen;
        }
        #endregion

        #region 开始监听
        /// <summary>
        /// 开始监听
        /// </summary>
        public void StartMonitor()
        {
            foreach (var item in this.mPenDeviceList)
            {
                item.Start();
            }
        }
        #endregion
        #region 结束监听
        /// <summary>
        /// 结束监听
        /// </summary>
        public void StopMonitor()
        {
            foreach (var item in this.mPenDeviceList)
            {
                item.Stop();
            }
        }
        /// <summary>
        /// 指定学生结束答题
        /// </summary>
        /// <param name="studentId"></param>
        public void StopAnswer(long studentId)
        {
            var pen = GetPen(studentId);
            if (pen != null) pen.Stop();
        }
        #endregion

        #region 获取笔的状态
        /// <summary>
        /// 获取笔的状态
        /// </summary>
        /// <param name="studentId">学生ID</param>
        /// <returns></returns>
        public PenStatus GetPenStatus(long studentId)
        {
            var pen = GetPen(studentId);
            if (pen != null) return pen.PenStatus;
            else return new PenStatus();
        }
        #endregion

        #region 增加坐标点
        /// <summary>
        /// 增加坐标点
        /// </summary>
        /// <param name="pendots"></param>
        internal void AddPendots(List<Pendot> pendots)
        {
            var group = pendots.GroupBy(m => m.penid).Select(m => new { penid = m.Key, pendots = m.ToList() });
            foreach (var item in group)
            {
                var pen = GetPen(item.penid);
                if (pen == null) continue;
                pen.WriteingDot(item.pendots);
            }
        }
        #endregion


        #region 发送UDP包-内部
        /// <summary>
        /// 发送UDP包
        /// </summary>
        /// <param name="datas"></param>
        /// <param name="iPAddress"></param>
        internal void PendSend(byte[] datas, IPAddress iPAddress)
        {
            var ipEndAddresss = new IPEndPoint(iPAddress, MSConfig.client_port);
            mUdpServer.Send(datas, ipEndAddresss);
        }
        /// <summary>
        /// 发送TCP包
        /// </summary>
        /// <param name="datas"></param>
        /// <param name="client"></param>
        internal void PendSend(byte[] datas, TcpClient client)
        {
            mTcpServer.Send(client, datas);
        }
        #endregion

        #region 向设备发送文本
        /// <summary>
        /// 向设备发送文本
        /// </summary>
        /// <param name="studentId">学生ID</param>
        /// <param name="text">文本</param>
        public void SendText(long studentId, string text, bool isTcp = false)
        {
            var pen = GetPen(studentId);
            if (pen == null || pen.PenStatus.IsOnline == false) return;

            pen.SendText(text, isTcp);
        }
        /// <summary>
        /// 向所有设备发送文本
        /// </summary>
        /// <param name="text"></param>
        public void SendText(string text, bool isTcp = false)
        {
            foreach (var studentId in APP.StudySession.StudentIds)
            {
                SendText(studentId, text);
            }
        }
        #endregion

        #region 重新所有笔的状态
        /// <summary>
        /// 重新所有笔的状态（以及缓存的所有答案）
        /// </summary>
        public void ResetStatus()
        {
            FlowManage.ClearAnswer();
            foreach (var studentId in APP.StudySession.StudentIds)
            {
                var pen = GetPen(studentId);
                if (pen != null) pen.ResetStatus();
            }
        }
        #endregion
    }
}
