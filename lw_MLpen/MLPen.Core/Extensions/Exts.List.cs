using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    // <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        #region 合并数组或集合
        /// <summary>
        /// 合并数组或集合
        /// </summary>
        /// <param name="separator">分隔符</param>
        /// <returns></returns>
        public static string ToJoin<T>(this IEnumerable<T> list, string separator)
        {
            return string.Join(separator, list);
        }
        #endregion
    }
}
