using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 全局输出
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class MSResult<T>
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
        public T data { get; set; }

        /// <summary>
        /// 创建一个MSResult 返回正确
        /// </summary>
        /// <returns></returns>
        public static MSResult<T> Init()
        {
            return Init(true, null, default(T));
        }
        /// <summary>
        /// 创建一个MSResult 返回false
        /// </summary>
        /// <param name="msg">提示的消息</param>
        /// <returns></returns>
        public static MSResult<T> Init(string msg)
        {
            return Init(false, msg, default(T));
        }
        /// <summary>
        /// 创建一个MSResult 返回false
        /// </summary>
        /// <param name="ex">错误</param>
        /// <returns></returns>
        public static MSResult<T> Init(Exception ex)
        {
            return Init(false, Helpers.ExceptionHelper.Init(ex), default(T));
        }
        /// <summary>
        /// 创建一个MSResult（带数据-正确）
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static MSResult<T> Init(T data)
        {
            return Init(true, null, data);
        }
        /// <summary>
        /// 创建一个MSResult
        /// </summary>
        /// <param name="flag">是否正确</param>
        /// <param name="msg">提示的消息</param>
        /// <returns></returns>
        public static MSResult<T> Init(bool flag, object msg)
        {
            return Init(flag, msg, default(T));
        }
        /// <summary>
        /// 创建一个MSResult
        /// </summary>
        /// <param name="flag">是否正确</param>
        /// <param name="msg">提示的消息</param>
        /// <param name="data">数据</param>
        /// <returns></returns>
        public static MSResult<T> Init(bool flag, object msg, T data)
        {
            return new MSResult<T>() { flag = flag, msg = msg == null ? null : Convert.ToString(msg), data = data };
        }
    }
}
