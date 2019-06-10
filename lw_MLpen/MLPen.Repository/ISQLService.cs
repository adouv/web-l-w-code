using MLPen.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Repository
{
    /// <summary>
    /// SQL查询服务接口
    /// </summary>
    public interface ISQLService : ISQLContext, IAutofac
    {
    }
}
