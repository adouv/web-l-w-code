using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 班级知识点作答分析结果（er_all_student_knowledge_record）
    /// </summary>
    public class ErAllStudentKnowledgeRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 班级知识点作答分析结果id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 练习卷记录id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 知识点id 
            /// </summary>
            public long? knowledge_id {  get; set; }
            /// <summary>
            /// 知识点名称 
            /// </summary>
            public string knowledge_name {  get; set; }
            /// <summary>
            /// 练习卷id 
            /// </summary>
            public long? practice_paper_id {  get; set; }
            /// <summary>
            /// 练习卷名称 
            /// </summary>
            public string practice_paper_name {  get; set; }
            /// <summary>
            /// 知识点认知度 
            /// </summary>
            public double? knowledge_awareness {  get; set; }
            /// <summary>
            /// 知识点认知指数 
            /// </summary>
            public double? knowledge_cognitive_index {  get; set; }
            /// <summary>
            /// 知识点接纳度 
            /// </summary>
            public double? knowledge_acceptance {  get; set; }
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
            /// 知识点区分度 
            /// </summary>
            public double? knowledge_discrimination {  get; set; }
            /// <summary>
            /// 知识点难度系数 
            /// </summary>
            public double? knowledge_degree_of_difficulty {  get; set; }
            /// <summary>
            /// 知识点得分率 
            /// </summary>
            public double? knowledge_scoring_average {  get; set; }

            /// <summary>
            /// 总分 
            /// </summary>
            public double? score { get; set; }
            /// <summary>
            /// 学生平均得分 
            /// </summary>
            public double? student_avg_score { get; set; }
            /// <summary>
            /// 班级答题用时 
            /// </summary>
            public int? use_time { get; set; }
            /// <summary>
            /// 班级人数 
            /// </summary>
            public int? total_count { get; set; }
            /// <summary>
            /// 总答题人数 
            /// </summary>
            public int? answer_count { get; set; }
            /// <summary>
            /// 答对人数 
            /// </summary>
            public int? right_count { get; set; }
            /// <summary>
            /// 答错人数 
            /// </summary>
            public int? error_count { get; set; }
            /// <summary>
            /// 难度系数 
            /// </summary>
            public double? degree_of_difficulty { get; set; }
            /// <summary>
            /// 题目难度得分 
            /// </summary>
            public double? difficult_score { get; set; }
            /// <summary>
            /// 班级平均用时 
            /// </summary>
            public int? avg_time { get; set; }

            /// <summary>
            /// 区分度 
            /// </summary>
            public double? discrimination { get; set; }
            /// <summary>
            /// 认知度 
            /// </summary>
            public double? awareness { get; set; }
            /// <summary>
            /// 认知指数 
            /// </summary>
            public double? cognitive_index { get; set; }
            /// <summary>
            /// 接纳度 
            /// </summary>
            public double? acceptance { get; set; }

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