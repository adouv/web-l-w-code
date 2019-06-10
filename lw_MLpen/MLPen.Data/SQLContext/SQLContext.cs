using Chloe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// SQL查询上下文
    /// </summary>
    public abstract class SQLContext : Disposable, ISQLContext
    {
        protected IDbContext DbContext;
        protected SQLContext(IUnitOfWorks works)
        {
            DbContext = works.DBContext;
        }

        #region SQLQuery
        public ISQLQuery SQLQuery(string sql, object parameter = null)
        {
            return SQLQuery(sql, CommandType.Text, parameter);
        }
        public ISQLQuery SQLQuery(string sql, CommandType cmdType, object parameter = null)
        {
            return new SQLQuery(DbContext, sql, cmdType, parameter);
        }
        #endregion

        #region DoTrans
        public MSResult DoTrans(Action<ITransContext> act)
        {
            try
            {
                DbContext.DoWithTransaction(() =>
                {
                    act(new TransContext(DbContext));
                });
                return MSResult.Init();
            }
            catch (Exception ex)
            {
                return MSResult.Init(ex);
            }
        }
        public MSResult<TResult> DoTrans<TResult>(Func<ITransContext, TResult> act)
        {
            try
            {
                TResult result = default(TResult);
                result = DbContext.Session.DbContext.DoWithTransaction(() =>
                {
                    return act(new TransContext(DbContext));
                });
                return MSResult<TResult>.Init(result);
            }
            catch (Exception ex)
            {
                return MSResult<TResult>.Init(ex);
            }
        }
        #endregion

        #region DoBatch
        public void DoBatch(Action<IBatchContext> action, int batchSize = 10)
        {
            DoTrans(trans => trans.DoBatch(action));
        }
        #endregion
    }
}
