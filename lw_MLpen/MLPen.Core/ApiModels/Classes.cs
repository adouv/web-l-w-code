using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 班级
    /// </summary>
    public class Classes
    {
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; }
        /// <summary>
        /// 班级名称
        /// </summary>
        public string className { get; set; }
        /// <summary>
        /// 园区ID
        /// </summary>
        public int gardenId { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int gradeId { get; set; }
        /// <summary>
        /// 年级名称
        /// </summary>
        public string gradeName { get; set; }
        /// <summary>
        /// 讲师ID，可以为多个，多个之前使用','分割
        /// </summary>
        public string teacherId { get; set; }
        /// <summary>
        /// 讲师名称，可以多个，多个之间使用'；'分割
        /// </summary>
        public string teacherName { get; set; }
    }
}
