using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Packs
{
    /// <summary>
    /// 笔迹
    /// </summary>
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    [Serializable()]
    public struct Pendot
    {
        public byte tag;//0x55
        public byte len;//长度
        public byte packet_type;//0x01 坐标, 0x02 心跳
        public uint penid;//学号
        public ushort pressure;//压力值
        public int x;
        public int y;
        public byte penbox_vol;//笔盒电池电压
        public byte pen_vol;//笔电池电压
        public byte chk;//累加和校验
    }
}
