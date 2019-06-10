using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    internal class AppService : IAppService
    {
        /// <summary>
        /// 获取指定服务
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T GetService<T>()
        {
            return APP.GetService<T>();
        }
    }
}
