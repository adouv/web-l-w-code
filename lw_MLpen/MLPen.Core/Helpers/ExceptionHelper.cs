using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 错误类
    /// </summary>
    public class ExceptionHelper
    {
        /// <summary>
        /// 初始化错误
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static Exception Init(Exception ex)
        {
            return Init(GetMessage(ex));
        }
        /// <summary>
        /// 自定义错误消息
        /// </summary>
        /// <param name="text"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        public static Exception Init(string text, params object[] format)
        {
            return new Exception(text.Formats(format));
        }

        #region 获取错误的具体的文本
        /// <summary>
        /// 获取错误的具体的文本
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string GetMessage(Exception ex)
        {
            if (ex.InnerException != null)
            {
                if (ex.InnerException.InnerException != null)
                {
                    if (ex.InnerException.InnerException.InnerException != null)
                    {
                        return ex.InnerException.InnerException.InnerException.Message;
                    }
                    else
                    {
                        return ex.InnerException.InnerException.Message;
                    }
                }
                else
                {
                    return ex.InnerException.Message;
                }
            }
            else
            {
                return ex.Message;
            }
        }
        #endregion
    }
}
