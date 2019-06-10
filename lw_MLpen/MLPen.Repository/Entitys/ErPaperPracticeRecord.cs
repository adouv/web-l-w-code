using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 习题练习记录表（er_paper_practice_record）
    /// </summary>
    [TableAttribute("er_paper_practice_record")]
    [Serializable]
    public class ErPaperPracticeRecord : IEntity
    {
        /// <summary>
        /// 练习记录ID 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 试卷ID 
        /// </summary>
        [ColumnAttribute("paper_id", Size = 20)]
        public long? paper_id { get; set; }
        /// <summary>
        /// 试卷名称 
        /// </summary>
        [ColumnAttribute("paper_name", Size = 50)]
        public string paper_name { get; set; }
        /// <summary>
        /// 试卷类型 
        /// </summary>
        [ColumnAttribute("paper_type", Size = 1)]
        public int? paper_type { get; set; }
        /// <summary>
        /// 所包含的试题总数 
        /// </summary>
        [ColumnAttribute("paper_question_total_number", Size = 2)]
        public int? paper_question_total_number { get; set; }
        /// <summary>
        /// 所属园区id 
        /// </summary>
        [ColumnAttribute("garden_id", Size = 20)]
        public long? garden_id { get; set; }
        /// <summary>
        /// 所属系统学年id 
        /// </summary>
        [ColumnAttribute("system_academic_year_id", Size = 20)]
        public long? system_academic_year_id { get; set; }
        /// <summary>
        /// 所属系统学年 
        /// </summary>
        [ColumnAttribute("system_academic_year", Size = 5)]
        public int? system_academic_year { get; set; }
        /// <summary>
        /// 所属系统学年名称 
        /// </summary>
        [ColumnAttribute("academic_name", Size = 50)]
        public string academic_name { get; set; }
        /// <summary>
        /// 所属班级ID 
        /// </summary>
        [ColumnAttribute("class_id", Size = 20)]
        public long? class_id { get; set; }
        /// <summary>
        /// 所属班级名称 
        /// </summary>
        [ColumnAttribute("class_name", Size = 50)]
        public string class_name { get; set; }
        /// <summary>
        /// 所属年级id 
        /// </summary>
        [ColumnAttribute("grade_id", Size = 20)]
        public long? grade_id { get; set; }
        /// <summary>
        /// 所属年级名称 
        /// </summary>
        [ColumnAttribute("grade_name", Size = 50)]
        public string grade_name { get; set; }
        /// <summary>
        /// 所属教师id 
        /// </summary>
        [ColumnAttribute("teacher_id", Size = 20)]
        public int? teacher_id { get; set; }
        /// <summary>
        /// 所属教师名称 
        /// </summary>
        [ColumnAttribute("teacher_name", Size = 50)]
        public string teacher_name { get; set; }
        /// <summary>
        /// 所属学科编码 
        /// </summary>
        [ColumnAttribute("subject_code", Size = 50)]
        public string subject_code { get; set; }
        /// <summary>
        /// 所属课节 
        /// </summary>
        [ColumnAttribute("period", Size = 2)]
        public int? period { get; set; }
        /// <summary>
        /// 所属周天 
        /// </summary>
        [ColumnAttribute("week_day", Size = 1)]
        public int? week_day { get; set; }
        /// <summary>
        /// 练习开始时间 
        /// </summary>
        [ColumnAttribute("start_time")]
        public DateTime? start_time { get; set; }
        /// <summary>
        /// 练习结束时间 
        /// </summary>
        [ColumnAttribute("end_time")]
        public DateTime? end_time { get; set; }
        /// <summary>
        /// 状态（0:未开始作答，1:正在作答，2:已做完） 
        /// </summary>
        [ColumnAttribute("answer_question_status", Size = 1)]
        public int? answer_question_status { get; set; }
        /// <summary>
        /// 自判状态（0：未开始自判，1为正在自判中，2为已结束自判） 
        /// </summary>
        [ColumnAttribute("self_judgment_status", Size = 1)]
        public int? self_judgment_status { get; set; }
        /// <summary>
        /// 云端同步状态 
        /// </summary>
        [ColumnAttribute("synchronous_status", Size = 1)]
        public int synchronous_status { get; set; }
        /// <summary>
        /// 更新时间 
        /// </summary>
        [ColumnAttribute("update_time")]
        public DateTime? update_time { get; set; }
        /// <summary>
        /// 创建时间 
        /// </summary>
        [ColumnAttribute("create_time")]
        public DateTime? create_time { get; set; }

        [NotMapped]
        public string week_name { get; set; }
    }
}