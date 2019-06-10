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
        /// <summary>
        /// 当前值是否存在
        /// </summary>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static bool IsDefined(this Enum value)
        {
            return Enum.IsDefined(value.GetType(), value);
        }
    }
}
