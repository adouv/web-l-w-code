using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 枚举帮助类
    /// </summary>
    public class EnumHelper
    {
        /// <summary>
        /// 将整型转换成指定枚举
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T IntToEnum<T>(int value)
        {
            return (T)Enum.ToObject(typeof(T), value);
        }
    }
}
