using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 学生-设备（t_student_device）
    /// </summary>
    [TableAttribute("t_student_device")]
    public class TStudentDevice : IEntity
    {
        /// <summary>
        /// 学生ID 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true)]
        public long id { get; set; }
        /// <summary>
        /// 设备ID 
        /// </summary>
        [ColumnAttribute("deviceId", Size = 50)]
        public string deviceid { get; set; }
        /// <summary>
        /// 设备IP 
        /// </summary>
        [ColumnAttribute("deviceIp", Size = 50)]
        public string deviceip { get; set; }
        /// <summary>
        /// 注册时间 
        /// </summary>
        [ColumnAttribute("update_time")]
        public DateTime update_time { get; set; }
    }
}