using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Tcp
{
    /// <summary>
    /// 异步TCP服务器
    /// </summary>
    public class TcpServer : IDisposable
    {
        #region Fields
        private TcpListener listener;
        private List<TcpState> clients;
        private bool disposed = false;
        #endregion

        #region Ctors

        /// <summary>
        /// 异步TCP服务器
        /// </summary>
        /// <param name="listenPort">监听的端口</param>
        public TcpServer(int listenPort)
          : this(IPAddress.Any, listenPort)
        {
        }

        /// <summary>
        /// 异步TCP服务器
        /// </summary>
        /// <param name="localEP">监听的终结点</param>
        public TcpServer(IPEndPoint localEP)
          : this(localEP.Address, localEP.Port)
        {
        }

        /// <summary>
        /// 异步TCP服务器
        /// </summary>
        /// <param name="localIPAddress">监听的IP地址</param>
        /// <param name="listenPort">监听的端口</param>
        public TcpServer(IPAddress localIPAddress, int listenPort)
        {
            Address = localIPAddress;
            Port = listenPort;
            this.Encoding = Encoding.Default;

            clients = new List<TcpState>();

            listener = new TcpListener(Address, Port);
            listener.AllowNatTraversal(true);
        }

        #endregion

        #region Properties

        /// <summary>
        /// 服务器是否正在运行
        /// </summary>
        public bool IsRunning { get; private set; }
        /// <summary>
        /// 监听的IP地址
        /// </summary>
        public IPAddress Address { get; private set; }
        /// <summary>
        /// 监听的端口
        /// </summary>
        public int Port { get; private set; }
        /// <summary>
        /// 通信使用的编码
        /// </summary>
        public Encoding Encoding { get; set; }

        #endregion

        #region Server

        /// <summary>
        /// 启动服务器
        /// </summary>
        /// <returns>异步TCP服务器</returns>
        public TcpServer Start()
        {
            if (!IsRunning)
            {
                IsRunning = true;
                listener.Start();
                listener.BeginAcceptTcpClient(new AsyncCallback(HandleTcpClientAccepted), listener);
            }
            return this;
        }

        /// <summary>
        /// 启动服务器
        /// </summary>
        /// <param name="backlog">服务器所允许的挂起连接序列的最大长度</param>
        /// <returns>异步TCP服务器</returns>
        public TcpServer Start(int backlog)
        {
            if (!IsRunning)
            {
                IsRunning = true;
                listener.Start(backlog);
                listener.BeginAcceptTcpClient(new AsyncCallback(HandleTcpClientAccepted), listener);
            }
            return this;
        }

        /// <summary>
        /// 停止服务器
        /// </summary>
        /// <returns>异步TCP服务器</returns>
        public TcpServer Stop()
        {
            if (IsRunning)
            {
                IsRunning = false;
                listener.Stop();

                lock (this.clients)
                {
                    for (int i = 0; i < this.clients.Count; i++)
                    {
                        this.clients[i].TcpClient.Client.Disconnect(false);
                    }
                    this.clients.Clear();
                }

            }
            return this;
        }

        #endregion

        #region Receive
        private void HandleTcpClientAccepted(IAsyncResult ar)
        {
            if (IsRunning)
            {
                TcpListener tcpListener = (TcpListener)ar.AsyncState;

                TcpClient tcpClient = tcpListener.EndAcceptTcpClient(ar);
                byte[] buffer = new byte[tcpClient.ReceiveBufferSize];

                TcpState internalClient = new TcpState(tcpClient, buffer);
                lock (this.clients)
                {
                    this.clients.Add(internalClient);
                    HandleClientConnected?.Invoke(internalClient);
                }

                NetworkStream networkStream = internalClient.NetworkStream;
                networkStream.BeginRead(internalClient.Buffer, 0, internalClient.Buffer.Length, HandleDatagramReceived, internalClient);

                tcpListener.BeginAcceptTcpClient(new AsyncCallback(HandleTcpClientAccepted), ar.AsyncState);
            }
        }
        private void HandleDatagramReceived(IAsyncResult ar)
        {
            if (IsRunning)
            {
                TcpState internalClient = (TcpState)ar.AsyncState;
                NetworkStream networkStream = internalClient.NetworkStream;

                int numberOfReadBytes = 0;
                try
                {
                    numberOfReadBytes = networkStream.EndRead(ar);
                }
                catch
                {
                    numberOfReadBytes = 0;
                }

                if (numberOfReadBytes == 0)
                {
                    // 连接已关闭
                    lock (this.clients)
                    {
                        this.clients.Remove(internalClient);
                        HandleClientDisconnected?.Invoke(internalClient);
                        return;
                    }
                }

                // 接收到字节和触发事件通知
                byte[] receivedBytes = new byte[numberOfReadBytes];
                Buffer.BlockCopy(internalClient.Buffer, 0, receivedBytes, 0, numberOfReadBytes);
                HandleDataReceived?.Invoke(internalClient, receivedBytes);
                HandleTextReceived?.Invoke(internalClient, this.Encoding.GetString(receivedBytes, 0, receivedBytes.Length));

                // 继续侦听TCP数据报包
                networkStream.BeginRead(internalClient.Buffer, 0, internalClient.Buffer.Length, HandleDatagramReceived, internalClient);
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
        public Action<TcpState, byte[]> HandleDataReceived;
        /// <summary>
        /// 接收到数据报文明文事件
        /// </summary>
        public Action<TcpState, string> HandleTextReceived;
        /// <summary>
        /// 与客户端的连接已建立事件
        /// </summary>
        public Action<TcpState> HandleClientConnected;
        /// <summary>
        /// 与客户端的连接已断开事件
        /// </summary>
        public Action<TcpState> HandleClientDisconnected;
        #endregion

        #region Send

        /// <summary>
        /// 发送报文至指定的客户端
        /// </summary>
        /// <param name="tcpClient">客户端</param>
        /// <param name="datagram">报文</param>
        public void Send(TcpClient tcpClient, byte[] datagram)
        {
            if (!IsRunning)
            {
                HandleException?.Invoke(new InvalidProgramException("This TCP server has not been started."));
                return;
            }

            if (tcpClient == null)
            {
                HandleException?.Invoke(new ArgumentNullException("tcpClient."));
                return;
            }

            if (datagram == null)
            {
                HandleException?.Invoke(new ArgumentNullException("datagram."));
                return;
            }
            tcpClient.GetStream().BeginWrite(datagram, 0, datagram.Length, HandleDatagramWritten, tcpClient);
        }

        private void HandleDatagramWritten(IAsyncResult ar)
        {
            ((TcpClient)ar.AsyncState).GetStream().EndWrite(ar);
        }

        /// <summary>
        /// 发送报文至指定的客户端
        /// </summary>
        /// <param name="tcpClient">客户端</param>
        /// <param name="datagram">报文</param>
        public void Send(TcpClient tcpClient, string datagram)
        {
            Send(tcpClient, this.Encoding.GetBytes(datagram));
        }

        /// <summary>
        /// 发送报文至所有客户端
        /// </summary>
        /// <param name="datagram">报文</param>
        public void SendAll(byte[] datagram)
        {
            if (!IsRunning)
            {
                HandleException?.Invoke(new InvalidProgramException("This TCP server has not been started."));
                return;
            }

            for (int i = 0; i < this.clients.Count; i++)
            {
                Send(this.clients[i].TcpClient, datagram);
            }
        }

        /// <summary>
        /// 发送报文至所有客户端
        /// </summary>
        /// <param name="datagram">报文</param>
        public void SendAll(string datagram)
        {
            if (!IsRunning)
            {
                HandleException?.Invoke(new InvalidProgramException("This TCP server has not been started."));
                return;
            }

            SendAll(this.Encoding.GetBytes(datagram));
        }

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

                        if (listener != null)
                        {
                            listener = null;
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
