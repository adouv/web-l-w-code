using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 试卷练习学生信息封存表（er_paper_practice_record_student_seal_up）
    /// </summary>
    public class ErPaperPracticeRecordStudentSealUpModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 练习记录Id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 学生Id 
            /// </summary>
            public long? student_id {  get; set; }
            /// <summary>
            /// 学生姓名 
            /// </summary>
            public string student_name {  get; set; }
            /// <summary>
            /// 园区id 
            /// </summary>
            public long? garden_id {  get; set; }
            /// <summary>
            /// 年级Id 
            /// </summary>
            public long? grade_id {  get; set; }
            /// <summary>
            /// 年级名称 
            /// </summary>
            public string grade_name {  get; set; }
            /// <summary>
            /// 班级Id 
            /// </summary>
            public long? class_id {  get; set; }
            /// <summary>
            /// 班级名称 
            /// </summary>
            public string class_name {  get; set; }
            /// <summary>
            /// 学生头像 
            /// </summary>
            public string student_head_portrait {  get; set; }
            /// <summary>
            /// 学生性别 
            /// </summary>
            public bool student_sex {  get; set; }
            /// <summary>
            /// 学号 
            /// </summary>
            public string student_number {  get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
        }
        #endregion
    }
}