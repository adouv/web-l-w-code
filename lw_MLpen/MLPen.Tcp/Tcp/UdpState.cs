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
    /// UDP状态
    /// </summary>
    public class UdpState
    {
        /// <summary>
        /// 服务器端
        /// </summary>
        public UdpClient UdpClient = null;
        /// <summary>
        /// 接受数据缓冲区
        /// </summary>
        public byte[] Buffer = new byte[10 * 1024];
        /// <summary>
        /// 远程终端
        /// </summary>
        public IPEndPoint IpEndPoint;
        /// <summary>
        /// 标志位
        /// </summary>
        public bool Flag = false;
    }
}
