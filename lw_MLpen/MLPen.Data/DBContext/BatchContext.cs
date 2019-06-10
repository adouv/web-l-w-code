using Chloe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 批量处理接口
    /// </summary>
    public interface IBatchContext : IQueryContext
    {
    }

    /// <summary>
    /// 批量处理
    /// </summary>
    public class BatchContext : QueryContext, IBatchContext
    {
        #region BatchContext
        public BatchContext(IDbContext dbContext) : this(dbContext, 10)
        {
        }
        public BatchContext(IDbContext dbContext, int batchSize) : base(dbContext)
        {
            this.DbContext = dbContext;
        }
        #endregion
    }
}
