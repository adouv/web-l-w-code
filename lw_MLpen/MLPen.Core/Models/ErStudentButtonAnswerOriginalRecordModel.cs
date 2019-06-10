using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 试卷练习学生答题按钮原始数据表（er_student_button_answer_original_record）
    /// </summary>
    public class ErStudentButtonAnswerOriginalRecordModel
    {
        #region Create
        /// <summary>
        /// 创建记录
        /// </summary>
        public class CreateItem
        {
            /// <summary>
            /// 当前记录id 
            /// </summary>
            public string id { get; set; }
            /// <summary>
            /// 学生Id 
            /// </summary>
            public long? student_id { get; set; }
            /// <summary>
            /// 试题Id 
            /// </summary>
            public long? question_id { get; set; }
            /// <summary>
            /// 练习记录Id 
            /// </summary>
            public string exercise_record_id { get; set; }
            /// <summary>
            /// 按钮项 
            /// </summary>
            public string button_item { get; set; }
            /// <summary>
            /// 是否是答案提交 
            /// </summary>
            public bool is_submit { get; set; }
            /// <summary>
            /// 是否是自判提交 
            /// </summary>
            public bool is_self_judgment { get; set; }
            /// <summary>
            /// 阶段属性 
            /// </summary>
            public int? step_number { get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
            /// <summary>
            /// 创建时间 
            /// </summary>
            public DateTime? create_time { get; set; }
        }
        #endregion
    }
}