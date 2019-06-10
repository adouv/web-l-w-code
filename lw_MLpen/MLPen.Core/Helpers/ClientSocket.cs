using System;
using System.Collections.Generic;
using System.Linq;
using WebSocketSharp;
using WebSocketSharp.Net;
using WebSocketSharp.Server;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class ClientSocket
    {
        private static string websocketUrl = "";

        public static string getWebsocketUrl() {
            return websocketUrl;
        }
        public WebSocketServer wssv;
        public ClientSocket()
        {
            for (int i=0; i<100;i++) {
                if (onEventInit(i)) {
                    break;
                };
            };
        }


        private bool onEventInit(int i)
        {
            try {
                
                wssv = new WebSocketServer(10086+i);
                wssv.AddWebSocketService<ScannerHandler>("/scan");
                wssv.Start();
                websocketUrl = "ws://"+ NetworkHelper.GetLocalIPAddress() + ":"+ (10086 + i) + "/scan";
                return true;
            }
            catch (Exception e) {
                return false;
            }
        }

    }
}
