using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 班级单道题作答记录分析（er_all_student_question_record）
    /// </summary>
    public class ErAllStudentQuestionRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 班级单题作答记录Id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 练习记录id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 习题封存id 
            /// </summary>
            public string question_id {  get; set; }
            /// <summary>
            /// 正确答案 
            /// </summary>
            public string right_answer {  get; set; }
            /// <summary>
            /// 总分 
            /// </summary>
            public double? score {  get; set; }
            /// <summary>
            /// 题干 
            /// </summary>
            public string content {  get; set; }
            /// <summary>
            /// 知识点id 
            /// </summary>
            public long? knowledge_id {  get; set; }
            /// <summary>
            /// 知识点名称 
            /// </summary>
            public string knowledge_name {  get; set; }
            /// <summary>
            /// 班级答题用时 
            /// </summary>
            public int? use_time {  get; set; }
            /// <summary>
            /// 班级人数 
            /// </summary>
            public int? total_count {  get; set; }
            /// <summary>
            /// 总答题人数 
            /// </summary>
            public int? answer_count {  get; set; }
            /// <summary>
            /// 答对人数 
            /// </summary>
            public int? right_count {  get; set; }
            /// <summary>
            /// 答错人数 
            /// </summary>
            public int? error_count {  get; set; }
            /// <summary>
            /// 难度系数 
            /// </summary>
            public double? degree_of_difficulty {  get; set; }
            /// <summary>
            /// 题目难度得分 
            /// </summary>
            public double? difficult_score {  get; set; }
            /// <summary>
            /// 学生平均得分 
            /// </summary>
            public double? student_avg_score {  get; set; }
            /// <summary>
            /// 班级平均用时 
            /// </summary>
            public int? avg_time {  get; set; }
            /// <summary>
            /// 答对平均耗时 
            /// </summary>
            public int? right_avg_time {  get; set; }
            /// <summary>
            /// 答错平均耗时 
            /// </summary>
            public int? error_avg_time {  get; set; }
            /// <summary>
            /// 答对平均首次反应时长 
            /// </summary>
            public int? first_right_time {  get; set; }
            /// <summary>
            /// 答错平均首次反应时长 
            /// </summary>
            public int? first_error_time {  get; set; }
            /// <summary>
            /// 正答率 
            /// </summary>
            public double? right_proportion {  get; set; }
            /// <summary>
            /// 会的学生占比 
            /// </summary>
            public double? mastery_proportion {  get; set; }
            /// <summary>
            /// 完全不会占比 
            /// </summary>
            public double? worse_proportion {  get; set; }
            /// <summary>
            /// 一知半解占比 
            /// </summary>
            public double? bad_proportion {  get; set; }
            /// <summary>
            /// 不是很熟占比 
            /// </summary>
            public double? good_proportion {  get; set; }
            /// <summary>
            /// 不太精通占比 
            /// </summary>
            public double? great_proportion {  get; set; }
            /// <summary>
            /// 精通掌握占比 
            /// </summary>
            public double? perfect_proportion {  get; set; }
            /// <summary>
            /// 区分度 
            /// </summary>
            public double? discrimination {  get; set; }
            /// <summary>
            /// 认知度 
            /// </summary>
            public double? awareness {  get; set; }
            /// <summary>
            /// 认知指数 
            /// </summary>
            public double? cognitive_index {  get; set; }
            /// <summary>
            /// 接纳度 
            /// </summary>
            public double? acceptance {  get; set; }
            /// <summary>
            /// 得分率 
            /// </summary>
            public double? scoring_average {  get; set; }
            /// <summary>
            /// 判分模式，可空.为空时，为客观题;不为空时，为主观题 (0：赋分模式 1：对错模式)' 
            /// </summary>
            public int? pattern {  get; set; }
            /// <summary>
            /// 状态（0:未开始作答，1:正在作答，2:已做完） 
            /// </summary>
            public int? status {  get; set; }
            /// <summary>
            /// 学生作答最多项/得分最多分数 
            /// </summary>
            public string max_item {  get; set; }
            /// <summary>
            /// 答案最多项个数 
            /// </summary>
            public int? max_item_count {  get; set; }
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