using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        /// <summary>
        /// 将GUID转换为MD5
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static string ToMD5(this Guid guid)
        {
            return Helpers.EncryptHelper.md5(guid.ToString());
        }
        /// <summary>
        /// 将Guid转换为UUID
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        public static string ToUUID(this Guid guid)
        {
            return guid.ToString().Replace("-", "");
        }
    }
}
