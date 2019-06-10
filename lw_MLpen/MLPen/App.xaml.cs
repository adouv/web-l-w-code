using CefSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace MLPen
{
    /// <summary>
    /// App.xaml 的交互逻辑
    /// </summary>
    public partial class App : Application
    {
        private static Semaphore singleInstanceWatcher;
        private static bool createdNew;
        public static bool IsExit = false;

        protected override void OnStartup(StartupEventArgs e)
        {
            singleInstanceWatcher = new Semaphore(0, 1, Assembly.GetExecutingAssembly().GetName().Name, out createdNew);
            if (createdNew)
            {
                Application currApp = Application.Current;
                currApp.StartupUri = new Uri("MainWindow.xaml", UriKind.RelativeOrAbsolute);
                CefSharpSettings.LegacyJavascriptBindingEnabled = true;
                APP.Run();
            }
            else
            {
                Process current = Process.GetCurrentProcess();
                foreach (Process process in Process.GetProcessesByName(current.ProcessName))
                {
                    if (process.Id != current.Id)
                    {
                        WinApi.SetForegroundWindow(process.MainWindowHandle);
                        WinApi.ShowWindow(process.MainWindowHandle, WinApi.WindowShowStyle.ShowNormal);
                        break;
                    }
                }
                Environment.Exit(-2);
            }
        }
        protected override void OnExit(ExitEventArgs e)
        {
            App.IsExit = true;
            Cef.Shutdown();
            QueueManage.Instance.Exit();
            PenController.Instance.Exit();
            APP.Stop();

            base.OnExit(e);
        }
    }
}
