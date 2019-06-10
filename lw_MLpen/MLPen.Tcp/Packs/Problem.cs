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
    public struct Problem
    {
        public byte tag;//0x55
        public byte len;//长度
        public byte packet_type;//0x03 按键
        public ushort sn;//包序号
        public uint penid;//学号
        public byte penbox_vol;//笔盒电池电压
        public byte pen_vol;//笔电池电压
        public byte prob;//按键值
        public byte chk;//累加和校验
    }
}
