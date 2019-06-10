using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    public interface ISQLQuery
    {
        /// <summary>
        /// 返回第一条数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="selector">自定义查询器，注意大小写问题</param>
        /// <returns></returns>
        T FirstOrDefault<T>(Func<dynamic, T> selector);
        /// <summary>
        /// 返回第一条数
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        T FirstOrDefault<T>();
        /// <summary>
        /// 返回列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="selector">自定义查询器，注意大小写问题</param>
        /// <returns></returns>
        List<T> ToList<T>(Func<dynamic, T> selector);
        /// <summary>
        /// 返回列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        List<T> ToList<T>();
        /// <summary>
        /// 返回第一行第一个字段的值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        T ToScalar<T>();
        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <returns></returns>
        int ExecuteNonQuery();
    }
}
