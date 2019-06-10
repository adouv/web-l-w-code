using Chloe;
using Chloe.Infrastructure;
using Chloe.InternalExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 数据库工具类
    /// </summary>
    internal class DBUtils
    {
        /// <summary>
        /// 生成数据库查询参数
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="parameter"></param>
        /// <returns></returns>
        public static DbParam[] BuildParams(IDbContext dbContext, object parameter)
        {
            if (parameter == null) return new DbParam[0];

            if (parameter is IEnumerable<DbParam>)
            {
                return ((IEnumerable<DbParam>)parameter).ToArray();
            }

            IDatabaseProvider databaseProvider = ((DbContext)dbContext).DatabaseProvider;

            List<DbParam> parameters = new List<DbParam>();
            Type parameterType = parameter.GetType();
            var props = parameterType.GetProperties();
            foreach (var prop in props)
            {
                if (prop.GetGetMethod() == null)
                {
                    continue;
                }

                object value = ReflectionExtension.GetMemberValue(prop, parameter);

                string paramName = databaseProvider.CreateParameterName(prop.Name);

                DbParam p = new DbParam(paramName, value, prop.PropertyType);
                parameters.Add(p);
            }

            return parameters.ToArray();
        }
    }
}
