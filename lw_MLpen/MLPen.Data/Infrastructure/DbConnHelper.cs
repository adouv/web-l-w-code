using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 数据库连接字符串
    /// </summary>
    internal class DbConnHelper
    {
        /// <summary>
        /// MYSQL 连接字符串
        /// </summary>
        private const String M_CONNSTRING_MYSQL = "server={0};port={1};database={2};user id={3};password={4};charset=utf8;pooling=true";

        #region 实例化
        internal static DbConnHelper Instance()
        {
            return new DbConnHelper();
        }
        #endregion

        /// <summary>
        /// 数据库连接字符串
        /// </summary>
        public string ConnString { get; private set; }

        private DbConnHelper()
        {
            ConnString = M_CONNSTRING_MYSQL.Formats(MSConfig.db_server, MSConfig.db_port, MSConfig.db_name, MSConfig.db_user, MSConfig.db_pwd);
        }
    }
}
