using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 全局统一输出
    /// </summary>
    public class MSResult
    {
        /// <summary>
        /// 是否操作成功
        /// </summary>
        public bool flag { get; set; } = true;
        /// <summary>
        /// 提示信息
        /// </summary>
        public string msg { get; set; }
        /// <summary>
        /// 自定义数据
        /// </summary>
        public object data { get; set; }

        /// <summary>
        /// 创建一个MSResult 返回正确
        /// </summary>
        /// <returns></returns>
        public static MSResult Init()
        {
            return Init(true, null, null);
        }
        /// <summary>
        /// 创建一个MSResult 返回false
        /// </summary>
        /// <param name="msg">提示的消息</param>
        /// <returns></returns>
        public static MSResult Init(string msg)
        {
            return Init(false, msg, null);
        }
        /// <summary>
        /// 创建一个MSResult 返回false
        /// </summary>
        /// <param name="ex">错误</param>
        /// <returns></returns>
        public static MSResult Init(Exception ex)
        {
            return Init(false, Helpers.ExceptionHelper.Init(ex), null);
        }
        /// <summary>
        /// 创建一个MSResult（带数据-正确）
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static MSResult Init(object data)
        {
            return Init(true, null, data);
        }
        /// <summary>
        /// 创建一个MSResult
        /// </summary>
        /// <param name="flag">是否正确</param>
        /// <param name="msg">提示的消息</param>
        /// <returns></returns>
        public static MSResult Init(bool flag, object msg)
        {
            return Init(flag, msg, null);
        }
        /// <summary>
        /// 创建一个MSResult
        /// </summary>
        /// <param name="flag">是否正确</param>
        /// <param name="msg">提示的消息</param>
        /// <param name="data">数据</param>
        /// <returns></returns>
        public static MSResult Init(bool flag, object msg, object data)
        {
            var msgText = Convert.ToString(msg);
            if (msgText.IsNotEmtpy()) msgText = msgText.Replace("System.Exception:", string.Empty);
            return new MSResult() { flag = flag, msg = msgText, data = data };
        }
    }
}
