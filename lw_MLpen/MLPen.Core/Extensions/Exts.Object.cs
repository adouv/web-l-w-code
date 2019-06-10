using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
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
		/// 将Object转换成字符串
		/// </summary>
		/// <param name="obj">Object对象</param>
		/// <param name="nullValue">如果为空时，使用默认值</param>
		/// <returns></returns>
		public static string ToString(this object obj, string nullValue)
        {
            if (obj == null) return nullValue;
            return Convert.ToString(obj);
        }

        /// <summary>
        /// 将实体转换成键/值对的集体
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static IDictionary<string, object> ToDictionary(this object source)
        {
            return TypeHelper.ObjectToDictionary(source);
        }

        #region 根据属性名称设置属性的值
        /// <summary>
        /// 根据属性名称设置属性的值
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="t">对象</param>
        /// <param name="name">属性名</param>
        /// <param name="value">属性的值</param>
        public static void SetPropertyValue<T>(this T t, string name, object value)
        {
            Type type = t.GetType();
            PropertyInfo p = type.GetProperty(name);
            if (p == null) throw new Exception(String.Format("该类型没有名为{0}的属性", name));

            var param_obj = Expression.Parameter(type);
            var param_val = Expression.Parameter(typeof(object));
            var body_obj = Expression.Convert(param_obj, type);
            var body_val = Expression.Convert(param_val, p.PropertyType);

            //获取设置属性的值的方法
            var setMethod = p.GetSetMethod(true);

            //如果只是只读,则setMethod==null
            if (setMethod != null)
            {
                var body = Expression.Call(param_obj, p.GetSetMethod(), body_val);
                var setValue = Expression.Lambda<Action<T, object>>(body, param_obj, param_val).Compile();
                setValue(t, value);
            }
        }
        #endregion

        #region 根据属性名获取属性值
        public static object GetPropertyValue(this object t, string name)
        {
            Type type = t.GetType();
            PropertyInfo p = type.GetProperty(name);
            if (p == null) return null;
            else return p.GetValue(t, null);
        }
        /// <summary>
        /// 根据属性名获取属性值
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="t">对象</param>
        /// <param name="name">属性名</param>
        /// <returns>属性的值</returns>
        public static T GetPropertyValue<T>(this object t, string name)
        {
            var value = GetPropertyValue(t, name);
            return value == null ? default(T) : (T)value;
        }
        #endregion

        #region 根据属性名获取属性类型
        /// <summary>
        /// 根据属性名获取属性类型
        /// </summary>
        /// <typeparam name="T">对象类型</typeparam>
        /// <param name="t">对象</param>
        /// <param name="name">属性名</param>
        /// <returns>属性的值</returns>
        public static Type GetPropertyType<T>(this T t, string name)
        {
            Type type = t.GetType();
            PropertyInfo p = type.GetProperty(name);
            if (p == null) return null;
            var param_obj = Expression.Parameter(typeof(T));
            var body_obj = Expression.Convert(param_obj, type);
            var body = Expression.Property(body_obj, p);
            return body.Type;
        }
        #endregion


    }
}
