using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 习题练习记录表（er_paper_practice_record）
    /// </summary>
    public class ErPaperPracticeRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class PracticeModel
        {
            /// <summary>
            /// 练习记录ID 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 试卷ID 
            /// </summary>
            public long? paper_id {  get; set; }
            /// <summary>
            /// 试卷名称 
            /// </summary>
            public string paper_name {  get; set; }
            /// <summary>
            /// 试卷类型 
            /// </summary>
            public int? paper_type {  get; set; }
            /// <summary>
            /// 所包含的试题总数 
            /// </summary>
            public int? paper_question_total_number {  get; set; }
            /// <summary>
            /// 所属园区id 
            /// </summary>
            public long? garden_id {  get; set; }
            /// <summary>
            /// 所属系统学年id 
            /// </summary>
            public long? system_academic_year_id {  get; set; }
            /// <summary>
            /// 所属系统学年 
            /// </summary>
            public int? system_academic_year {  get; set; }
            /// <summary>
            /// 所属系统学年名称 
            /// </summary>
            public string academic_name {  get; set; }
            /// <summary>
            /// 所属班级ID 
            /// </summary>
            public long? class_id {  get; set; }
            /// <summary>
            /// 所属班级名称 
            /// </summary>
            public string class_name {  get; set; }
            /// <summary>
            /// 所属年级id 
            /// </summary>
            public long? grade_id {  get; set; }
            /// <summary>
            /// 所属年级名称 
            /// </summary>
            public string grade_name {  get; set; }
            /// <summary>
            /// 所属教师id 
            /// </summary>
            public int? teacher_id {  get; set; }
            /// <summary>
            /// 所属教师名称 
            /// </summary>
            public string teacher_name {  get; set; }
            /// <summary>
            /// 所属学科编码 
            /// </summary>
            public string subject_code {  get; set; }
            /// <summary>
            /// 所属课节 
            /// </summary>
            public int? period {  get; set; }
            /// <summary>
            /// 所属周天 
            /// </summary>
            public int? week_day {  get; set; }
            /// <summary>
            /// 练习开始时间 
            /// </summary>
            public DateTime? start_time {  get; set; }
            /// <summary>
            /// 练习结束时间 
            /// </summary>
            public DateTime? end_time {  get; set; }
            /// <summary>
            /// 状态（0:未开始作答，1:正在作答，2:已做完） 
            /// </summary>
            public int? answer_question_status {  get; set; }
            /// <summary>
            /// 自判状态（0：未开始自判，1为正在自判中，2为已结束自判） 
            /// </summary>
            public int? self_judgment_status {  get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
            /// <summary>
            /// 更新时间 
            /// </summary>
            public DateTime? update_time {  get; set; }
            /// <summary>
            /// 创建时间 
            /// </summary>
            public DateTime? create_time {  get; set; }
        }
        #endregion
    }
}