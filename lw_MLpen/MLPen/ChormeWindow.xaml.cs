using Fleck;
using MLPen.Controls;
using MLPen.Dialogs;
using MLPen.Helpers;
using MLPen.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using static MLPen.Controls.UCPractice;
using WebSocketSharp;
using WebSocketSharp.Net;
using WebSocketSharp.Server;

namespace MLPen
{
    /// <summary>
    /// ChormeWindow.xaml 的交互逻辑
    /// </summary>
    public partial class ChormeWindow : MLDialog
    {
        public static readonly DependencyProperty ChormeMarginProperty = 
            DependencyProperty.Register("ChormeMargin", typeof(double), typeof(ChormeWindow), new PropertyMetadata(10D));
        public static ClientSocket clientSocket;
        public ChormeWindow()
        {
            InitializeComponent();
            clientSocket = new ClientSocket();
            Chrome.LoadEnd += (s, e) =>
            {
                this.UICall(() => { Loading.IsOpen = false; });
            };
            Chrome.LoadError += (s, e) =>
            {
                this.UICall(() => { Loading.IsOpen = false; });
            };
            Chrome.SetParent(this);
        }

        /// <summary>
        /// Url Address
        /// </summary>
        public string Address { get { return Chrome.Address; } set { Chrome.Address = value; } }

        #region 加载指定网址
        /// <summary>
        /// 加载指定网址
        /// </summary>
        /// <param name="urlOrPath"></param>
        public void LoadUrl(string urlOrPath)
        {
            Chrome.LoadUrl(urlOrPath);
        }
        #endregion

        #region 加载指定HTML
        /// <summary>
        /// 加载指定网址
        /// </summary>
        /// <param name="html"></param>
        public void LoadHtml(string html)
        {
            Chrome.LoadHtml(html);
        }
        #endregion

        #region 脚本（已废掉）
        ///// <summary>
        ///// 脚本
        ///// </summary>
        //public class ChormeScript
        //{
        //    private ChormeWindow chormeWindow;

        //    public ChormeScript(ChormeWindow window)
        //    {
        //        this.chormeWindow = window;
        //    }
        //    public void showMessage(string text, string title = "提示")
        //    {
        //        this.chormeWindow.Dispatcher.BeginInvoke(new Action(() =>  //不会报错
        //        {
        //            MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, title, text);
        //        }));
        //    }
        //    /// <summary>
        //    /// 关闭当前窗口
        //    /// </summary>
        //    public void closeWindow()
        //    {
        //        this.chormeWindow.Dispatcher.BeginInvoke(new Action(() =>  //不会报错
        //        {
        //            try
        //            {
        //                this.chormeWindow.DialogResult = false;
        //            }
        //            catch
        //            {
        //                this.chormeWindow.Close();
        //            }
        //        }));
               
        //    }

        //    /// <summary>
        //    /// 返回给前端页面TOKEN参数
        //    /// </summary>
        //    /// <returns></returns>
        //    public string getToken()
        //    {
        //        var tokenManage = Api.TokenManage.Instance();
        //        if (tokenManage.HasToken)
        //        {
        //            return tokenManage.Token;
        //        }
        //        return "";
        //    }

        //}
        #endregion


        /// <summary>
        /// 图片高度
        /// </summary>
        [Category("布局"), Description("图片高度")]
        public double ChormeMargin
        {
            get { return (double)GetValue(ChormeMarginProperty); }
            set { SetValue(ChormeMarginProperty, value); }
        }

        internal UCChorme ChromeMain
        {
            get { return Chrome; }
        }

        #region 启动websocket
        /*
        IWebSocketConnection webSocketConnection;
        public void startUpWebsocket()
        {
            
            FleckLog.Level = Fleck.LogLevel.Debug;
            var server = new WebSocketServer("ws://0.0.0.0:7181");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    webSocketConnection = socket;
                };
                socket.OnClose = () =>
                {
                    int a = 1;
                };
                socket.OnMessage = message =>
                {
                    Console.WriteLine(message);
                };
            });

        }*/
        #endregion

        [DllImport("User32.dll", EntryPoint = "SendMessage")]
        private static extern int SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, ref COPYDATASTRUCT lParam);

        const int WM_COPYDATA = 0x004A; // 固定数值，不可更改

        public struct COPYDATASTRUCT

        {
            public IntPtr dwData; // 任意值
            public int cbData;    // 指定lpData内存区域的字节数
            [MarshalAs(UnmanagedType.LPStr)]
            public string lpData; // 发送给目标窗口所在进程的数据
        }
        // 导出FindWindow函数，用于找到目标窗口所在进程
        [DllImport("User32.dll", EntryPoint = "FindWindow")]

        private static extern int FindWindow(string lpClassName, string lpWindowName);

        protected override void OnSourceInitialized(EventArgs e)
        {
            base.OnSourceInitialized(e);
            HwndSource hwndSource = PresentationSource.FromVisual(this) as HwndSource;
            if (hwndSource != null)
            {
                IntPtr handle = hwndSource.Handle;
                hwndSource.AddHook(new HwndSourceHook(WndProc));
            }

        }

        IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            if (msg == WM_COPYDATA)
            {
                COPYDATASTRUCT cds = (COPYDATASTRUCT)Marshal.PtrToStructure(lParam, typeof(COPYDATASTRUCT)); // 接收封装的消息
                string rece = cds.lpData; 
                clientSocket.wssv.WebSocketServices.Broadcast(rece);
                return hwnd;
            }
            return hwnd;
        }
    }
}
