using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// Json转换
    /// </summary>
    public class JsonHelper
    {
        /// <summary>
        /// 转换成JSON字符串（默认忽略）
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string ToJSON(object data)
        {
            return ToJSON(data, true, "yyyy-MM-dd HH:mm:ss");
        }
        public static string ToJSON(object data, bool ignore)
        {
            return ToJSON(data, ignore, "yyyy-MM-dd HH:mm:ss");
        }
        /// <summary>
        /// 转换成JSON字符串（默认忽略）
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string ToJSON(object data, string DateTimeFormat)
        {
            return ToJSON(data, true, DateTimeFormat);
        }
        /// <summary>
        /// 转换成JSON字符串
        /// </summary>
        /// <param name="data">对象</param>
        /// <param name="ignore">是否忽略默认值</param>
        /// <returns></returns>
        public static string ToJSON(object data, bool ignore, string DateTimeFormat)
        {
            var setting = new JsonSerializerSettings();
            //日期类型默认格式化处理
            setting.DateFormatHandling = DateFormatHandling.MicrosoftDateFormat;
            setting.DateFormatString = DateTimeFormat;
            setting.ContractResolver = new CamelCasePropertyNamesContractResolver();
            if (ignore)
            {
                //空值处理
                setting.NullValueHandling = NullValueHandling.Ignore;
                setting.DefaultValueHandling = DefaultValueHandling.Ignore;

                return JsonConvert.SerializeObject(data, setting);
            }
            else
            {

                return JsonConvert.SerializeObject(data, setting);
            }
        }

        /// <summary>
        /// 转换成象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json">JSON字符串</param>
        /// <returns></returns>
        public static T ToObject<T>(string json)
        {
            try
            {
                return JsonConvert.DeserializeObject<T>(json);
            }
            catch
            {
                return default(T);
            }
        }
        /// <summary>
        /// 转换成象
        /// </summary>
        /// <param name="json">JSON字符串</param>
        /// <returns></returns>
        public static object ToObject(string json)
        {
            if (json.IsEmpty()) return null;
            return JsonConvert.DeserializeObject(json);
        }
    }
}
