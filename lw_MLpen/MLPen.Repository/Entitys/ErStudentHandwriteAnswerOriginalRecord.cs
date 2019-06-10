using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 试卷练习学生答题笔记原始数据表（er_student_handwrite_answer_original_record）
    /// </summary>
    [TableAttribute("er_student_handwrite_answer_original_record")]
    public class ErStudentHandwriteAnswerOriginalRecord : IEntity
    {
        /// <summary>
        /// 当前记录id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 学生Id 
        /// </summary>
        [ColumnAttribute("student_id")]
        public long? student_id { get; set; }
        /// <summary>
        /// 试题Id 
        /// </summary>
        [ColumnAttribute("question_id")]
        public long? question_id { get; set; }
        /// <summary>
        /// 练习记录Id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 笔记数据 
        /// </summary>
        [ColumnAttribute("handwrite", Size = 255)]
        public string handwrite { get; set; }
        /// <summary>
        /// 是否提交 
        /// </summary>
        [ColumnAttribute("is_submit")]
        public bool is_submit { get; set; }
        /// <summary>
        /// 阶段属性 
        /// </summary>
        [ColumnAttribute("step_number", Size = 2)]
        public int? step_number { get; set; }
        /// <summary>
        /// 云端同步状态 
        /// </summary>
        [ColumnAttribute("synchronous_status", Size = 1)]
        public int synchronous_status { get; set; }
        /// <summary>
        /// 创建时间 
        /// </summary>
        [ColumnAttribute("create_time")]
        public DateTime? create_time { get; set; }
    }
}