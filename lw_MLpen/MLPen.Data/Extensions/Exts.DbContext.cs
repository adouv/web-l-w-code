using Chloe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        public static DbParam[] BuildParams(this IDbContext dbContext, object parameter)
        {
            return DBUtils.BuildParams(dbContext, parameter);
        }
    }
}
