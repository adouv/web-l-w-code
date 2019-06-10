using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MLPen.Tcp
{
    /// <summary>
    /// 异步UDP服务器
    /// </summary>
    public class UdpServer
    {
        #region Fields
        /// <summary>
        /// 接收UDP服务
        /// </summary>
        private UdpClient _udpServer;
        /// <summary>
        /// 发送UDP服务
        /// </summary>
        private UdpClient _udpClient;
        /// <summary>
        /// Udp服务端状态
        /// </summary>
        private UdpState _udpSeverState;
        /// <summary>
        /// Udp客户端状态
        /// </summary>
        private UdpState _udpClientState;
        /// <summary>
        /// 服务端节点
        /// </summary>
        private IPEndPoint _serverEP = null;
        /// <summary>
        /// 客户端节点
        /// </summary>
        private IPEndPoint _clientEP = null;

        // 异步状态同步
        private ManualResetEvent _serverDone = new ManualResetEvent(false);
        private ManualResetEvent _clientDone = new ManualResetEvent(false);
        /// <summary>
        /// 是否已经释放资源
        /// </summary>
        private bool disposed = false;
        private Thread mThread;
        #endregion

        #region Properties
        /// <summary>
        /// 服务器是否正在运行
        /// </summary>
        public bool IsRunning { get; private set; }
        #endregion

        #region 构造函数
        /// <summary>
        /// 异步UdpClient UDP服务器
        /// </summary>
        /// <param name="listenPort">监听的端口</param>
        public UdpServer(int serverPort, int clientPort)
        {
            this._serverEP = new IPEndPoint(IPAddress.Any, serverPort);
            this._clientEP = new IPEndPoint(Dns.GetHostAddresses(Dns.GetHostName())[0], clientPort);

            _udpServer = new UdpClient(this._serverEP);
            _udpClient = new UdpClient();

            _udpSeverState = new UdpState() { UdpClient = _udpServer, IpEndPoint = _serverEP };
            _udpClientState = new UdpState() { UdpClient = _udpClient, IpEndPoint = _clientEP };
        }
        #endregion

        #region Method
        /// <summary>
        /// 启动服务器
        /// </summary>
        /// <returns>异步TCP服务器</returns>
        public void Start()
        {
            if (!IsRunning)
            {
                IsRunning = true;
                mThread = new Thread(new ThreadStart(Receive));
                mThread.IsBackground = true;
                mThread.Start();
            }
        }
        /// <summary>
        /// 停止服务器
        /// </summary>
        public void Stop()
        {
            if (IsRunning)
            {
                try
                {
                    if (mThread != null && mThread.IsAlive)
                    {
                        mThread.Abort();
                    }
                }
                catch
                {
                }
                IsRunning = false;
                _udpServer.Close();
            }
        }
        /// <summary>
        /// 数据接收
        /// </summary>
        private void Receive()
        {
            lock (this)
            {
                _udpServer.BeginReceive(new AsyncCallback(ReceiveCallback), _udpSeverState);
                _serverDone.WaitOne();
            }
        }
        /// <summary>
        /// 数据接收回调函数
        /// </summary>
        /// <param name="ar"></param>
        private void ReceiveCallback(IAsyncResult ar)
        {
            UdpState udpState = ar.AsyncState as UdpState;
            if (ar.IsCompleted)
            {
                try
                {
                    var buffer = udpState.UdpClient.EndReceive(ar, ref udpState.IpEndPoint);
                    udpState.Buffer = buffer;
                    HandleDataReceived?.Invoke(this, udpState);
                }
                catch (Exception ex)
                {
                    HandleException?.Invoke(ex);
                }
                finally
                {
                    _serverDone.Set();
                    if (IsRunning && _udpServer != null) Receive();
                }
            }
        }

        /// <summary>
        /// 发送数据
        /// </summary>
        /// <param name="msg"></param>
        /// <param name="remote"></param>
        public void Send(byte[] datas, IPEndPoint remote)
        {
            try
            {
                _udpClient.Connect(remote);
                _udpClient.BeginSend(datas, datas.Length, new AsyncCallback(SendCallback), _udpClientState);
            }
            catch (Exception ex)
            {
                HandleException?.Invoke(ex);
            }
        }
        private void SendCallback(IAsyncResult ar)
        {
            UdpState udpState = ar.AsyncState as UdpState;
            if (ar.IsCompleted)
            {
                try
                {
                    udpState.UdpClient.EndSend(ar);
                }
                catch (Exception ex)
                {
                    HandleException?.Invoke(ex);
                }
                finally
                {
                }
            }
        }
        #endregion

        #region Events
        /// <summary>
        /// 异常错误
        /// </summary>
        public Action<Exception> HandleException;
        /// <summary>
        /// 接收到数据报文事件
        /// </summary>
        public Action<UdpServer, UdpState> HandleDataReceived;
        #endregion

        #region IDisposable Members
        /// <summary>
        /// 执行与释放相关联的应用程序定义的任务，
        /// 释放或重置非托管资源。
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// 释放非托管和可选托管资源
        /// </summary>
        /// <param name="disposing"><c>true</c> to release 
        /// 管理和非管理资源； <c>false</c> 
        /// 只释放非托管资源。</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    try
                    {
                        Stop();

                        if (_udpServer != null)
                        {
                            _udpServer = null;
                        }
                    }
                    catch (SocketException ex)
                    {
                        HandleException?.Invoke(ex);
                    }
                }
                disposed = true;
            }
        }
        #endregion
    }
}
