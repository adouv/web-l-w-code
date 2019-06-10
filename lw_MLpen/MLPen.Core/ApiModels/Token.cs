using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    public class Token
    {
        /// <summary>
        /// 访问token
        /// </summary>
        public string access_token { get; set; }
        /// <summary>
        /// 刷新token
        /// </summary>
        public string refresh_token { get; set; }
        /// <summary>
        /// 过期时间（秒
        /// </summary>
        public int expires_in { get; set; }
    }
}
