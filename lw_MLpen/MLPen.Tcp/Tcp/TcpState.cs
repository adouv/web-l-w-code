using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Tcp
{
    public class TcpState
    {
        public byte[] Buffer { get; set; }
        public TcpClient TcpClient { get; set; }
        public NetworkStream NetworkStream { get; set; }
        public TcpState(TcpClient tcpClient, byte[] buffer)
        {
            this.TcpClient = tcpClient;
            this.Buffer = buffer;
            this.NetworkStream = tcpClient.GetStream();
        }
    }
}
