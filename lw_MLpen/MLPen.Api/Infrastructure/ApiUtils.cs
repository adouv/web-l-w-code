using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Api
{
    /// <summary>
    /// API工具类
    /// </summary>
    internal class ApiUtils
    {
        /// <summary>
		/// 获取时间戳
		/// </summary>
		/// <returns></returns>
		internal static string GetTimestamp()
        {
            return DateTime.Now.ToUnixTimestamp().ToString();
        }
        /// <summary>
		/// 获取随机字符串
		/// </summary>
		/// <returns></returns>
		internal static string GetNoncestr()
        {
            return Guid.NewGuid().ToMD5();
        }
    }
}
