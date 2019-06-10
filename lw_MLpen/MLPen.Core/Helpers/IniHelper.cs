using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class IniHelper
    {
        public string FileName;

        private IniHelper() { }
        /// <summary>
        /// 打开文件
        /// </summary>
        /// <param name="filename">真实文件路径</param>
        /// <returns></returns>
        public static IniHelper Open(string filename)
        {
            var helper = new IniHelper();
            if (!FileHelper.IsFileExists(filename))
            {
                var folder = FileHelper.GetFolderName(filename);
                if (!FileHelper.IsFolderExists(folder)) FileHelper.CreateFolder(folder);
                FileHelper.White(filename, null);
            }
            helper.FileName = filename;
            return helper;
        }

        #region 写INI文件
        private void Write(string Section, string Key, object Value)
        {
            if (!WinApi.WritePrivateProfileString(Section.ToString(), Key, Convert.ToString(Value), FileName))
            {
                throw (new ApplicationException("写Ini文件出错"));
            }
        }
        /// <summary>
        /// 写INI文件
        /// </summary>
        /// <param name="Section"></param>
        /// <param name="Key"></param>
        /// <param name="Value"></param>
        public void Write(IniConfig.Section Section, string Key, object Value)
        {
            Write(Section.ToString(), Key, Convert.ToString(Value));
        }
        #endregion

        #region 读取INI文件
        public T Read<T>(string Section, string Key, T Default)
        {
            Byte[] Buffer = new Byte[65535];
            int bufLen = WinApi.GetPrivateProfileString(Section, Key, Convert.ToString(Default), Buffer, Buffer.GetUpperBound(0), FileName);

            string value = Encoding.GetEncoding(0).GetString(Buffer).Substring(0, bufLen);
            return value.TryParse<T>();
        }
        /// <summary>
        /// 读取INI文件
        /// </summary>
        /// <param name="section"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public string Read(string section, string key)
        {
            return Read<string>(section.ToString(), key, null);
        }
        #endregion
    }
}
