using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MLPen.Api
{
    /// <summary>
    /// 客户端基类，只能继承
    /// </summary>
    public abstract class ClientBase
    {
        public ClientBase()
        {
        }

        #region 请求接口
        /// <summary>
        /// 请求接口
        /// </summary>
        /// <param name="method"></param>
        /// <param name="host"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private Helpers.HttpHelper.RequestResult<string> _request(string method, MSTYPE.HOST hostType, string url, object data)
        {
            var host = string.Empty;
            switch (hostType)
            {
                case MSTYPE.HOST.LW_TPK_SERVER:
                    host = MSConfig.host_lw_tpk_server;
                    break;
                case MSTYPE.HOST.LW_CLASS_INTERACTION_SERVER:
                    host = MSConfig.host_lw_class_interaction_server;
                    break;
                case MSTYPE.HOST.LW_AUTHZ_SERVER:
                    host = MSConfig.host_lw_authz_server;
                    break;
                case MSTYPE.HOST.LW_GARDEN_SERVER:
                    host = MSConfig.host_lw_garden_server;
                    break;
            }
            var headers = new Dictionary<string, string>();
            var tokenManage = TokenManage.Instance();
            if (tokenManage.HasToken)
            {
                headers.Add("TOKEN", tokenManage.Token);
            }
            var http = new Helpers.HttpHelper();
            var result = http.GetHtml(new Helpers.HttpHelper.HttpItem()
            {
                URL = host + url,
                Headers = headers,
                PostData = data,
                Method = method
            });
            if (result.IsSuccess)
            {
                try
                {
                    return new Helpers.HttpHelper.RequestResult<string>()
                    {
                        Error = result.Error,
                        IsSuccess = result.IsSuccess,
                        Data = result.Data
                    };
                }
                catch (Exception ex)
                {
                    return new Helpers.HttpHelper.RequestResult<string>()
                    {
                        Error = "无效的数据返回，请与管理员联系."
                    };
                }
            }
            else
            {
                return new Helpers.HttpHelper.RequestResult<string>()
                {
                    Error = result.Error
                };
            }
        }
        /// <summary>
        /// 请求接口
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        private Helpers.HttpHelper.RequestResult<T> _request<T>(string method, MSTYPE.HOST host, string url, object data)
        {
            var result = _request(method, host, url, data);
            if (result.IsSuccess)
            {
                try
                {
                    return new Helpers.HttpHelper.RequestResult<T>()
                    {
                        Error = result.Error,
                        IsSuccess = result.IsSuccess,
                        Data = Helpers.JsonHelper.ToObject<T>(result.Data)
                    };
                }
                catch (Exception ex)
                {
                    return new Helpers.HttpHelper.RequestResult<T>()
                    {
                        Error = Helpers.ExceptionHelper.GetMessage(ex)
                    };
                }
            }
            else
            {
                return new Helpers.HttpHelper.RequestResult<T>()
                {
                    Error = result.Error
                };
            }
        }
        #endregion

        #region 请求接口
        /// <summary>
        /// 请求接口
        /// </summary>
        /// <param name="method">请求方式</param>
        /// <param name="url">请求地址</param>
        /// <param name="data">请求数据</param>
        /// <returns></returns>
        protected MSResult<string> Request(string method, MSTYPE.HOST host, string url, object data = null)
        {
            var result = _request(method, host, url, data);
            if (result.IsSuccess) return MSResult<string>.Init(true, null, result.Data);
            else return MSResult<string>.Init(result.Error);
        }
        /// <summary>
        /// 请求接口
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="method">请求方式</param>
        /// <param name="url">请求地址</param>
        /// <param name="data">请求数据</param>
        /// <returns></returns>
        protected MSResult<T> Request<T>(string method, MSTYPE.HOST host, string url, object data = null)
        {
            var result = _request<T>(method, host, url, data);
            if (result.IsSuccess) return MSResult<T>.Init(result.Data);
            else return MSResult<T>.Init(result.Error);
        }
        #endregion
    }
}
