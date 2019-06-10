using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 注入接口标识
    /// </summary>
    public interface IAutofac
    {
    }

    /// <summary>
    /// 注入服务
    /// </summary>
    public interface IAppService : IAutofac
    {
        T GetService<T>();
    }
}
