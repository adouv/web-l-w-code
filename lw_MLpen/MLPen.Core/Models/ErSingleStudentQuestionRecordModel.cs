using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 学生单道题作答记录分析（er_single_student_question_record）
    /// </summary>
    public class ErSingleStudentQuestionRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 学生单题作答分析结果id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 学生id 
            /// </summary>
            public long? student_id {  get; set; }
            /// <summary>
            /// 试卷练习记录id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 习题封存id 
            /// </summary>
            public string question_id {  get; set; }
            /// <summary>
            /// 学生反馈结果记录id 
            /// </summary>
            public string original_student_record_id {  get; set; }
            /// <summary>
            /// 确定性直接反馈得分 
            /// </summary>
            public int? deterministic_direct_feedback_score {  get; set; }
            /// <summary>
            /// 确定性间接反馈得分 
            /// </summary>
            public int? deterministic_indirect_feedback_score {  get; set; }
            /// <summary>
            /// d1 
            /// </summary>
            public double? d_one_score {  get; set; }
            /// <summary>
            /// d2 
            /// </summary>
            public double? d_two_score {  get; set; }
            /// <summary>
            /// d3 
            /// </summary>
            public double? d_three_score {  get; set; }
            /// <summary>
            /// d4 
            /// </summary>
            public double? d_four_score {  get; set; }
            /// <summary>
            /// d5 
            /// </summary>
            public double? d_five_score {  get; set; }
            /// <summary>
            /// d6 
            /// </summary>
            public double? d_six_score {  get; set; }
            /// <summary>
            /// d7 
            /// </summary>
            public double? d_seven_score {  get; set; }
            /// <summary>
            /// 学生答对答错首次反应时长 
            /// </summary>
            public int? first_time {  get; set; }
            /// <summary>
            /// 难度系数 
            /// </summary>
            public double? degree_of_difficulty {  get; set; }
            /// <summary>
            /// 实力得分 
            /// </summary>
            public int? strength_score {  get; set; }
            /// <summary>
            /// 相对实力值 
            /// </summary>
            public double? relative_power {  get; set; }
            /// <summary>
            /// 掌握程度 
            /// </summary>
            public double? mastery_level {  get; set; }
            /// <summary>
            /// 掌握程度类型 
            /// </summary>
            public int? master_level_type {  get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
            /// <summary>
            /// 创建时间 
            /// </summary>
            public DateTime? create_time {  get; set; }
            /// <summary>
            /// 更新时间 
            /// </summary>
            public DateTime? update_time {  get; set; }
        }
        #endregion
    }
}