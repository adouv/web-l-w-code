using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// SQL查询上下文接口
    /// </summary>
    public interface ISQLContext : IDisposable
    {
        #region ISQLQuery-执行SQL语句
        /// <summary>
        /// 执行SQL语句(将自动转成小写)
        /// </summary>
        /// <param name="sql">SQL语名，建议不要使用 * 号</param>
        /// <param name="parameter">参数</param>
        /// <returns></returns>
        ISQLQuery SQLQuery(string sql, object parameter = null);
        /// <summary>
        /// 执行SQL语句(将自动转成小写)
        /// </summary>
        /// <param name="sql">SQL语名，建议不要使用 * 号</param>
        /// <param name="cmdType">执行</param>
        /// <param name="parameter">参数</param>
        /// <returns></returns>
        ISQLQuery SQLQuery(string sql, CommandType cmdType, object parameter = null);
        #endregion

        #region ITransContext
        /// <summary>
        /// 执行事务
        /// </summary>
        /// <param name="act"></param>
        /// <returns></returns>
        MSResult DoTrans(Action<ITransContext> act);
        /// <summary>
        /// 执行事务
        /// </summary>
        /// <typeparam name="TResult"></typeparam>
        /// <param name="act"></param>
        /// <returns></returns>
        MSResult<TResult> DoTrans<TResult>(Func<ITransContext, TResult> act);
        #endregion

        #region IBatchContext
        /// <summary>
        /// 批量操作
        /// </summary>
        /// <param name="action"></param>
        /// <param name="batchSize"></param>
        void DoBatch(Action<IBatchContext> action, int batchSize = 10);
        #endregion
    }
}
