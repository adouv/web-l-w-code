using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;

namespace MLPen
{
    // <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        /// <summary>
        /// 判断是否是设计模式
        /// </summary>
        /// <param name="control"></param>
        /// <returns></returns>
        public static bool IsDesignMode(this Control control)
        {
            return System.ComponentModel.DesignerProperties.GetIsInDesignMode(control);
        }

        #region 显示对话框
        /// <summary>
        /// 显示普通消息对话框
        /// </summary>
        /// <param name="window"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public static MSMessageBox.MessageResult ShowMessageInformation(this ContentControl window, string text)
        {
            return MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "提示", text);
        }
        /// <summary>
        /// 显示错误信息对话框
        /// </summary>
        /// <param name="window"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public static MSMessageBox.MessageResult ShowMessageError(this ContentControl window, string text)
        {
            return MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "错误", text);
        }
        /// <summary>
        /// 显示错误信息对话框
        /// </summary>
        /// <param name="window"></param>
        /// <param name="ex">错误</param>
        /// <returns></returns>
        public static MSMessageBox.MessageResult ShowMessageError(this ContentControl window, Exception ex)
        {
            return MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "错误", Helpers.ExceptionHelper.GetMessage(ex));
        }
        /// <summary>
        /// 显示警告对话框
        /// </summary>
        /// <param name="window"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public static MSMessageBox.MessageResult ShowMessageExclamation(this ContentControl window, string text)
        {
            return MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, "警告", text);

        }
        #endregion

        #region 按钮加载状态
        class ButtonLoading
        {
            public object Content { get; set; }
            public object Tag { get; set; }
        }
        /// <summary>
        /// 按钮加载状态
        /// </summary>
        /// <param name="button"></param>
        /// <param name="action"></param>
        /// <param name="loadingText"></param>
        public static void Button(this Button button, string action, string loadingText = "Loading")
        {
            var item = button.Tag as ButtonLoading;
            switch (action)
            {
                case "loading":
                    if (item == null) item = new ButtonLoading()
                    {
                        Content = button.Content,
                    };
                    item.Tag = button.Tag;
                    button.IsEnabled = false;
                    button.Content = loadingText;
                    button.Tag = item;
                    break;
                case "reset":
                    if (item == null) return;
                    button.IsEnabled = true;
                    button.Content = item.Content;
                    button.Tag = item.Tag;
                    break;
            }
        }
        #endregion

        #region 延长指定时间
        /// <summary>
        /// 延长指定时间
        /// </summary>
        /// <param name="waitTime"></param>
        public static void Sleep(this Control window, int waitTime)
        {
            System.Threading.Thread.Sleep(waitTime);
        }
        #endregion

        #region 异步调用方法，并等待指定的时间
        /// <summary>
        /// 异步调用方法，并等待指定的时间
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="window"></param>
        /// <param name="ThreadCall">线程方法</param>
        /// <param name="waitTime">等待时间</param>
        public static void UIAsync<T>(this T window, Action<T> ThreadCall, int waitTime) where T : Control
        {
            Task.Run(() =>
            {
                window.Sleep(waitTime);
                ThreadCall(window);
            });
        }
        /// <summary>
        /// 异步调用方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="window"></param>
        /// <param name="ThreadCall">线程方法</param>
        public static void UIAsync<T>(this T window, Action<T> ThreadCall) where T : Control
        {
            Task.Run(() =>
            {
                ThreadCall(window);
            });
        }
        /// <summary>
        /// 异步调用方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="window"></param>
        /// <param name="ThreadCall">线程方法</param>
        public static void UIAsync<T>(this T window, Action ThreadCall) where T : Control
        {
            new Thread(new ThreadStart(ThreadCall)).Start();
        }
        #endregion

        #region 调用UI线程的方法
        /// <summary>
        /// 调用UI线程的方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="window"></param>
        /// <param name="call">方法</param>
        /// <param name="data">数据</param>
        public static void UICall<T, TData>(this T window, Action<TData> call, TData data) where T : Control
        {
            window.Dispatcher.BeginInvoke(call, data);
        }
        #endregion

        #region 调用UI线程的方法
        /// <summary>
        /// 调用UI线程的方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="window"></param>
        /// <param name="call">方法</param>
        public static void UICall<T>(this T window, Action call) where T : Control
        {
            window.Dispatcher.BeginInvoke(call);
        }
        #endregion
    }
}
