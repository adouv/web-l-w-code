using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    // <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        /// <summary>
        /// 字节数组转16进制字符串
        /// </summary>
        /// <param name="convert"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public static string ToHexString(this byte[] bytes)
        {
            string returnStr = "";
            if (bytes != null)
            {
                for (int i = 0; i < bytes.Length; i++)
                {
                    returnStr += bytes[i].ToString("X2");
                }
            }
            return returnStr;
        }
        /// <summary>
        /// 字符串转16进制字节数组
        /// </summary>
        /// <param name="convert"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public static byte[] ToHexBytes(this string hexString)
        {
            hexString = hexString.Replace(" ", "");
            if ((hexString.Length % 2) != 0)
                hexString += " ";
            byte[] returnBytes = new byte[hexString.Length / 2];
            for (int i = 0; i < returnBytes.Length; i++)
                returnBytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
            return returnBytes;
        }
    }
}
