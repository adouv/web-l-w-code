using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Packs
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    [Serializable()]
    public struct ACKInf
    {
        /// <summary>
        /// 1字节命令执行状态，0失败，1成功
        /// </summary>
        public byte cmd_sta;
    }
}
