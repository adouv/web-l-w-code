using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 网络帮助类
    /// </summary>
    public class NetworkHelper
    {
        /// <summary>
        /// 检测当前用户网络是否连接
        /// </summary>
        public static bool IsConnectedToInternet
        {
            get
            {
                return WinApi.InternetGetConnectedState(0, 0);
            }
        }

        #region 检查IP地址或域名是否可以使用TCP/IP协议访问
        /// <summary>
        /// 用于检查IP地址或域名是否可以使用TCP/IP协议访问(使用Ping命令),true表示Ping成功,false表示Ping失败 
        /// </summary>
        /// <param name="strIpOrDName">输入参数,表示IP地址或域名</param>
        /// <returns></returns>
        public static bool PingIpOrDomainName(string strIpOrDName)
        {
            try
            {
                Ping objPingSender = new Ping();
                PingOptions objPinOptions = new PingOptions();
                objPinOptions.DontFragment = true;
                string data = "";
                byte[] buffer = Encoding.UTF8.GetBytes(data);
                int intTimeout = 120;//毫秒
                PingReply objPinReply = objPingSender.Send(strIpOrDName, intTimeout, buffer, objPinOptions);
                string strInfo = objPinReply.Status.ToString();
                if (strInfo == "Success")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
        #endregion

        #region 获取本机在局域网的IP地址
        /// <summary>
        /// 获取本机在局域网的IP地址
        /// </summary>
        /// <returns></returns>
        public static string GetLocalIPAddress()
        {
            System.Net.IPAddress[] addressList = Dns.GetHostEntry(Dns.GetHostName()).AddressList;
            string strServerIP = string.Empty;
            foreach (var item in addressList)
            {
                if (item.ToString().Contains(":")) continue;
                strServerIP = item.ToString();
            }
            return strServerIP;
        }
        #endregion
    }
}
