using CefSharp;
using CefSharp.Wpf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.Controls
{
    /// <summary>
    /// UCChorme.xaml 的交互逻辑
    /// </summary>
    public partial class UCChorme : UserControl
    {
        private Window mParent;
        public event EventHandler<FrameLoadStartEventArgs> LoadStart;
        public event EventHandler<FrameLoadEndEventArgs> LoadEnd;
        public event EventHandler<LoadErrorEventArgs> LoadError;
        private ChromiumWebBrowser Chrome;

        public UCChorme()
        {
            InitializeComponent();

            if (this.IsDesignMode()) return;

            //动态创建，以免可视化时组件异常
            Chrome = new ChromiumWebBrowser();
            Chrome.MenuHandler = new Handlers.ChromeMenuHandler();
            Chrome.RegisterJsObject("lw", new ChormeScripts(this), new CefSharp.BindingOptions()
            {
                CamelCaseJavascriptNames = false
            });
            Chrome.FrameLoadStart += (s, e) =>
            {
                LoadStart?.Invoke(s, e);
            };
            Chrome.FrameLoadEnd += (s, e) =>
            {
                LoadEnd?.Invoke(s, e);
            };
            Chrome.LoadError += (s, e) =>
            {
                LoadError?.Invoke(s, e);
            };
            this.root.Children.Add(Chrome);
        }

        /// <summary>
        /// 设置父级窗体
        /// </summary>
        /// <param name="window"></param>
        public void SetParent(Window window)
        {
            this.mParent = window;
        }

        /// <summary>
        /// Url Address
        /// </summary>
        public string Address { get { return Chrome.Address; } set { Chrome.Address = MSUtils.LoadWebPath(value); } }
        /// <summary>
        /// 加载指定的网址
        /// </summary>
        /// <param name="urlOrPath"></param>
        public void LoadUrl(string urlOrPath)
        {
            Chrome.Load(MSUtils.LoadWebPath(urlOrPath));
        }
        /// <summary>
        /// 加载HTML内容
        /// </summary>
        /// <param name="html"></param>
        public void LoadHtml(string html)
        {
            Chrome.LoadHtml(html, "http://customrendering/");
        }

        /// <summary>
        /// 关闭窗口
        /// </summary>
        internal void CloseWindow()
        {
            if (this.mParent == null) return;

            try
            {
                this.mParent.DialogResult = false;
            }
            catch
            {
                this.mParent.Close();
            }
        }

        /// <summary>
        /// 设置自定义的交互脚本对象
        /// </summary>
        /// <param name="key"></param>
        /// <param name="obj"></param>
        internal void SetJSObject(string key, object obj)
        {
            Chrome.RegisterJsObject(key, obj, new CefSharp.BindingOptions()
            {
                CamelCaseJavascriptNames = false
            });
        }

        /// <summary>
        /// 缩放网页，level=0 为默认
        /// </summary>
        internal void ScaleWeb(double level)
        {
            Chrome.WebBrowser.SetZoomLevel(level);
        }
    }
}
