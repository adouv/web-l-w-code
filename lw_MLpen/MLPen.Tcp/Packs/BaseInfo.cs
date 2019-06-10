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
    public struct BaseInfo
    {
        /// <summary>
        /// 2字节生产园区 ID 1-65535
        /// </summary>
        public ushort factory;
        /// <summary>
        /// 2字节学校编码，应用园区ID 1-65535
        /// </summary>
        public ushort school;
        /// <summary>
        /// 1字节开户状态 0,未开户，1园区开户，2使用开户
        /// </summary>
        public byte KH_Sta;
        /// <summary>
        /// 33字节 开户 SSID
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 33)]
        public string KH_wifi_ssid;
        /// <summary>
        /// 30字节 开户 wifi password
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 30)]
        public string KH_wifi_password;
        /// <summary>
        /// 设备状态，0激活，1挂失
        /// </summary>
        public byte Dev_Sta;
        /// <summary>
        /// 20X65字节 班级wifi信息
        /// </summary>
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 20)]
        public CwifiInfo[] ClassZ;
        /// <summary>
        /// 33字节 当前连接wifi的 SSID
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 33)]
        public string wifi_ssid;
        /// <summary>
        /// 4字节 学号 1-4294967295
        /// </summary>
        public uint epenuid;
        /// <summary>
        /// 1字节 年级 1-255
        /// </summary>
        public byte grade;
        /// <summary>
        /// 1字节 行政班级 1-255
        /// </summary>
        public byte Class;
        /// <summary>
        /// 30字节 姓名
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 30)]
        public string name;
        /// <summary>
        /// 10字节 职务
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 10)]
        public string position;
        /// <summary>
        /// 10字节 室
        /// </summary>
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 10)]
        public string room;
    }
}
