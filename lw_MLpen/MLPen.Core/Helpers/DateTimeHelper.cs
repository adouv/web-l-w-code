using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 日期帮助类
    /// </summary>
    public class DateTimeHelper
    {
        private static DateTime UnixBaseTime = new DateTime(1970, 1, 1);

        #region 区间日期参数
        /// <summary>
        /// 区间日期
        /// </summary>
        public class RegionDate
        {
            /// <summary>
            /// 开始
            /// </summary>
            public DateTime First { get; set; }
            /// <summary>
            /// 结束
            /// </summary>
            public DateTime Last { get; set; }
        }
        /// <summary>
        /// 区间类型
        /// </summary>
        public enum RegionType
        {
            /// <summary>
            /// 周
            /// </summary>
            week,
            /// <summary>
            /// 月
            /// </summary>
            month,
            /// <summary>
            /// 季度
            /// </summary>
            season,
            /// <summary>
            /// 年
            /// </summary>
            year
        } 
        #endregion

        #region 获取周、月、季度、年的开始时间与结束时间
        /// <summary>
        /// 获取结束时间
        /// </summary>
        /// <param name="TimeType">Week、Month、Season、Year</param>
        /// <param name="now"></param>
        /// <returns></returns>
        public static RegionDate GetRegionDate(RegionType type, DateTime now)
        {
            var regionDate = new RegionDate();
            switch (type)
            {
                case RegionType.week:
                    {
                        int weeknow = Convert.ToInt32(now.DayOfWeek);
                        //因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。
                        weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
                        int daydiff = (-1) * weeknow;
                        regionDate.First = now.AddDays(daydiff);
                        regionDate.Last = regionDate.First.AddDays(6);
                    }
                    break;
                case RegionType.month:
                    regionDate.First = now.AddDays(-now.Day + 1);
                    regionDate.Last = now.AddMonths(1).AddDays(-now.AddMonths(1).Day + 1).AddDays(-1);
                    break;
                case RegionType.season:
                    var time1 = now.AddMonths(0 - ((now.Month - 1) % 3));
                    regionDate.First = time1.AddDays(-time1.Day + 1);
                    var time2 = now.AddMonths((3 - ((now.Month - 1) % 3) - 1));
                    regionDate.Last = time2.AddMonths(1).AddDays(-time2.AddMonths(1).Day + 1).AddDays(-1);
                    break;
                case RegionType.year:
                    regionDate.First = now.AddDays(-now.DayOfYear + 1);
                    var time3 = now.AddYears(1);
                    regionDate.Last = time3.AddDays(-time3.DayOfYear);
                    break;
            }
            return regionDate;
        }
        #endregion

        #region 转换Unix时间戳到C#时间
        /// <summary>
        /// 转换Unix时间戳到C#时间
        /// </summary>
        /// <param name="unixtimestamp">Unix时间戳</param>
        /// <returns></returns>
        public static DateTime FromUnixTimeStamp(long unixtimestamp)
        {
            return UnixBaseTime.AddTicks((unixtimestamp + 28800) * 10000000);
        }
        #endregion

        #region Unix时间戳
        /// <summary>
        /// Unix时间戳
        /// </summary>
        /// <param name="dateTime">时间</param>
        /// <returns></returns>
        public static long ToUnixTimestamp(DateTime dateTime)
        {
            return (dateTime.Ticks - UnixBaseTime.Ticks) / 10000000 - 28800;
        }
        #endregion

        /// <summary>
        /// 生成时间戳
        /// </summary>
        public static string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }
    }
}
