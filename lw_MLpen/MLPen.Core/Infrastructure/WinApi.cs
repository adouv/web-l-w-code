using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// Windows底层API
    /// </summary>
    public static class WinApi
    {
        /// <summary>
        /// 窗体样式
        /// </summary>
        public enum WindowShowStyle : uint
        {
            Hide = 0,
            ShowNormal = 1,
            ShowMinimized = 2,
            ShowMaximized = 3,
            Maximize = 3,
            ShowNormalNoActivate = 4,
            Show = 5,
            Minimize = 6,
            ShowMinNoActivate = 7,
            ShowNoActivate = 8,
            Restore = 9,
            ForceMinimized = 11
        }
        /// <summary>
        /// 将窗体设置为最前面显示
        /// </summary>
        /// <param name="hWnd"></param>
        /// <returns></returns>
        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
        /// <summary>
        /// 设置窗体样式
        /// </summary>
        /// <param name="hWnd"></param>
        /// <param name="nCmdShow"></param>
        /// <returns></returns>
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, WindowShowStyle nCmdShow);
        /// <summary>
        /// 写入INI文件
        /// </summary>
        /// <param name="section"></param>
        /// <param name="key"></param>
        /// <param name="val"></param>
        /// <param name="filePath"></param>
        /// <returns></returns>
        [DllImport("kernel32")]
        public static extern bool WritePrivateProfileString(string section, string key, string val, string filePath);
        /// <summary>
        /// 读取INI文件
        /// </summary>
        /// <param name="section"></param>
        /// <param name="key"></param>
        /// <param name="def"></param>
        /// <param name="retVal"></param>
        /// <param name="size"></param>
        /// <param name="filePath"></param>
        /// <returns></returns>
        [DllImport("kernel32")]
        public static extern int GetPrivateProfileString(string section, string key, string def, byte[] retVal, int size, string filePath);
        //[DllImport("kernel32.dll")]
        //public static extern bool AllocConsole();
        //[DllImport("kernel32.dll")]
        //public static extern bool FreeConsole();
        /// <summary>
        /// 检测当前用户网络是否连接
        /// </summary>
        /// <param name="Description"></param>
        /// <param name="ReservedValue"></param>
        /// <returns></returns>
        [DllImport("wininet.dll")]
        internal extern static bool InternetGetConnectedState(int Description, int ReservedValue);
    }
}
