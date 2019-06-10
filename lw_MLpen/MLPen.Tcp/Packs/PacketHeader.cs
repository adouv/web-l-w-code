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
    public struct PacketHeader
    {
        /// <summary>
        /// 扩展包标志
        /// </summary>
        public byte tag;//0xaa
        /// <summary>
        /// 包头从packet_type开始的CRC16 校验
        /// </summary>
        public ushort pcrc16;
        /// <summary>
        /// 包类型 0x01 数据包
        /// </summary>
        public byte packet_type;
        /// <summary>
        /// 设备ID 6字节 MAC数据
        /// </summary>
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 6)]
        public byte[] deviceid;
        /// <summary>
        /// 包序号
        /// </summary>
        public ushort sn;
        /// <summary>
        /// 请求或应答标志，0请求，1应答
        /// </summary>
        public byte req_ack;
        /// <summary>
        /// 指令
        /// </summary>
        public byte cmd;
        /// <summary>
        /// 指令数据CRC16校验
        /// </summary>
        public ushort cmd_dcrc16;
        /// <summary>
        /// 指令数据长度
        /// </summary>
        public ushort cmd_len;
    }
}
