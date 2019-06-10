using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 配置文件
    /// </summary>
    public class MSConfig
    {
        /// <summary>
        /// 配置文件路径
        /// </summary>
        private static string filename = @"~/Config/config.ini";
        private static Helpers.IniHelper ini;
        static MSConfig()
        {
            var path = MSUtils.GetMapPath(filename);
            ini = Helpers.IniHelper.Open(path);
            db_server = read("DB", "SERVER", "localhost");
            db_port = read("DB", "PORT", 3306);
            db_name = read("DB", "NAME", "lw_mlpen");
            db_user = read("DB", "USER", "root");
            db_pwd = read("DB", "PWD", string.Empty);

            port = read("PEN", "PORT", 3389);
            server_port = read("PEN", "SERVER_PORT", 8486);
            client_port = read("PEN", "CLIENT_PORT", 1234);

            mq_host = read("MQSERVER", "HOST", "127.0.0.1");
            mq_username = read("MQSERVER", "USERNAME", "admin");
            mq_password = read("MQSERVER", "PASSWORD", "admin");

            host_lw_tpk_server = read("HOST", "LW_TPK_SERVER", string.Empty);
            host_lw_class_interaction_server = read("HOST", "LW_CLASS_INTERACTION_SERVER", string.Empty);
            host_lw_authz_server = read("HOST", "LW_AUTHZ_SERVER", string.Empty);
            host_lw_garden_server = read("HOST", "LW_GARDEN_SERVER", string.Empty);
            host_lw_face_server = read("HOST", "LW_FACE_SERVER", string.Empty);
            host_lw_file_server_download = read("HOST", "LW_FILE_SERVER_DOWNLOAD", string.Empty);

            link_address_lw_practice_record = read("LINKADDRESS", "LW_PRACTICE_RECORD", string.Empty);
            link_address_lw_paper_manager = read("LINKADDRESS", "LW_PAPER_MANAGER", string.Empty);
            link_address_lw_select_paper = read("LINKADDRESS", "LW_SELECT_PAPER", string.Empty);
            link_address_lw_record_single = read("LINKADDRESS", "LW_RECORD_SINGLE", string.Empty);
            link_address_lw_record_all = read("LINKADDRESS", "LW_RECORD_ALL", string.Empty);
            link_address_lw_record_small_single = read("LINKADDRESS", "LW_RECORD_SMALL_SINGLE", string.Empty);
            link_address_lw_record_small_all = read("LINKADDRESS", "LW_RECORD_SMALL_ALL", string.Empty);
        }
        private static T read<T>(string section, string key, T defValue)
        {
            return ini.Read(section, key, defValue);
        }

        public static string db_server { get; private set; }
        public static int db_port { get; private set; }
        public static string db_name { get; private set; }
        public static string db_user { get; private set; }
        public static string db_pwd { get; private set; }

        public static int server_port { get; private set; }
        public static int client_port { get; private set; }
        public static int port { get; private set; }

        public static string mq_host { get; private set; }
        public static string mq_username { get; private set; }
        public static string mq_password { get; private set; }

        public static string host_lw_tpk_server { get; private set; }
        public static string host_lw_class_interaction_server { get; private set; }
        public static string host_lw_authz_server { get; private set; }
        public static string host_lw_garden_server { get; private set; }
        public static string host_lw_face_server { get; private set; }
        public static string host_lw_file_server_download { get; private set; }

        public static string link_address_lw_practice_record { get; private set; }
        public static string link_address_lw_paper_manager { get; private set; }
        public static string link_address_lw_select_paper { get; private set; }
        public static string link_address_lw_record_single { get; private set; }
        public static string link_address_lw_record_all { get; private set;}
        public static string link_address_lw_record_small_single { get; private set; }
        public static string link_address_lw_record_small_all { get; private set; }
    }
}
