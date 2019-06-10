using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chloe.Infrastructure;
using MySql.Data.MySqlClient;

namespace MLPen.Data
{
    /// <summary>
    /// MySQL连接工厂
    /// </summary>
    internal class MySqlConnectionFactory : IDbConnectionFactory
    {
        string _connString = null;
        /// <summary>
        /// 实例化
        /// </summary>
        /// <param name="connString"></param>
        public MySqlConnectionFactory(string connString)
        {
            this._connString = connString;
        }
        /// <summary>
        /// 创建链接
        /// </summary>
        /// <returns></returns>
        public IDbConnection CreateConnection()
        {
            IDbConnection conn = new MySqlConnection(this._connString);
            conn = new Chloe.MySql.ChloeMySqlConnection(conn);
            return conn;
        }
    }
}
