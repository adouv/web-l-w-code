using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 试卷练习学生信息封存表（er_paper_practice_record_student_seal_up）
    /// </summary>
    [TableAttribute("er_paper_practice_record_student_seal_up")]
    public class ErPaperPracticeRecordStudentSealUp : IEntity
    {
        /// <summary>
        /// id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 练习记录Id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 学生Id 
        /// </summary>
        [ColumnAttribute("student_id", Size = 50)]
        public long? student_id { get; set; }
        /// <summary>
        /// 学生姓名 
        /// </summary>
        [ColumnAttribute("student_name", Size = 50)]
        public string student_name { get; set; }
        /// <summary>
        /// 园区id 
        /// </summary>
        [ColumnAttribute("garden_id", Size = 50)]
        public long? garden_id { get; set; }
        /// <summary>
        /// 年级Id 
        /// </summary>
        [ColumnAttribute("grade_id", Size = 50)]
        public long? grade_id { get; set; }
        /// <summary>
        /// 年级名称 
        /// </summary>
        [ColumnAttribute("grade_name", Size = 50)]
        public string grade_name { get; set; }
        /// <summary>
        /// 班级Id 
        /// </summary>
        [ColumnAttribute("class_id", Size = 50)]
        public long? class_id { get; set; }
        /// <summary>
        /// 班级名称 
        /// </summary>
        [ColumnAttribute("class_name", Size = 50)]
        public string class_name { get; set; }
        /// <summary>
        /// 学生头像 
        /// </summary>
        [ColumnAttribute("student_head_portrait", Size = 255)]
        public string student_head_portrait { get; set; }
        /// <summary>
        /// 学生性别 
        /// </summary>
        [ColumnAttribute("student_sex")]
        public bool student_sex { get; set; }
        /// <summary>
        /// 学号 
        /// </summary>
        [ColumnAttribute("student_number", Size = 10)]
        public string student_number { get; set; }
        /// <summary>
        /// 云端同步状态 
        /// </summary>
        [ColumnAttribute("synchronous_status", Size = 1)]
        public int synchronous_status { get; set; }
    }
}