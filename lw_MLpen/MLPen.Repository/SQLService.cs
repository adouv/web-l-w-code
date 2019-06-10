using MLPen.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Repository
{
    /// <summary>
    /// SQL查询服务
    /// </summary>
    public class SQLService : SQLContext, ISQLService
    {
        public SQLService(IUnitOfWorks works) : base(works) { }
    }
}
