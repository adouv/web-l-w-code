using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class StructHelper
    {
        #region struct转换为byte[]
        /// <summary>
        /// struct转换为byte[]
        /// </summary>
        /// <param name="structObj"></param>
        /// <returns></returns>
        public static byte[] StructToBytes<T>(T structObj) where T : struct
        {
            int size = Marshal.SizeOf(structObj);
            IntPtr buffer = Marshal.AllocHGlobal(size);
            try
            {
                Marshal.StructureToPtr(structObj, buffer, false);
                byte[] bytes = new byte[size];
                Marshal.Copy(buffer, bytes, 0, size);
                return bytes;
            }
            finally
            {
                Marshal.FreeHGlobal(buffer);
            }
        }
        #endregion

        #region byte[]转换为struct
        /// <summary>
        /// byte[]转换为struct
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="strcutType"></param>
        /// <returns></returns>
        public static T BytesToStruct<T>(byte[] bytes) where T : struct
        {
            Type strcutType = typeof(T);
            int size = Marshal.SizeOf(strcutType);
            IntPtr buffer = Marshal.AllocHGlobal(size);
            try
            {
                Marshal.Copy(bytes, 0, buffer, size);
                return (T)Marshal.PtrToStructure(buffer, strcutType);
            }
            finally
            {
                Marshal.FreeHGlobal(buffer);
            }
        }
        #endregion
    }
}
