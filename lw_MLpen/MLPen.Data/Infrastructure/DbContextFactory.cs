using Chloe;
using Chloe.MySql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 数据库工厂
    /// </summary>
    public class DbContextFactory
    {
        private DbContextFactory() { }

        /// <summary>
        /// 创建默认数据库操作上下文件
        /// </summary>
        /// <returns></returns>
        public static IDbContext CreateContext()
        {
            var factory = new DbContextFactory();
            return factory.Create();
        }

        IDbContext Create()
        {
            var conn = DbConnHelper.Instance();

            IDbContext dbContext = CreateMySqlContext(conn.ConnString);
            return dbContext;
        }
        IDbContext CreateMySqlContext(string connString)
        {
            MySqlContext dbContext = new MySqlContext(new MySqlConnectionFactory(connString));
            return dbContext;
        }
    }
}
