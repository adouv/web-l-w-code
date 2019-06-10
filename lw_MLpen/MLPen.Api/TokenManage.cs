using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Api
{
    public interface ITokenManage : IAutofac
    {
        /// <summary>
        /// 获取当前Token
        /// </summary>
        string Token { get; }
        /// <summary>
        /// 更新Token（首次登录调用)
        /// </summary>
        /// <param name="token"></param>
        void Update(ApiModels.Token token);
        /// <summary>
        /// 是否包含Token
        /// </summary>
        /// <returns></returns>
        bool HasToken { get; }
    }
    /// <summary>
    /// Token 管理
    /// </summary>
    public class TokenManage : ITokenManage
    {
        /// <summary>
        /// 访问token
        /// </summary>
        private string access_token { get; set; }
        /// <summary>
        /// 刷新token
        /// </summary>
        private string refresh_token { get; set; }
        /// <summary>
        /// 过期时间（秒
        /// </summary>
        private int expires_in { get; set; }

        private bool mIsTimer;
        private TokenManage()
        {
        }

        private static TokenManage _instance;
        public static ITokenManage Instance()
        {
            if (_instance == null) _instance = new TokenManage();
            return _instance;
        }

        public void Update(ApiModels.Token token)
        {
            this.access_token = token.access_token;
            if (mIsTimer == false)
            {
                //开定时器来刷新Token
                mIsTimer = true;
            }
        }

        public string Token => access_token;
        public bool HasToken => access_token.IsNotEmtpy();
    }
}
