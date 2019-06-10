using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class BytesHelper
    {
        /// <summary>
        /// 将整型转成byte数组
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static int BytesToInt(params byte[] bytes)
        {
            byte[] buffer = new byte[4];
            for (var i = 0; i < bytes.Length; i++)
            {
                buffer[i] = bytes[i];
            }
            return BitConverter.ToInt32(buffer, 0);
        }
        /// <summary>
        /// 将byte数组转换成整型
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static int BytesToInt(List<byte> bytes)
        {
            byte[] buffer = new byte[4];
            for (var i = 0; i < bytes.Count; i++)
            {
                buffer[i] = bytes[i];
            }
            return BitConverter.ToInt32(buffer, 0);
        }
        /// <summary>
        /// 将byte数组转换成字符串
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static string BytesToString(List<byte> bytes)
        {
            return BytesToString(bytes.ToArray());
        }
        public static string BytesToString(byte[] bytes)
        {
            return Encoding.ASCII.GetString(bytes).Replace("\0", "");
        }
        public static string BytesToStringUtf8(List<byte> bytes)
        {
            return BytesToStringUtf8(bytes.ToArray());
        }
        public static string BytesToStringUtf8(byte[] bytes)
        {
            return Encoding.UTF8.GetString(bytes).Replace("\0", "");
        }

        /// <summary>
        /// 将整数转换成字节数组
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static byte[] IntToBytes(int value, int length)
        {
            var result = new byte[length];
            if (length > 0) result[0] = (byte)value;
            if (length > 1) result[1] = (byte)(value >> 8);
            if (length > 2) result[2] = (byte)(value >> 16);
            if (length > 3) result[3] = (byte)(value >> 24);
            return result;
        }
        /// <summary>
        /// 将整数转换成字节数组(ASCII)
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static byte[] StringToBytes(string value)
        {
            return Encoding.ASCII.GetBytes(value);
        }
        /// <summary>
        /// 将整数转换成字节数组(UTF-8)
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static byte[] StringToBytesForUtf8(string value)
        {
            return Encoding.UTF8.GetBytes(value);
        }

        /// <summary>
        /// 比较两个数组是否相同
        /// </summary>
        /// <param name="b1"></param>
        /// <param name="b2"></param>
        /// <returns></returns>
        public static bool ArrayCompare(byte[] b1, byte[] b2)
        {
            var result = true;
            if (b1.Length != b2.Length) result = false;
            else
            {
                for (var i = 0; i < b1.Length; i++)
                {
                    if (b1[i] != b2[i])
                    {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        }
    }
}
