using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 加密类
    /// </summary>
    public class EncryptHelper
    {
        /// <summary>
        /// 24位密钥
        /// </summary>
        private const string key = "1368795654521356";

        #region 加密
        /// <summary>
        /// 3DES加密
        /// </summary>
        /// <param name="originalValue"></param>
        /// <returns></returns>
        public static string DESEncrypt(string originalValue)
        {
            return DESEncrypt(originalValue, key);
        }
        /// <summary>
        /// 3DES加密
        /// </summary>
        /// <param name="originalValue">加密数据</param>
        /// <param name="key">24位字符的密钥字符串</param>
        /// <returns></returns>
        public static string DESEncrypt(string originalValue, string key)
        {
            if (string.IsNullOrEmpty(originalValue))
            {
                return originalValue;
            }
            try
            {
                var DES = new TripleDESCryptoServiceProvider()
                {
                    Key = ASCIIEncoding.ASCII.GetBytes(key),
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.Zeros
                };
                ICryptoTransform DESEncrypt = DES.CreateEncryptor();
                byte[] Buffer = originalValue.ToHexBytes();
                var bytes = DESEncrypt.TransformFinalBlock(Buffer, 0, Buffer.Length);
                return bytes.ToHexString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        #endregion

        #region 解密
        public static string DESDecrypst(string data)
        {
            return DESDecrypst(data, key);
        }
        /// <summary>
        /// 3DES解密
        /// </summary>
        /// <param name="data">解密数据</param>
        /// <param name="key">24位字符的密钥字符串(需要和加密时相同)</param>
        /// <returns></returns>
        public static string DESDecrypst(string data, string key)
        {
            if (string.IsNullOrEmpty(data))
            {
                return data;
            }
            try
            {
                var DES = new TripleDESCryptoServiceProvider()
                {
                    Key = ASCIIEncoding.ASCII.GetBytes(key),
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.Zeros
                };
                ICryptoTransform DESDecrypt = DES.CreateDecryptor();
                byte[] Buffer = data.ToHexBytes();
                var bytes = DESDecrypt.TransformFinalBlock(Buffer, 0, Buffer.Length);
                return bytes.ToHexString();
            }
            catch
            {
                return string.Empty;
            }
        }
        #endregion

        #region MD5（小写）
        /// <summary>
        /// MD5（小写）
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string md5(string value)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(value);
            bytes = new MD5CryptoServiceProvider().ComputeHash(bytes);
            string text = "";
            for (int i = 0; i < bytes.Length; i++)
            {
                text += bytes[i].ToString("x2");
            }
            return text;
        }
        public static string md5_16(string value)
        {
            return md5(value).Substring(8, 16); ;
        }
        #endregion
    }
}
