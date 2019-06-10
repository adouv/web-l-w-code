using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 学生-设备（t_student_device）
    /// </summary>
    public class TStudentDeviceModel
    {
        #region 更新设备与学生的关系
        /// <summary>
        /// 更新设备与学生的关系
        /// </summary>
        public class Update
        {
            /// <summary>
            /// 学生ID 
            /// </summary>
            public long id { get; set; }
            /// <summary>
            /// 设备ID 
            /// </summary>
            public string deviceid { get; set; }
            /// <summary>
            /// 设备IP 
            /// </summary>
            public string deviceip { get; set; }
        }
        #endregion

        #region 绑定信息
        public class BindInfo
        {
            /// <summary>
            /// 设备ID 
            /// </summary>
            public byte[] deviceid { get; set; }
            /// <summary>
            /// 设备IP 
            /// </summary>
            public string deviceip { get; set; }
        }
        #endregion
    }
}