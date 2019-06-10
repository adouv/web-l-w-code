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
    public abstract class RepositoryBase<TEntity> : QueryContext<TEntity>, IRepositoryBase<TEntity> where TEntity : IEntity
    {
        public RepositoryBase(IDbContext dbContext) : base(dbContext)
        {
        }

        #region DoTrans
        public MSResult DoTrans(Action<ITransContext<TEntity>> act)
        {
            try
            {
                DbContext.DoWithTransaction(() =>
                {
                    act(new TransContext<TEntity>(DbContext));
                });
                return MSResult.Init();
            }
            catch (Exception ex)
            {
                return MSResult.Init(ex);
            }
        }
        public MSResult<TResult> DoTrans<TResult>(Func<ITransContext<TEntity>, TResult> act)
        {
            try
            {
                TResult result = default(TResult);
                result = DbContext.Session.DbContext.DoWithTransaction(() =>
                {
                    return act(new TransContext<TEntity>(DbContext));
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
        public void DoBatch(Action<IBatchContext<TEntity>> action, int batchSize = 10)
        {
            DoTrans(trans => trans.DoBatch(action));
        }
        #endregion
    }
}
