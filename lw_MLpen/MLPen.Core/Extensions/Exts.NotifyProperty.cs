using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        /// <summary>
        /// 返回属性名
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="P"></typeparam>
        /// <param name="expr"></param>
        /// <returns></returns>
        static string GetPropertyName<T, P>(Expression<Func<T, P>> expr)
        {
            string _propertyName = string.Empty;
            if (expr.Body is MemberExpression)
            {
                _propertyName = (expr.Body as MemberExpression).Member.Name;
            }
            else if (expr.Body is UnaryExpression)
            {
                _propertyName = ((expr.Body as UnaryExpression).Operand as MemberExpression).Member.Name;
            }
            return _propertyName;
        }

        /// <summary>
        /// 设置属性值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="P"></typeparam>
        /// <param name="tvm"></param>
        /// <param name="expre"></param>
        public static void Notify<T, P>(this T tvm, Expression<Func<T, P>> expre) where T : NotifyProperty, new()
        {
            tvm.NotifyPropertyChange(GetPropertyName(expre));
        }
    }
}
