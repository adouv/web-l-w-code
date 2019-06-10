using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Packs
{
    /// <summary>
    /// 按键包数据结构：这个需应答，应答原样返回
    /// </summary>
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    [Serializable()]
    public struct ExtPacketInfo
    {
        /// <summary>
        /// 包头
        /// </summary>
        public PacketHeader ph;
        /// <summary>
        /// 指令数据
        /// </summary>
        public IntPtr cmd_data;
        /// <summary>
        /// 接收数据完成由接收端程序置1
        /// </summary>
        public byte rok;
    }
}
