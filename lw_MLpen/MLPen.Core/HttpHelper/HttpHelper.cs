using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// Http连接操作帮助类
    /// </summary>
    public class HttpHelper
    {
        private Random m_random = new Random();
        private const string accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
        private string[] userAgent = new string[]{
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/437.02 (KHTML, like Gecko) Chrome/40.0.2234.181 Safari/403.25",
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5383.400 QQBrowser/10.0.1313.400"
        };
        private string acceptLanguage = "zh-CN";

        private CookieContainer mCookies = new CookieContainer();
        private HttpWebRequest mRequest;

        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            return true; //总是接受  
        }

        #region OpenRequest-创建链接
        private void OpenRequest(HttpItem httpItem)
        {
            var _url = httpItem.URL;
            if (httpItem.PostData != null && httpItem.Method == "GET")
            {
                var _params = ConvertToString(httpItem);
                _url += "?" + _params;
            }

            var url = new Uri(_url);

            //如果是发送HTTPS请求  
            if (url.Scheme.ToLower() == "https")
            {
                ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
                mRequest = WebRequest.Create(url) as HttpWebRequest;
                mRequest.ProtocolVersion = HttpVersion.Version11;
            }
            else
            {
                mRequest = (HttpWebRequest)WebRequest.Create(url);
            }
            mRequest.Host = url.Host;
            mRequest.CookieContainer = this.mCookies;
            mRequest.Headers.Add("Accept-Language", acceptLanguage);
            if (httpItem.Headers != null && httpItem.Headers.Count > 0)
            {
                foreach (var item in httpItem.Headers)
                {
                    mRequest.Headers.Add(item.Key, item.Value);
                }
            }
            if (httpItem.Referer.IsNotEmtpy()) mRequest.Referer = httpItem.Referer;
            mRequest.KeepAlive = false;
            mRequest.Timeout = httpItem.Timeout;
            mRequest.ReadWriteTimeout = httpItem.ReadWriteTimeout;
            mRequest.ProtocolVersion = HttpVersion.Version11;
            mRequest.Accept = httpItem.PostData != null ? "*/*" : accept;
            mRequest.ServicePoint.Expect100Continue = false;
            mRequest.ServicePoint.ConnectionLimit = httpItem.Connectionlimit;
            mRequest.UseDefaultCredentials = false;
            mRequest.AllowWriteStreamBuffering = httpItem.Method == "POST";
            mRequest.ServicePoint.UseNagleAlgorithm = false;
            mRequest.AllowAutoRedirect = httpItem.Allowautoredirect;
            mRequest.UserAgent = userAgent[m_random.Next(0, 1)];
            mRequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            mRequest.Credentials = CredentialCache.DefaultCredentials;
            mRequest.Method = httpItem.Method;

            if (httpItem.ContentType == ContentType.JSON)
            {
                mRequest.ContentType = "application/json";
            }
            else if (httpItem.ContentType == ContentType.FILE)
            {
                mRequest.ContentType = "multipart/form-data";
            }
            else if (httpItem.ContentType == ContentType.FORM)
            {
                mRequest.ContentType = "application/x-www-form-urlencoded";
            }
            else
            {
                mRequest.ContentType = "text/plain";
            }

            if (httpItem.PostData != null && httpItem.Method == "POST")
            {
                var byteRequest = ConvertToData(httpItem);
                mRequest.ProtocolVersion = HttpVersion.Version11;
                mRequest.Headers["Pragma"] = "no-cache";
                mRequest.ContentLength = byteRequest.Length;
                using (var stream = mRequest.GetRequestStream())
                {
                    stream.Write(byteRequest, 0, byteRequest.Length);
                }
            }
        }
        #endregion

        #region ConvertToData-转换数据
        private string ConvertToString(HttpItem item)
        {
            var data = string.Empty;
            switch (item.ContentType)
            {
                case ContentType.JSON:
                    data = JsonHelper.ToJSON(item.PostData);
                    break;
                case ContentType.NORMAL:
                case ContentType.FORM:
                    {
                        if (item.PostData as string != null)
                        {
                            data = Convert.ToString(item.PostData);
                        }
                        else
                        {
                            var dics = item.PostData.ToDictionary();
                            var _postdata = dics.Select(m => m.Key + "=" + System.Web.HttpUtility.UrlEncode(Convert.ToString(m.Value))).ToList();
                            data = string.Join("&", _postdata);
                        }
                    }
                    break;
            }
            return data;
        }
        private byte[] ConvertToData(HttpItem item)
        {
            if (item.PostBytes != null && item.PostBytes.Length > 0) return item.PostBytes;

            var data = ConvertToString(item);
            return Encoding.UTF8.GetBytes(data);
        }
        #endregion

        #region Abort-强制终止
        /// <summary>
        /// 强制终止
        /// </summary>
        private void Abort()
        {
            try
            {
                if (mRequest != null)
                {
                    mRequest.Abort();
                    mRequest = null;
                }
            }
            catch (Exception ex)
            {
            }
        }
        #endregion

        #region ContentType
        /// <summary>
        /// 类型内容
        /// </summary>
        public enum ContentType
        {
            /// <summary>
            /// 标准
            /// </summary>
            NORMAL,
            /// <summary>
            /// 表单数据
            /// </summary>
            FORM,
            /// <summary>
            /// 提交JSON数据
            /// </summary>
            JSON,
            /// <summary>
            /// 上传文件
            /// </summary>
            FILE
        }
        #endregion

        #region HttpItem-请求参数
        /// <summary>
        /// 参数
        /// </summary>
        public class HttpItem
        {
            /// <summary>
            /// 请求地址
            /// </summary>
            public string URL { get; set; }
            /// <summary>
            /// 来源地址，上次访问地址
            /// </summary>
            public string Referer { get; set; }
            /// <summary>
            /// 定义内容类型
            /// </summary>
            public ContentType ContentType { get; set; } = ContentType.FORM;
            /// <summary>
            /// 头部信息
            /// </summary>
            public Dictionary<string, string> Headers { get; set; }
            /// <summary>
            /// 请求方式，默认GET
            /// </summary>
            public string Method { get; set; } = "GET";
            /// <summary>
            /// 请求数据
            /// </summary>
            public object PostData { get; set; }
            /// <summary>
            /// 请求数据（与PostData二选一），优先于PostData
            /// </summary>
            public byte[] PostBytes { get; set; }
            /// <summary>
            /// 请求超时时间(100000)
            /// </summary>
            public int Timeout { get; set; } = 100000;
            /// <summary>
            /// 写入超时时间(30000)
            /// </summary>
            public int ReadWriteTimeout { get; set; } = 30000;
            /// <summary>
            /// 支持跳转页面，查询结果将是跳转后的页面，默认是不跳转(true)
            /// </summary>
            public Boolean Allowautoredirect { get; set; } = true;
            /// <summary>
            /// 最大连接数(1024)
            /// </summary>
            public int Connectionlimit { get; set; } = 1024;
        }
        #endregion

        #region RequestResult-请求返回数据
        /// <summary>
        /// 请求返回数据
        /// </summary>
        public class RequestResult<T>
        {
            /// <summary>
            /// 请求是否成功
            /// </summary>
            public bool IsSuccess { get; set; }
            /// <summary>
            /// 返回的内容
            /// </summary>
            public T Data { get; set; }
            /// <summary>
            /// 失败的原因
            /// </summary>
            public string Error { get; set; }
        }
        #endregion

        #region _request-基础请求
        /// <summary>
        /// 基础请求
        /// </summary>
        /// <param name="item"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        private MSResult _request(HttpItem item, Action<Stream> action)
        {
            var result = MSResult.Init(false, null);
            HttpWebResponse httpWebResponse = null;
            try
            {
                OpenRequest(item);
                httpWebResponse = (HttpWebResponse)mRequest.GetResponse();
                var code = httpWebResponse.StatusCode;
                if (code == HttpStatusCode.OK)
                {
                    result.flag = true;
                    using (var staream = httpWebResponse.GetResponseStream())
                    {
                        mCookies = mRequest.CookieContainer; //保存cookies
                        action(staream);
                    }
                }
                else
                {
                    result.msg = HttpMessage.ToMessage(code);
                }
            }
            catch (WebException ex)
            {
                if (ex.Status != WebExceptionStatus.ConnectFailure)
                {
                    using (var staream = ex.Response.GetResponseStream())
                    {
                        using (var streamReader = new StreamReader(staream, Encoding.UTF8))
                        {
                            try
                            {
                                var json = streamReader.ReadToEnd();
                                var data = JsonHelper.ToObject<Dictionary<string, object>>(json);
                                if (data.ContainsKey("developer_message")) result.msg = (string)data["developer_message"];
                                else if (data.ContainsKey("error_description")) result.msg = (string)data["error_description"];
                                else result.msg = HttpMessage.ToMessage(ex.Status);
                            }
                            catch
                            {
                                result.msg = HttpMessage.ToMessage(ex.Status);
                            }
                        }
                    }
                }
                else
                {
                    result.msg = HttpMessage.ToMessage(ex.Status);
                }
            }
            catch (Exception ex)
            {
                result.msg = ex.Message;
            }
            finally
            {
                if (httpWebResponse != null)
                {
                    httpWebResponse.Close();
                    httpWebResponse = null;
                }
                Abort();
            }
            return result;
        }
        #endregion

        #region GetBytes-获取字节
        /// <summary>
        /// 获取字节
        /// </summary>
        /// <param name="item">参数</param>
        /// <returns></returns>
        public RequestResult<byte[]> GetBytes(HttpItem item)
        {
            var result = new RequestResult<byte[]>();
            var ret = _request(item, stream =>
            {
                int bytesRead = 0;
                byte[] buffer = new byte[65530];
                using (MemoryStream memstream = new MemoryStream())
                {
                    while ((bytesRead = stream.Read(buffer, 0, buffer.Length)) > 0)
                    {
                        memstream.Write(buffer, 0, bytesRead);
                    }
                    result.Data = memstream.GetBuffer();
                }
            });
            result.IsSuccess = ret.flag;
            result.Error = ret.msg;
            return result;
        }
        #endregion

        #region GetBitmap-获取图片
        /// <summary>
        /// 获取图片
        /// </summary>
        /// <param name="item">参数</param>
        /// <returns></returns>
        public RequestResult<Bitmap> GetBitmap(HttpItem item)
        {
            var result = new RequestResult<Bitmap>();
            var ret = _request(item, stream =>
            {
                using (var streamReader = new StreamReader(stream, Encoding.UTF8))
                {
                    result.Data = new Bitmap(streamReader.BaseStream, false);
                }
            });
            result.IsSuccess = ret.flag;
            result.Error = ret.msg;
            return result;
        }
        #endregion

        #region GetHtml-获取Html内容
        /// <summary>
        /// 请求
        /// </summary>
        /// <param name="item">参数</param>
        /// <returns></returns>
        public RequestResult<string> GetHtml(HttpItem item)
        {
            var result = new RequestResult<string>();
            var ret = _request(item, stream =>
            {
                using (var streamReader = new StreamReader(stream, Encoding.UTF8))
                {
                    result.Data = streamReader.ReadToEnd();
                }
            });
            result.IsSuccess = ret.flag;
            result.Error = ret.msg;
            return result;
        }
        #endregion

        #region GetObject-获取T内容
        /// <summary>
        /// 请求
        /// </summary>
        /// <param name="item">参数</param>
        /// <returns></returns>
        public RequestResult<T> GetObject<T>(HttpItem item)
        {
            var result = GetHtml(item);
            if (result.IsSuccess)
            {
                var data = JsonHelper.ToObject<T>(result.Data);
                return new RequestResult<T>()
                {
                    IsSuccess = result.IsSuccess,
                    Error = result.Error,
                    Data = data
                };
            }
            else
            {
                return new RequestResult<T>()
                {
                    IsSuccess = result.IsSuccess,
                    Error = result.Error
                };
            }
        }
        #endregion
    }
}
