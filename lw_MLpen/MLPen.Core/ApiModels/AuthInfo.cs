using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 当前登录用户的信息
    /// </summary>
    public class AuthInfo
    {
        /// <summary>
        /// 账户id
        /// </summary>
        public int accountId { get; set; }
        /// <summary>
        /// 登录名
        /// </summary>
        public string accountName { get; set; }
        /// <summary>
        /// 显示名
        /// </summary>
        public string displayName { get; set; }
        /// <summary>
        /// 用户头像地址
        /// </summary>
        public string imgUrl { get; set; }
        /// <summary>
        /// 用户签名图片地址
        /// </summary>
        public string signatureImgUrl { get; set; }
        /// <summary>
        /// 是否需要强制修改密码
        /// </summary>
        public bool isNeedModifyPassword { get; set; }
        /// <summary>
        /// 用户类型
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 类型显示名称
        /// </summary>
        public string typeName { get; set; }
        /// <summary>
        /// 所属的园区列表
        /// </summary>
        public List<AuthInfoGarden> gardens { get; set; }
    }
    /// <summary>
    /// 当前登录用户的信息-园区
    /// </summary>
    public class AuthInfoGarden
    {
        /// <summary>
        /// 园区id
        /// </summary>
        public int gardenId { get; set; }
        /// <summary>
        /// 园区名称
        /// </summary>
        public string gardenName { get; set; }
        /// <summary>
        /// 园区类型id
        /// </summary>
        public int gardenTypeId { get; set; }
        /// <summary>
        /// 角色名称集合
        /// </summary>
        public List<string> roleNames { get; set; }
    }
}
