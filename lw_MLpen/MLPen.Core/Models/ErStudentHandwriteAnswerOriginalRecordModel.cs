using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 试卷练习学生答题笔记原始数据表（er_student_handwrite_answer_original_record）
    /// </summary>
    public class ErStudentHandwriteAnswerOriginalRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 当前记录id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 学生Id 
            /// </summary>
            public long? student_id {  get; set; }
            /// <summary>
            /// 试题Id 
            /// </summary>
            public long? question_id {  get; set; }
            /// <summary>
            /// 练习记录Id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 笔记数据 
            /// </summary>
            public string handwrite {  get; set; }
            /// <summary>
            /// 是否提交 
            /// </summary>
            public bool is_submit {  get; set; }
            /// <summary>
            /// 阶段属性 
            /// </summary>
            public int? step_number {  get; set; }
            /// <summary>
            /// 创建时间 
            /// </summary>
            public DateTime? create_time {  get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
        }
        #endregion
    }
}