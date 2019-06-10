using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MLPen
{
    // <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        #region 格式化字符串
        /// <summary>
        /// 将指字符串的格式项替换为指定数组中相对应对象的字符串表示形式
        /// </summary>
        /// <param name="format">复合格式字符串</param>
        /// <param name="args">一个对象数组，其中包含零个或多个要设置格式的对象</param>
        /// <returns></returns>
        public static string Formats(this string format, params object[] args)
        {
            return string.Format(format, args);
        }
        #endregion

        #region 为空判断
        /// <summary>
        /// 字符串是否为空
        /// </summary>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static bool IsEmpty(this string value)
        {
            return Helpers.ValidateHelper.IsEmpty(value);
        }
        /// <summary>
		/// 是否不为空
		/// </summary>
		/// <param name="value"></param>
		/// <returns></returns>
		public static bool IsNotEmtpy(this string value)
        {
            return !value.IsEmpty();
        }
        #endregion

        #region 尝试解析字符串
        /// <summary>
        /// 尝试解析字符串
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T TryParse<T>(this string value)
        {
            return value.TryParse(default(T));
        }

        /// <summary>
        /// 尝试解析字符串
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static T TryParse<T>(this string value, T defaultValue)
        {
            object obj = null;
            if (value.TryParse(typeof(T), out obj))
            {
                return (T)obj;
            }
            return defaultValue;
        }

        /// <summary>
        /// 尝试解析字符串
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static bool TryParse<T>(this string value, out T result)
        {
            object obj = null;
            if (value.TryParse(typeof(T), out obj))
            {
                result = (T)obj;
                return true;
            }
            result = default(T);
            return false;
        }

        /// <summary>
        /// 尝试解析字符串
        /// </summary>
        /// <param name="type">所要解析成的类型</param>
        /// <param name="value">字符串</param>
        /// <param name="result">解析结果，解析失败将返回null</param>
        /// <returns>解析失败将返回具体错误消息，否则将返回null，解析结果通过result获得</returns>
        public static bool TryParse(this string value, Type type, out object result)
        {
            if (value == null)
            {
                result = null;
                return false;
            }
            bool flag = false;
            object obj = null;
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                type = type.GetGenericArguments()[0];
            }
            if (type.IsEnum)
            {
                try
                {
                    obj = Enum.Parse(type, value, true);
                    flag = true;
                }
                catch
                {
                    flag = false;
                }
            }
            else if (type == typeof(Guid))
            {
                try
                {
                    obj = new Guid(value);
                    flag = true;
                }
                catch
                {
                    flag = false;
                }
            }
            else
            {
                switch (Type.GetTypeCode(type))
                {
                    case TypeCode.String:
                        obj = value;
                        flag = true;
                        break;
                    case TypeCode.Boolean:
                        if (value == "1")
                        {
                            obj = true;
                            flag = true;
                        }
                        else if (value == "0")
                        {
                            obj = false;
                            flag = true;
                        }
                        else
                        {
                            flag = bool.TryParse(value, out bool flag2);
                            if (flag)
                            {
                                obj = flag2;
                            }
                            else
                            {
                                flag = false;
                            }
                        }
                        break;
                    case TypeCode.Byte:
                        flag = byte.TryParse(value, out byte b2);
                        if (flag)
                        {
                            obj = b2;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Decimal:
                        flag = decimal.TryParse(value, out decimal num8);
                        if (flag)
                        {
                            obj = num8;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Double:
                        flag = double.TryParse(value, out double num4);
                        if (flag)
                        {
                            obj = num4;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Int16:
                        flag = short.TryParse(value, out short num2);
                        if (flag)
                        {
                            obj = num2;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Int32:
                        flag = int.TryParse(value, out int num7);
                        if (flag)
                        {
                            obj = num7;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Int64:
                        flag = long.TryParse(value, out long num5);
                        if (flag)
                        {
                            obj = num5;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.SByte:
                        flag = sbyte.TryParse(value, out sbyte b);
                        if (flag)
                        {
                            obj = b;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.Single:
                        flag = float.TryParse(value, out float num9);
                        if (flag)
                        {
                            obj = num9;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.UInt16:
                        flag = ushort.TryParse(value, out ushort num6);
                        if (flag)
                        {
                            obj = num6;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.UInt32:
                        flag = uint.TryParse(value, out uint num3);
                        if (flag)
                        {
                            obj = num3;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.UInt64:
                        flag = ulong.TryParse(value, out ulong num);
                        if (flag)
                        {
                            obj = num;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    case TypeCode.DateTime:
                        flag = DateTime.TryParse(value, out DateTime dateTime);
                        if (flag)
                        {
                            obj = dateTime;
                        }
                        else
                        {
                            flag = false;
                        }
                        break;
                    default:
                        flag = false;
                        break;
                }
            }
            result = obj;
            return flag;
        }
        #endregion

        #region 快速判断字符串起始部分
        /// <summary>
        /// 快速判断字符串起始部分
        /// </summary>
        /// <param name="target">值</param>
        /// <param name="lookfor">要判断的字符串</param>
        /// <param name="IsIgnoreCase">是否区分大小写 true-要 false-不</param>
        /// <returns></returns>
        public static bool StartsWith(this string target, string lookfor, bool IsIgnoreCase)
        {
            if (!target.IsEmpty() && !lookfor.IsEmpty())
            {
                if (lookfor.Length > target.Length)
                {
                    return false;
                }
                return string.Compare(target, 0, lookfor, 0, lookfor.Length, IsIgnoreCase ? StringComparison.Ordinal : StringComparison.OrdinalIgnoreCase) == 0;
            }
            return false;
        }
        #endregion

        #region 使用正则替换字符串
        /// <summary>
        /// 使用正则替换字符串
        /// </summary>
        /// <param name="value"></param>
        /// <param name="pattern"></param>
        /// <param name="replacement"></param>
        /// <returns></returns>
        public static string ReplaceFor(this string value, string pattern, object replacement)
        {
            return value.ReplaceFor(pattern, replacement, RegexOptions.IgnoreCase);
        }
        /// <summary>
        /// 使用正则替换字符串
        /// </summary>
        /// <param name="value"></param>
        /// <param name="pattern"></param>
        /// <param name="replacement"></param>
        /// <param name="regexoptions"></param>
        /// <returns></returns>
        public static string ReplaceFor(this string value, string pattern, object replacement, RegexOptions regexoptions)
        {
            return Regex.Replace(value, pattern, Convert.ToString(replacement), regexoptions);
        }
        /// <summary>
        /// 使用正则替换字符串
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <param name="pattern"></param>
        /// <param name="replacement"></param>
        /// <param name="separator"></param>
        /// <returns></returns>
        public static T[] ReplaceFor<T>(this string value, string pattern, string replacement, char separator)
        {
            return Regex.Replace(value, pattern, replacement, RegexOptions.IgnoreCase).Split<T>(separator);
        }
        #endregion

        #region 拆分字符串为指定集合
        /// <summary>
        /// 拆分字符串为指定集合（以逗号分隔的字符串）
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <returns></returns>
        public static T[] Split<T>(this string value)
        {
            return value.Split<T>(',');
        }
        /// <summary>
        /// 拆分字符串为指定集合
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value"></param>
        /// <param name="separator"></param>
        /// <returns></returns>
        public static T[] Split<T>(this string value, char separator)
        {
            var inputs = value.Split(separator);
            var results = new T[inputs.Length];
            for (int i = 0; i < inputs.Length; i++)
            {
                results[i] = inputs[i].TryParse<T>();
            }
            return results;
        }
        #endregion

        #region 转半角的函数(DBC case) 
        /// <summary> 
        /// 转半角的函数(DBC case) 
        /// </summary> 
        /// <param name="input">任意字符串</param> 
        /// <returns>半角字符串</returns> 
        /// <remarks> 
        /// 全角空格为12288，半角空格为32 
        /// 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248 
        /// </remarks> 
        public static string ToDBC(this string input)
        {
            char[] array = input.ToCharArray();
            for (int i = 0; i < array.Length; i++)
            {
                if (array[i] == '\u3000')
                {
                    array[i] = ' ';
                }
                else if (array[i] > '\uff00' && array[i] < '｟')
                {
                    array[i] = (char)(array[i] - 65248);
                }
            }
            return new string(array);
        }
        #endregion

        #region 将路径结构转换成数组
        /// <summary>
        /// 将路径结构转换成Int数组
        /// </summary>
        /// <param name="path">路径,格式：/?/?/?/</param>
        /// <returns></returns>
        public static List<int> SplitPath(this string path)
        {
            return path.SplitPath<int>();
        }
        /// <summary>
        /// 将路径结构转换成数组
        /// </summary>
        /// <param name="path">路径,格式：/?/?/?/</param>
        /// <returns></returns>
        public static List<T> SplitPath<T>(this string path)
        {
            path = path.Replace("//", "/");
            return path.ReplaceFor<T>("~/|/$", "", '/').Distinct().ToList();
        }
        #endregion

        #region 手机掩码
        /// <summary>
        /// 手机掩码
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>
        public static string ToPhoneMask(this string phone)
        {
            if (!phone.IsEmpty() && phone.Length == 11)
            {
                return phone.ReplaceFor("(\\d{3})\\d{4}(\\d{4}$)", "$1****$2");
            }
            return null;
        }
        #endregion

        #region 移除Html标记
        /// <summary>
        /// 移除Html标记
        /// </summary>
        /// <param name="value">要移出的内容</param>
        /// <returns></returns>
        public static string RemoveHtml(this string value)
        {
            return Regex.Replace(value, "<[^>]*>", string.Empty, RegexOptions.IgnoreCase);
        }
        #endregion

        #region 将GB2312编码转成UTF8
        /// <summary>
        /// 将GB2312编码转成UTF8
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string GB2312ToUTF8(this string str)
        {
            try
            {
                Encoding uft8 = Encoding.GetEncoding(65001);
                Encoding gb2312 = Encoding.GetEncoding("gb2312");
                byte[] temp = gb2312.GetBytes(str);
                byte[] temp1 = Encoding.Convert(gb2312, uft8, temp);
                string result = uft8.GetString(temp1);
                return result;
            }
            catch
            {
                return str;
            }
        }
        #endregion

        #region 将UTF8编码转成GB2312
        /// <summary>
        /// 将UTF8编码转成GB2312
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string UTF8ToGB2312(this string str)
        {
            try
            {
                Encoding utf8 = Encoding.GetEncoding(65001);
                Encoding gb2312 = Encoding.GetEncoding("gb2312");
                byte[] temp = utf8.GetBytes(str);
                byte[] temp1 = Encoding.Convert(utf8, gb2312, temp);
                string result = gb2312.GetString(temp1);
                return result;
            }
            catch
            {
                return str;
            }
        }
        #endregion

        #region 获取字符串的真实长度
        /// <summary>
        /// 获取字符串的真实长度
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static int ToLength(this string str)
        {
            return Encoding.UTF8.GetBytes(str.ToCharArray()).Length;
        }
        #endregion
    }
}
