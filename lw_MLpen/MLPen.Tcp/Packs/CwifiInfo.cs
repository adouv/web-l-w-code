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
    public struct CwifiInfo
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 33)]
        public string wifi_ssid;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 30)]
        public string wifi_pass;
        public byte grade;
        public byte Class;
    }
}
