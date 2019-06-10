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
    public interface ITransContext : IQueryContext
    {
        /// <summary>
        /// 批量操作
        /// </summary>
        /// <param name="action"></param>
        void DoBatch(Action<IBatchContext> action, int batchSize = 10);
    }

    /// <summary>
    /// 执行事务
    /// </summary>
    public class TransContext : QueryContext, ITransContext
    {
        public TransContext(IDbContext context) : base(context) { }

        public void DoBatch(Action<IBatchContext> action, int batchSize = 10)
        {
            using (var ibatch = new BatchContext(DbContext))
            {
                action(ibatch);
            }
        }
    }
}
