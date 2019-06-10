using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 常用验证
    /// </summary>
    public class ValidateHelper
    {
        #region 字段串是否为Null或为""(空)
        /// <summary>
        /// 字段串是否为Null或为""(空)
        /// </summary>
        /// <param name="value">要判断的值</param>
        /// <returns></returns>
        public static bool IsEmpty(string value)
        {
            if (value == null) return true;
            return string.IsNullOrWhiteSpace(value.Trim());
        }
        #endregion

        #region 是否是手机号
        /// <summary>
        /// 是否是手机号
        /// </summary>
        /// <param name="phone"></param>
        /// <returns></returns>
        public static bool IsPhone(string phone)
        {
            string patternStr = "^((\\+)?86|((\\+)?86)?)0?1[3456789]\\d{9}$";
            return IsMatch(phone, patternStr);
        }
        #endregion

        #region 验证字符串是否匹配正则表达式描述的规则
        /// <summary>  
        /// 验证字符串是否匹配正则表达式描述的规则  
        /// </summary>  
        /// <param name="inputStr">待验证的字符串</param>  
        /// <param name="patternStr">正则表达式字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsMatch(string inputStr, string patternStr)
        {
            return IsMatch(inputStr, patternStr, false, false);
        }
        /// <summary>  
        /// 验证字符串是否匹配正则表达式描述的规则  
        /// </summary>  
        /// <param name="inputStr">待验证的字符串</param>  
        /// <param name="patternStr">正则表达式字符串</param>  
        /// <param name="ifIgnoreCase">匹配时是否不区分大小写</param>  
        /// <param name="ifValidateWhiteSpace">是否验证空白字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsMatch(string inputStr, string patternStr, bool ifIgnoreCase, bool ifValidateWhiteSpace)
        {
            if (!ifValidateWhiteSpace && string.IsNullOrWhiteSpace(inputStr))
            {
                return false;
            }
            Regex regex = null;
            regex = ((!ifIgnoreCase) ? new Regex(patternStr) : new Regex(patternStr, RegexOptions.IgnoreCase));
            return regex.IsMatch(inputStr);
        }
        #endregion

        #region 验证固定电话号码
        /// <summary>  
        /// 验证固定电话号码  
        /// [3位或4位区号；区号可以用小括号括起来；区号可以省略；区号与本地号间可以用减号或空格隔开；可以有3位数的分机号，分机号前要加减号]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsTelePhoneNumber(string input)
        {
            string patternStr = "^(((0\\d2|0\\d{2})[- ]?)?\\d{8}|((0\\d3|0\\d{3})[- ]?)?\\d{7})(-\\d{3})?$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证电话号码（可以是固定电话号码或手机号码）  
        /// <summary>  
        /// 验证电话号码（可以是固定电话号码或手机号码）  
        /// [固定电话：[3位或4位区号；区号可以用小括号括起来；区号可以省略；区号与本地号间可以用减号或空格隔开；可以有3位数的分机号，分机号前要加减号]]  
        /// [手机号码：[可匹配"(+86)013325656352"，括号可以省略，+号可以省略，(+86)可以省略，手机号前的0可以省略；手机号第二位数可以是3、4、5、8中的任意一个]]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsPhoneNumber(string input)
        {
            string patternStr = "^((\\+)?86|((\\+)?86)?)0?1[3456789]\\d{9}$|^(((0\\d2|0\\d{2})[- ]?)?\\d{8}|((0\\d3|0\\d{3})[- ]?)?\\d{7})(-\\d{3})?$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证电子邮箱
        /// <summary>  
        /// 验证电子邮箱  
        /// [@字符前可以包含字母、数字、下划线和点号；@字符后可以包含字母、数字、下划线和点号；@字符后至少包含一个点号且点号不能是最后一个字符；最后一个点号后只能是字母或数字]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsEmail(string input)
        {
            string patternStr = "^([\\w-\\.]+)@([\\w-\\.]+)(\\.[a-zA-Z0-9]+)$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证网址（可以匹配IPv4地址但没对IPv4地址进行格式验证；IPv6暂时没做匹配）  
        /// <summary>  
        /// 验证网址（可以匹配IPv4地址但没对IPv4地址进行格式验证；IPv6暂时没做匹配）  
        /// [允许省略"://"；可以添加端口号；允许层级；允许传参；域名中至少一个点号且此点号前要有内容]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsURL(string input)
        {
            string patternStr = "^([a-zA-Z]+://)?([\\w-\\.]+)(\\.[a-zA-Z0-9]+)(:\\d{0,5})?/?([\\w-/]*)\\.?([a-zA-Z]*)\\??(([\\w-]*=[\\w%]*&?)*)$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证IPv4地址
        /// <summary>  
        /// 验证IPv4地址  
        /// [第一位和最后一位数字不能是0或255；允许用0补位]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIPv4(string input)
        {
            string[] array = input.Split('.');
            if (array.Length != 4)
            {
                return false;
            }
            int num = -1;
            for (int i = 0; i < array.Length; i++)
            {
                if (i != 0 && i != 3)
                {
                    if (int.TryParse(array[i], out num) && num >= 0 && num <= 255)
                    {
                        continue;
                    }
                    return false;
                }
                if (!int.TryParse(array[i], out num) || num <= 0 || num >= 255)
                {
                    return false;
                }
            }
            return true;
        }
        #endregion

        #region 验证IPv6地址 
        /// <summary>  
        /// 验证IPv6地址  
        /// [可用于匹配任何一个合法的IPv6地址]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIPv6(string input)
        {
            string patternStr = "^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证一代身份证号（15位数）
        /// <summary>  
        /// 验证一代身份证号（15位数）  
        /// [长度为15位的数字；匹配对应省份地址；生日能正确匹配]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIDCard15(string input)
        {
            long num = 0L;
            if (long.TryParse(input, out num) && num.ToString().Length == 15)
            {
                if (!"11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91,".Contains(input.Remove(2) + ","))
                {
                    return false;
                }
                if (!DateTime.TryParse(input.Substring(6, 6).Insert(4, "/").Insert(2, "/"), out DateTime _))
                {
                    return false;
                }
                return true;
            }
            return false;
        }
        #endregion

        #region 验证二代身份证号（18位数，GB11643-1999标准）  
        /// <summary>  
        /// 验证二代身份证号（18位数，GB11643-1999标准）  
        /// [长度为18位；前17位为数字，最后一位(校验码)可以为大小写x；匹配对应省份地址；生日能正确匹配；校验码能正确匹配]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIDCard18(string input)
        {
            long num = 0L;
            if (long.TryParse(input.Remove(17), out num) && num.ToString().Length == 17 && long.TryParse(input.Replace('x', '0').Replace('X', '0'), out num))
            {
                if (!"11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91,".Contains(input.Remove(2) + ","))
                {
                    return false;
                }
                if (!DateTime.TryParse(input.Substring(6, 8).Insert(6, "/").Insert(4, "/"), out DateTime _))
                {
                    return false;
                }
                string[] array = "1,0,x,9,8,7,6,5,4,3,2".Split(',');
                string[] array2 = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".Split(',');
                char[] array3 = input.Remove(17).ToCharArray();
                int num2 = 0;
                for (int i = 0; i < 17; i++)
                {
                    num2 += int.Parse(array2[i]) * int.Parse(array3[i].ToString());
                }
                int num3 = -1;
                Math.DivRem(num2, 11, out num3);
                if (array[num3] != input.Substring(17, 1).ToLower())
                {
                    return false;
                }
                return true;
            }
            return false;
        }
        #endregion

        #region 验证身份证号（不区分一二代身份证号）  
        /// <summary>  
        /// 验证身份证号（不区分一二代身份证号）  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIDCard(string input)
        {
            if (input.Length == 18)
            {
                return IsIDCard18(input);
            }
            if (input.Length == 15)
            {
                return IsIDCard15(input);
            }
            return false;
        }
        #endregion

        #region 验证经度
        /// <summary>  
        /// 验证经度  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsLongitude(string input)
        {
            float num;
            if (float.TryParse(input, out num) && num >= -180f && num <= 180f)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证纬度
        /// <summary>  
        /// 验证纬度  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsLatitude(string input)
        {
            float num;
            if (float.TryParse(input, out num) && num >= -90f && num <= 90f)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证邮政编码
        /// <summary>  
        /// 验证邮政编码  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsZipCode(string input)
        {
            if (input.Length != 6)
            {
                return false;
            }
            if (int.TryParse(input, out int _))
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证日期
        /// <summary>  
        /// 验证日期  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsDateTime(string input)
        {
            if (DateTime.TryParse(input, out DateTime _))
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证字符串字节数长度范围  
        /// <summary>  
        /// 验证字符串字节数长度范围  
        /// [若要验证固定长度，可传入相同的两个长度数值；每个汉字为两个字节长度]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="lengthBegin">长度范围起始值（含）</param>  
        /// <param name="lengthEnd">长度范围结束值（含）</param>  
        /// <returns></returns>  
        public static bool IsStringByteLength(string input, int lengthBegin, int lengthEnd)
        {
            int byteCount = Encoding.Default.GetByteCount(input);
            if (byteCount >= lengthBegin && byteCount <= lengthEnd)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证字符串长度范围
        /// <summary>  
        /// 验证字符串长度范围  
        /// [若要验证固定长度，可传入相同的两个长度数值]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="withEnglishCharacter">是否包含英文字母</param>  
        /// <param name="withNumber">是否包含数字</param>  
        /// <param name="withChineseCharacter">是否包含汉字</param>  
        /// <param name="lengthBegin">长度范围起始值（含）</param>  
        /// <param name="lengthEnd">长度范围结束值（含）</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsStringLengthByInclude(string input, bool withEnglishCharacter, bool withNumber, bool withChineseCharacter, int lengthBegin, int lengthEnd)
        {
            if (!withEnglishCharacter && !withNumber && !withChineseCharacter)
            {
                return false;
            }
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("^[");
            if (withEnglishCharacter)
            {
                stringBuilder.Append("a-zA-Z");
            }
            if (withNumber)
            {
                stringBuilder.Append("0-9");
            }
            if (withChineseCharacter)
            {
                stringBuilder.Append("\\u4E00-\\u9FA5");
            }
            stringBuilder.Append("]{" + lengthBegin + "," + lengthEnd + "}$");
            return IsMatch(input, stringBuilder.ToString());
        }
        #endregion

        #region 验证只包含数字和英文字母
        /// <summary>  
        /// 验证只包含数字和英文字母  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIntegerAndEnglishCharacter(string input)
        {
            string patternStr = "^[0-9A-Za-z]+$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证只下划线、含数字和英文字母
        /// <summary>  
        /// 验证只下划线、含数字和英文字母  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsUnderlineIntegerAndEnglishCharacter(string input)
        {
            string patternStr = "^[0-9A-Za-z_]+$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证只包含汉字
        /// <summary>  
        /// 验证只包含汉字  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsChineseCharacter(string input)
        {
            string patternStr = "^[\\u4e00-\\u9fa5]+$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证数字长度范围（数字前端的0计长度） 
        /// <summary>  
        /// 验证数字长度范围（数字前端的0计长度）  
        /// [若要验证固定长度，可传入相同的两个长度数值]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="lengthBegin">长度范围起始值（含）</param>  
        /// <param name="lengthEnd">长度范围结束值（含）</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIntegerLength(string input, int lengthBegin, int lengthEnd)
        {
            if (input.Length >= lengthBegin && input.Length <= lengthEnd)
            {
                if (int.TryParse(input, out int _))
                {
                    return true;
                }
                return false;
            }
            return false;
        }
        #endregion

        #region 验证字符串包含内容
        /// <summary>  
        /// 验证字符串包含内容  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="withEnglishCharacter">是否包含英文字母</param>  
        /// <param name="withNumber">是否包含数字</param>  
        /// <param name="withChineseCharacter">是否包含汉字</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsStringInclude(string input, bool withEnglishCharacter, bool withNumber, bool withChineseCharacter)
        {
            if (!withEnglishCharacter && !withNumber && !withChineseCharacter)
            {
                return false;
            }
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("^[");
            if (withEnglishCharacter)
            {
                stringBuilder.Append("a-zA-Z");
            }
            if (withNumber)
            {
                stringBuilder.Append("0-9");
            }
            if (withChineseCharacter)
            {
                stringBuilder.Append("\\u4E00-\\u9FA5");
            }
            stringBuilder.Append("]+$");
            return IsMatch(input, stringBuilder.ToString());
        }
        #endregion

        #region 验证字符串长度范围 
        /// <summary>  
        /// 验证字符串长度范围  
        /// [若要验证固定长度，可传入相同的两个长度数值]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="lengthBegin">长度范围起始值（含）</param>  
        /// <param name="lengthEnd">长度范围结束值（含）</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsStringLength(string input, int lengthBegin, int lengthEnd)
        {
            if (input.Length >= lengthBegin && input.Length <= lengthEnd)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证字符串长度范围（字符串内只包含数字和/或英文字母）
        /// <summary>  
        /// 验证字符串长度范围（字符串内只包含数字和/或英文字母）  
        /// [若要验证固定长度，可传入相同的两个长度数值]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <param name="lengthBegin">长度范围起始值（含）</param>  
        /// <param name="lengthEnd">长度范围结束值（含）</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsStringLengthOnlyNumberAndEnglishCharacter(string input, int lengthBegin, int lengthEnd)
        {
            string patternStr = "^[0-9a-zA-z]{" + lengthBegin + "," + lengthEnd + "}$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证数字(double类型)
        /// <summary>  
        /// 验证数字(double类型)  
        /// [可以包含负号和小数点]  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsNumber(string input)
        {
            double num = 0.0;
            if (double.TryParse(input, out num))
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证整数
        /// <summary>  
        /// 验证整数  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsInteger(string input)
        {
            int num = 0;
            if (int.TryParse(input, out num))
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证非负整数
        /// <summary>  
        /// 验证非负整数  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIntegerNotNagtive(string input)
        {
            int num = -1;
            if (int.TryParse(input, out num) && num >= 0)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证正整数
        /// <summary>  
        /// 验证正整数  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsIntegerPositive(string input)
        {
            int num = 0;
            if (int.TryParse(input, out num) && num >= 1)
            {
                return true;
            }
            return false;
        }
        #endregion

        #region 验证小数
        /// <summary>  
        /// 验证小数  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsDecimal(string input)
        {
            string patternStr = "^([-+]?[1-9]\\d*\\.\\d+|-?0\\.\\d*[1-9]\\d*)$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证只包含英文字母
        /// <summary>  
        /// 验证只包含英文字母  
        /// </summary>  
        /// <param name="input">待验证的字符串</param>  
        /// <returns>是否匹配</returns>  
        public static bool IsEnglishCharacter(string input)
        {
            string patternStr = "^[A-Za-z]+$";
            return IsMatch(input, patternStr);
        }
        #endregion

        #region 验证只包下划线和英文字母
        /// <summary>
        /// 验证只包下划线和英文字母  
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static bool IsUnderlineAndEnglishCharacter(string input)
        {
            string patternStr = "^[A-Za-z_]+$";
            return IsMatch(input, patternStr);
        }
        #endregion
        /// <summary>
        /// 判断整数为null时给默认值0
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static int convertToNotNull(int? source) {
            if (source == null) {
                return 0;
            }
            return (int)source;
        }
        /// <summary>
        /// 判断long为null时给默认值0
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static long convertToNotNull(long? source)
        {
            if (source == null)
            {
                return 0;
            }
            return (long)source;
        }
        /// <summary>
        /// 判断double为null时给默认值0
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static double convertToNotNull(double? source)
        {
            if (source == null)
            {
                return 0;
            }
            return (double)source;
        }
    }
}
