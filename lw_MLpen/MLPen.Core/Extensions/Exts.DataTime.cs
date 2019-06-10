using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        private static readonly string[] arrCnNames = new string[7] { "天", "一", "二", "三", "四", "五", "六" };

        #region 时间戳
        /// <summary>
        /// 日期转换成unix时间戳（秒,10位数）
        /// </summary>
        /// <returns></returns>
        public static long ToUnixTimestamp(this DateTime dateTime)
        {
            return Helpers.DateTimeHelper.ToUnixTimestamp(dateTime);
        }
        #endregion

        #region 日期格式化
        /// <summary>
        /// 将日期转换为标准备类型
        /// </summary>
        /// <param name="datetime">当前时间</param>
        /// <returns></returns>
        public static string ToFormatDate(this DateTime datetime)
        {
            return datetime.ToFormat("yyyy-MM-dd");
        }

        /// <summary>
        /// 将日期转换为标准备类型
        /// </summary>
        /// <param name="datetime">当前时间</param>
        /// <returns></returns>
        public static string ToFormatTime(this DateTime datetime)
        {
            return datetime.ToFormat("HH:mm:ss");
        }

        /// <summary>
		/// 将日期转换为标准备类型
		/// </summary>
		/// <param name="datetime">当前时间</param>
		/// <returns></returns>
		public static string ToFormatLongDate(this DateTime datetime)
        {
            return datetime.ToFormat(null);
        }

        /// <summary>
        /// 将日期转换为标准备类型
        /// </summary>
        /// <param name="datetime">当前时间</param>
        /// <returns></returns>
        public static string ToFormatLongDate(this DateTime? datetime)
        {
            return datetime.HasValue ? datetime.Value.ToFormat(null) : null;
        }

        /// <summary>
		/// 将日期转换为标准备类型
		/// </summary>
		/// <param name="datetime">当前时间</param>
		/// <param name="format">格式化时间 w-原始星期几 W-中文星期几</param>
		/// <returns></returns>
		public static string ToFormat(this DateTime datetime, string format)
        {
            if (format == null)
            {
                return datetime.ToString("yyyy-MM-dd HH:mm:ss");
            }
            return datetime.ToString(format).ReplaceFor("\\sw\\s", " " + datetime.DayOfWeek.ToString() + " ", RegexOptions.None).ReplaceFor("\\sW\\s", " " + datetime.ToWeek() + " ", RegexOptions.None);
        } 
        #endregion

        #region 获取当天是星期几
        /// <summary>
        /// 获取当天是星期几
        /// </summary>
        /// <returns></returns>
        public static string ToWeek(this DateTime date)
        {
            return "星期" + arrCnNames[(int)date.DayOfWeek];
        }
        #endregion

        #region 获取好久之前
        /// <summary>
        /// 获取好久之前
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static string GetTimeBefore(this DateTime date)
        {
            var ts = DateTime.Now - date;
            if (Math.Floor(ts.TotalDays) > 365)
            {
                return Math.Floor(ts.TotalDays) / 365 + "年前";
            }
            else if (Math.Floor(ts.TotalDays) > 30)
            {
                return Math.Floor(ts.TotalDays) / 30 + "月前";
            }
            else if (Math.Floor(ts.TotalDays) > 1)
            {
                return Math.Floor(ts.TotalDays) + "天前";
            }
            else if (Math.Floor(ts.TotalHours) > 1)
            {
                return Math.Floor(ts.TotalHours) + "小时前";
            }
            else if (Math.Floor(ts.TotalMinutes) > 1)
            {
                return Math.Floor(ts.TotalMinutes) + "分钟前";
            }
            else
            {
                return Math.Floor(ts.TotalSeconds) + "秒前";
            }
        }
        #endregion

        #region 获取多长时间
        /// <summary>
        /// 获取多长时间
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static string GetTimeView(this DateTime date)
        {
            var ts = DateTime.Now - date;
            if (Math.Floor(ts.TotalDays) > 1)
            {
                return string.Format("{0}天{1}小时{2}分", ts.Days, ts.Hours, ts.Minutes);
            }
            else if (Math.Floor(ts.TotalHours) > 1)
            {
                return string.Format("{0}小时{1}分{2}秒", ts.Hours, ts.Minutes, ts.Seconds);
            }
            else if (Math.Floor(ts.TotalMinutes) > 1)
            {
                return string.Format("{0}分{1}秒", ts.Minutes, ts.Seconds);
            }
            else
            {
                return string.Format("{0}秒", ts.Seconds);
            }
        }
        #endregion
    }
}
