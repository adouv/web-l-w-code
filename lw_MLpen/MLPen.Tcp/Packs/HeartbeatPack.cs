using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Packs
{
    /// <summary>
    /// 笔迹和心跳包数据结构
    /// </summary>
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    [Serializable()]
    public struct HeartbeatPack
    {
        /// <summary>
        /// 0x55 包头
        /// </summary>
        public byte tag;
        /// <summary>
        /// 长度
        /// </summary>
        public byte len;
        /// <summary>
        /// 0x02 心跳
        /// </summary>
        public byte packet_type;
        /// <summary>
        /// 学号
        /// </summary>
        public uint penid;
        /// <summary>
        /// 设备ID 6字节 MAC数据
        /// </summary>
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 6)]
        public byte[] deviceid;
        /// <summary>
        /// 笔盒电池电压
        /// </summary>
        public byte penbox_vol;
        /// <summary>
        /// 笔电池电压
        /// </summary>
        public byte pen_vol;
        /// <summary>
        /// 累加和校验
        /// </summary>
        public byte chk;
    }
}
