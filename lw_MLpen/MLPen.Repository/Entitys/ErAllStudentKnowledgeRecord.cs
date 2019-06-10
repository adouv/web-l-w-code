using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 班级知识点作答分析结果（er_all_student_knowledge_record）
    /// </summary>
    [TableAttribute("er_all_student_knowledge_record")]
    public class ErAllStudentKnowledgeRecord : IEntity
    {
        /// <summary>
        /// 班级知识点作答分析结果id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 练习卷记录id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 知识点id 
        /// </summary>
        [ColumnAttribute("knowledge_id", Size = 32)]
        public long? knowledge_id { get; set; }
        /// <summary>
        /// 知识点名称 
        /// </summary>
        [ColumnAttribute("knowledge_name", Size = 50)]
        public string knowledge_name { get; set; }
        /// <summary>
        /// 练习卷id 
        /// </summary>
        [ColumnAttribute("practice_paper_id", Size = 20)]
        public long? practice_paper_id { get; set; }
        /// <summary>
        /// 练习卷名称 
        /// </summary>
        [ColumnAttribute("practice_paper_name", Size = 50)]
        public string practice_paper_name { get; set; }
        /// <summary>
        /// 知识点认知度 
        /// </summary>
        [ColumnAttribute("knowledge_awareness", Size = 5, Precision = 2)]
        public double? knowledge_awareness { get; set; }
        /// <summary>
        /// 知识点认知指数 
        /// </summary>
        [ColumnAttribute("knowledge_cognitive_index", Size = 5, Precision = 2)]
        public double? knowledge_cognitive_index { get; set; }
        /// <summary>
        /// 知识点接纳度 
        /// </summary>
        [ColumnAttribute("knowledge_acceptance", Size = 5, Precision = 2)]
        public double? knowledge_acceptance { get; set; }
        /// <summary>
        /// 完全不会占比 
        /// </summary>
        [ColumnAttribute("worse_proportion", Size = 5, Precision = 2)]
        public double? worse_proportion { get; set; }
        /// <summary>
        /// 一知半解占比 
        /// </summary>
        [ColumnAttribute("bad_proportion", Size = 5, Precision = 2)]
        public double? bad_proportion { get; set; }
        /// <summary>
        /// 不是很熟占比 
        /// </summary>
        [ColumnAttribute("good_proportion", Size = 5, Precision = 2)]
        public double? good_proportion { get; set; }
        /// <summary>
        /// 不太精通占比 
        /// </summary>
        [ColumnAttribute("great_proportion", Size = 5, Precision = 2)]
        public double? great_proportion { get; set; }
        /// <summary>
        /// 精通掌握占比 
        /// </summary>
        [ColumnAttribute("perfect_proportion", Size = 5, Precision = 2)]
        public double? perfect_proportion { get; set; }
        /// <summary>
        /// 知识点区分度 
        /// </summary>
        [ColumnAttribute("knowledge_discrimination", Size = 5, Precision = 2)]
        public double? knowledge_discrimination { get; set; }
        /// <summary>
        /// 知识点难度系数 
        /// </summary>
        [ColumnAttribute("knowledge_degree_of_difficulty", Size = 5, Precision = 2)]
        public double? knowledge_degree_of_difficulty { get; set; }
        /// <summary>
        /// 知识点得分率 
        /// </summary>
        [ColumnAttribute("knowledge_scoring_average", Size = 5, Precision = 2)]
        public double? knowledge_scoring_average { get; set; }

        /// <summary>
        /// 总分 
        /// </summary>
        [ColumnAttribute("score", Size = 5, Precision = 2)]
        public double? score { get; set; }
        /// <summary>
        /// 学生平均得分 
        /// </summary>
        [ColumnAttribute("student_avg_score", Size = 5, Precision = 2)]
        public double? student_avg_score { get; set; }
        /// <summary>
        /// 班级答题用时 
        /// </summary>
        [ColumnAttribute("use_time", Size = 4)]
        public int? use_time { get; set; }
        /// <summary>
        /// 班级人数 
        /// </summary>
        [ColumnAttribute("total_count", Size = 4)]
        public int? total_count { get; set; }
        /// <summary>
        /// 总答题人数 
        /// </summary>
        [ColumnAttribute("answer_count", Size = 4)]
        public int? answer_count { get; set; }
        /// <summary>
        /// 答对人数 
        /// </summary>
        [ColumnAttribute("right_count", Size = 4)]
        public int? right_count { get; set; }
        /// <summary>
        /// 答错人数 
        /// </summary>
        [ColumnAttribute("error_count", Size = 4)]
        public int? error_count { get; set; }
        /// <summary>
        /// 难度系数 
        /// </summary>
        [ColumnAttribute("degree_of_difficulty", Size = 5, Precision = 2)]
        public double? degree_of_difficulty { get; set; }
        /// <summary>
        /// 题目难度得分 
        /// </summary>
        [ColumnAttribute("difficult_score", Size = 5, Precision = 2)]
        public double? difficult_score { get; set; }
        /// <summary>
        /// 班级平均用时 
        /// </summary>
        [ColumnAttribute("avg_time", Size = 4)]
        public int? avg_time { get; set; }

        /// <summary>
        /// 区分度 
        /// </summary>
        [ColumnAttribute("discrimination", Size = 5, Precision = 2)]
        public double? discrimination { get; set; }
        /// <summary>
        /// 认知度 
        /// </summary>
        [ColumnAttribute("awareness", Size = 5, Precision = 2)]
        public double? awareness { get; set; }
        /// <summary>
        /// 认知指数 
        /// </summary>
        [ColumnAttribute("cognitive_index", Size = 5, Precision = 2)]
        public double? cognitive_index { get; set; }
        /// <summary>
        /// 接纳度 
        /// </summary>
        [ColumnAttribute("acceptance", Size = 5, Precision = 2)]
        public double? acceptance { get; set; }
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
        /// <summary>
        /// 更新时间 
        /// </summary>
        [ColumnAttribute("update_time")]
        public DateTime? update_time { get; set; }
    }
}