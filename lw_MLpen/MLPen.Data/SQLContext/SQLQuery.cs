using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Chloe;

namespace MLPen.Data
{
    internal class SQLQuery : ISQLQuery
    {
        private IDbContext dbContext;
        private string sql;
        private CommandType cmdType;
        private DbParam[] parameter;

        public SQLQuery(IDbContext dbContext, string sql, CommandType cmdType, object parameter)
        {
            this.dbContext = dbContext;
            this.sql = sql;
            this.cmdType = cmdType;
            this.parameter = dbContext.BuildParams(parameter); ;
        }

        #region FirstOrDefault
        public T FirstOrDefault<T>(Func<dynamic, T> selector)
        {
            return this.FirstOrDefault<dynamic>().Select(selector).FirstOrDefault();
        }
        public T FirstOrDefault<T>()
        {
            return dbContext.SqlQuery<T>(sql, cmdType, parameter).FirstOrDefault();
        }
        #endregion

        #region ToList
        public List<T> ToList<T>(Func<dynamic, T> selector)
        {
            return this.ToList<dynamic>().Select(selector).ToList();
        }
        public List<T> ToList<T>()
        {
            return dbContext.SqlQuery<T>(sql, cmdType, parameter).ToList();
        }
        #endregion

        #region ToScalar
        public T ToScalar<T>()
        {
            try
            {
                return (T)dbContext.Session.ExecuteScalar(sql, cmdType, parameter);
            }
            catch
            {
                return default(T);
            }
        }
        #endregion

        #region ExecuteNonQuery
        public int ExecuteNonQuery()
        {
            return dbContext.Session.ExecuteNonQuery(sql, cmdType, parameter);
        }
        #endregion
    }
}
