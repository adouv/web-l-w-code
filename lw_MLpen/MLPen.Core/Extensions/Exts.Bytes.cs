using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    // <summary>
    /// 扩展
    /// </summary>
    public static partial class Exts
    {
        #region 将Ascii码转换成字母
        /// <summary>
        /// 将Ascii码转换成字母
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToPenAscii(this byte value)
        {
            switch (value)
            {
                case 0x0D: return "OK";
                case 0x7F: return "DEL";
                default:
                    var bytes = new byte[] { value };
                    return Encoding.ASCII.GetString(bytes);
            }
        }
        #endregion

        #region 从开始位置合并数组
        /// <summary>
        /// 从开始位置合并数组
        /// </summary>
        /// <param name="source">源</param>
        /// <param name="buffer">要被合并的</param>
        /// <returns></returns>
        public static byte[] MergeStart(this byte[] source, byte[] buffer)
        {
            var temp = new byte[source.Length + buffer.Length];
            buffer.CopyTo(temp, 0);
            source.CopyTo(temp, buffer.Length);
            return temp;
        }
        #endregion

        #region byte[]转换为struct
        /// <summary>
        /// byte[]转换为struct
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="strcutType"></param>
        /// <returns></returns>
        public static T ToStruct<T>(this byte[] bytes) where T : struct
        {
            return Helpers.StructHelper.BytesToStruct<T>(bytes);
        }
        #endregion

        #region 获取指定数组位置和长度的新数组
        /// <summary>
        /// 获取指定数组位置和长度的新数组
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="index"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static byte[] GetRange(this byte[] bytes, int index, int length)
        {
            return bytes.ToList().GetRange(index, length).ToArray();
        }
        #endregion

        #region 将数组转换成16位无符号整数
        /// <summary>
        /// 将数组转换成16位无符号整数
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        public static ushort ToUInt16(this byte[] bytes)
        {
            return BitConverter.ToUInt16(bytes, 0);
        }
        #endregion
    }
}
