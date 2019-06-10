using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Controls;
using System.Windows.Media.Imaging;

namespace MLPen
{
    public static class MSUtils
    {
        #region 是否是设计模式
        public static bool IsInDesignMode(this Control control)
        {
            return System.ComponentModel.DesignerProperties.GetIsInDesignMode(control);
        } 
        #endregion

        #region 系统运行目录
        /// <summary>
        /// 系统运行目录
        /// </summary>
        /// <returns></returns>
        public static string GetAppPath => AppDomain.CurrentDomain.BaseDirectory;
        #endregion

        #region 获取文件真实目录
        /// <summary>
        /// 获取文件真实目录
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static string GetMapPath(string path)
        {
            path = path.Replace("/", @"\");
            if (path.StartsWith(@"~\")) return path.Replace(@"~\", GetAppPath);
            if (path.StartsWith("\\")) path = path.Substring(1);
            return Path.Combine(GetAppPath, path);
        }
        #endregion

        #region 获取包文件
        /// <summary>
        /// 获取包文件,如：Pack://application:,,,
        /// </summary>
        /// <param name="pathFormat">文件路径</param>
        /// <returns></returns>
        public static string GetPack(string pathFormat, params object[] args)
        {
            return "Pack://application:,,," + pathFormat.Formats(args);
        }
        #endregion

        #region URL转码
        /// <summary>
        /// URL转码
        /// </summary>
        /// <param name="code"></param>
        public static string UrlEncode(string code)
        {
            code = HttpUtility.UrlEncode(code);
            code = code.Replace("!", "%21");
            //code = code.Replace("#", "%23");
            //code = code.Replace("$", "%24");
            //code = code.Replace("&", "%26");
            //code = code.Replace("'", "%27");
            code = code.Replace("(", "%28");
            code = code.Replace(")", "%29");
            //code = code.Replace("*", "%2A");
            //code = code.Replace("+", "%2B");
            //code = code.Replace(",", "%2C");
            //code = code.Replace("/", "%2F");
            //code = code.Replace(":", "%3A");
            //code = code.Replace(";", "%3B");
            //code = code.Replace("=", "%3D");
            //code = code.Replace("?", "%3F");
            //code = code.Replace("@", "%40");
            //code = code.Replace("[", "%5B");
            //code = code.Replace("]", "%5D");
            return code;
        }
        #endregion

        #region 获取本地图片资源
        /// <summary>
        /// 获取本地图片资源
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static BitmapImage GetLocalImage(string path)
        {
            var pack = GetPack(path);
            var uri = new Uri(pack);
            return new BitmapImage(uri);
        }
        #endregion

        #region 加载网页地址
        /// <summary>
        /// 加载网页地址
        /// </summary>
        /// <param name="urlOrPath"></param>
        /// <returns></returns>
        public static string LoadWebPath(string urlOrPath)
        {
            if (urlOrPath.StartsWith("http")) return urlOrPath;
            else
            {
                var url = urlOrPath.Replace("~/", GetAppPath).Replace("\\", "/");
                return "file:///" + url;
            }
        }
        #endregion

        #region 获取学生头
        /// <summary>
        /// 获取学生头像（自动转换）
        /// </summary>
        /// <param name="imgUrl"></param>
        /// <returns></returns>
        public static string GetStudentFace(string imgUrl, bool gender)
        {
            if (imgUrl.IsEmpty())
            {
                if (gender == false)
                {
                    return MSUtils.GetPack("/assets/images/ic-face-girl.png");
                }
                else if (gender == true)
                {
                    return MSUtils.GetPack("/assets/images/ic-face-boy.png");
                }
                else
                {
                    return MSUtils.GetPack("/assets/images/ic-face-none.png");
                }
            }
            else
            {
                var md5 = Helpers.EncryptHelper.md5(imgUrl);
                var filename = $"/caches/face/{md5}.{(imgUrl.Contains("png") ? "png" : "jpg")}";
                var fullpath = MSUtils.GetMapPath(filename);
                if (Helpers.FileHelper.IsFileExists(fullpath))
                {
                    return fullpath;
                }
                else
                {
                    Helpers.FileHelper.CreateFolder(Helpers.FileHelper.GetFolderName(fullpath));
                    var url = MSConfig.host_lw_face_server + imgUrl.Replace("\r", "").Replace("\n", "").Trim();
                    using (var client = new WebClient())
                    {
                        client.DownloadFileAsync(new Uri(url), fullpath);
                    }
                    return url;
                }
            }
        }
        #endregion

        #region Stopwatch计时器
        /// <summary>
        /// 计时器开始
        /// </summary>
        /// <returns></returns>
        public static Stopwatch TimerStart()
        {
            Stopwatch watch = new Stopwatch();
            watch.Reset();
            watch.Start();
            return watch;
        }
        /// <summary>
        /// 计时器结束（返回毫秒）
        /// </summary>
        /// <param name="watch"></param>
        /// <returns></returns>
        public static long TimerEnd(Stopwatch watch)
        {
            watch.Stop();
            return watch.ElapsedMilliseconds;
        }
        #endregion

        #region 获取总页数
        /// <summary>
        /// 获取总页数
        /// </summary>
        /// <param name="totalRecord"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public static int GetPageCount(double totalRecord, double pageSize)
        {
            return (int)Math.Floor((totalRecord * 1.0 + pageSize * 1.0 - 1.0) / pageSize);
        }
        #endregion

        #region 数字转中文
        /// <summary>
        /// 数字转中文
        /// </summary>
        /// <param name="number">eg: 22</param>
        /// <returns></returns>
        public static string NumberToChinese(int number)
        {
            string res = string.Empty;
            string str = number.ToString();
            string schar = str.Substring(0, 1);
            switch (schar)
            {
                case "1":
                    res = "一";
                    break;
                case "2":
                    res = "二";
                    break;
                case "3":
                    res = "三";
                    break;
                case "4":
                    res = "四";
                    break;
                case "5":
                    res = "五";
                    break;
                case "6":
                    res = "六";
                    break;
                case "7":
                    res = "七";
                    break;
                case "8":
                    res = "八";
                    break;
                case "9":
                    res = "九";
                    break;
                default:
                    res = "零";
                    break;
            }
            if (str.Length > 1)
            {
                switch (str.Length)
                {
                    case 2:
                    case 6:
                        res += "十";
                        break;
                    case 3:
                    case 7:
                        res += "百";
                        break;
                    case 4:
                        res += "千";
                        break;
                    case 5:
                        res += "万";
                        break;
                    default:
                        res += "";
                        break;
                }
                res += NumberToChinese(int.Parse(str.Substring(1, str.Length - 1)));
            }
            return res;
        }
        #endregion
    }
}
