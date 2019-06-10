using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// Ini配置
    /// </summary>
    public class IniConfig
    {
        /// <summary>
        /// Section
        /// </summary>
        public enum Section
        {
            /// <summary>
            /// 数据库配置
            /// </summary>
            DB,
            /// <summary>
            /// 主机地址配置
            /// </summary>
            HOST
        }

        /// <summary>
        /// db-Key
        /// </summary>
        public enum DbKey
        {
            SERVER,
            PORT,
            NAME,
            USER,
            PWD
        }
    }
}
