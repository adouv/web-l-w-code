using Chloe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 执行事务接口
    /// </summary>
    public interface ITransContext<TEntity> : IQueryContext<TEntity> where TEntity : IEntity
    {
        /// <summary>
        /// 批量操作
        /// </summary>
        /// <param name="action"></param>
        void DoBatch(Action<IBatchContext<TEntity>> action, int batchSize = 10);
    }

    /// <summary>
    /// 执行事务
    /// </summary>
    public class TransContext<TEntity> : QueryContext<TEntity>, ITransContext<TEntity> where TEntity : IEntity
    {
        public TransContext(IDbContext context) : base(context) { }

        public void DoBatch(Action<IBatchContext<TEntity>> action, int batchSize = 10)
        {
            using (var ibatch = new BatchContext<TEntity>(DbContext))
            {
                action(ibatch);
            }
        }
    }
}
