using Chloe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    public interface IRepositoryBase<TEntity> : IQueryContext<TEntity> where TEntity : IEntity
    {
        #region ITrans
        /// <summary>
        /// 执行事务
        /// </summary>
        /// <param name="act"></param>
        /// <returns></returns>
        MSResult DoTrans(Action<ITransContext<TEntity>> act);
        /// <summary>
        /// 执行事务
        /// </summary>
        /// <typeparam name="TResult"></typeparam>
        /// <param name="act"></param>
        /// <returns></returns>
        MSResult<TResult> DoTrans<TResult>(Func<ITransContext<TEntity>, TResult> act);
        #endregion

        #region IBatch
        /// <summary>
        /// 批量操作
        /// </summary>
        /// <param name="action"></param>
        /// <param name="batchSize"></param>
        void DoBatch(Action<IBatchContext<TEntity>> action, int batchSize = 10);
        #endregion
    }
}
