using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 单人知识点记录（er_single_student_knowledge_record）
    /// </summary>
    [TableAttribute("er_single_student_knowledge_record")]
    public class ErSingleStudentKnowledgeRecord : IEntity
    {
        /// <summary>
        /// 单人知识点记录id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 学生id 
        /// </summary>
        [ColumnAttribute("student_id", Size = 20)]
        public long student_id { get; set; }
        /// <summary>
        /// 练习卷记录id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 知识点id 
        /// </summary>
        [ColumnAttribute("knowledge_id", Size = 20)]
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
        /// 相对实力值 
        /// </summary>
        [ColumnAttribute("relative_power", Size = 5, Precision = 2)]
        public double? relative_power { get; set; }
        /// <summary>
        /// 知识点下平均分
        /// </summary>
        [ColumnAttribute("avg_score", Size = 5, Precision = 2)]
        public double? avg_score { get; set; }
        /// <summary>
        /// 云端同步状态 
        /// </summary>
        [ColumnAttribute("synchronous_status", Size = 1)]
        public int synchronous_status { get; set; }
        /// <summary>
        /// 练习创建时间 
        /// </summary>
        [ColumnAttribute("create_time")]
        public DateTime? create_time { get; set; }
        /// <summary>
        /// 练习更新时间 
        /// </summary>
        [ColumnAttribute("update_time")]
        public DateTime? update_time { get; set; }
    }
}