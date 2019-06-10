using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 试卷练习学生答题按钮原始数据表（er_student_button_answer_original_record）
    /// </summary>
    [TableAttribute("er_student_button_answer_original_record")]
    public class ErStudentButtonAnswerOriginalRecord : IEntity
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
        [ColumnAttribute("student_id", Size = 20)]
        public long student_id { get; set; }
        /// <summary>
        /// 试题Id 
        /// </summary>
        [ColumnAttribute("question_id", Size = 20)]
        public long question_id { get; set; }
        /// <summary>
        /// 练习记录Id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 按钮项 
        /// </summary>
        [ColumnAttribute("button_item", Size = 20)]
        public string button_item { get; set; }
        /// <summary>
        /// 是否是答案提交 
        /// </summary>
        [ColumnAttribute("is_submit")]
        public bool is_submit { get; set; }
        /// <summary>
        /// 是否是自判提交 
        /// </summary>
        [ColumnAttribute("is_self_judgment")]
        public bool is_self_judgment { get; set; }
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