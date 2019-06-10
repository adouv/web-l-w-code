using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 班级试卷作答记录分析（er_all_student_practice_record）
    /// </summary>
    [TableAttribute("er_all_student_practice_record")]
    public class ErAllStudentPracticeRecord : IEntity
    {
        /// <summary>
        /// 班级试卷作答分析结果id 
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
        /// 整套题难度系数 
        /// </summary>
        [ColumnAttribute("degree_of_difficulty", Size = 5, Precision = 2)]
        public double? degree_of_difficulty { get; set; }
        /// <summary>
        /// 整套题区分度 
        /// </summary>
        [ColumnAttribute("discrimination", Size = 5, Precision = 2)]
        public double? discrimination { get; set; }
        /// <summary>
        /// 班级平均分 
        /// </summary>
        [ColumnAttribute("avg_score", Size = 5, Precision = 2)]
        public double? avg_score { get; set; }
        /// <summary>
        /// 就低原则全会所占比例 
        /// </summary>
        [ColumnAttribute("low_plenary", Size = 5, Precision = 2)]
        public double? low_plenary { get; set; }
        /// <summary>
        /// 平均原则全会所占比例 
        /// </summary>
        [ColumnAttribute("avg_plenary", Size = 5, Precision = 2)]
        public double? avg_plenary { get; set; }
        /// <summary>
        /// 就低原则完全不会占比 
        /// </summary>
        [ColumnAttribute("worse_proportion_low", Size = 5, Precision = 2)]
        public double? worse_proportion_low { get; set; }
        /// <summary>
        /// 就低原则一知半解占比 
        /// </summary>
        [ColumnAttribute("bad_proportion_low", Size = 5, Precision = 2)]
        public double? bad_proportion_low { get; set; }
        /// <summary>
        /// 就低原则不是很熟占比 
        /// </summary>
        [ColumnAttribute("good_proportion_low", Size = 5, Precision = 2)]
        public double? good_proportion_low { get; set; }
        /// <summary>
        /// 就低原则不太精通占比 
        /// </summary>
        [ColumnAttribute("great_proportion_low", Size = 5, Precision = 2)]
        public double? great_proportion_low { get; set; }
        /// <summary>
        /// 就低原则精通掌握占比 
        /// </summary>
        [ColumnAttribute("perfect_proportion_low", Size = 5, Precision = 2)]
        public double? perfect_proportion_low { get; set; }
        /// <summary>
        /// 平均原则完全不会占比 
        /// </summary>
        [ColumnAttribute("worse_proportion_avg", Size = 5, Precision = 2)]
        public double? worse_proportion_avg { get; set; }
        /// <summary>
        /// 平均原则不是很熟占比 
        /// </summary>
        [ColumnAttribute("good_proportion_avg", Size = 5, Precision = 2)]
        public double? good_proportion_avg { get; set; }
        /// <summary>
        /// 平均原则一知半解占比 
        /// </summary>
        [ColumnAttribute("bad_proportion_avg", Size = 5, Precision = 2)]
        public double? bad_proportion_avg { get; set; }
        /// <summary>
        /// 平均原则不太精通占比 
        /// </summary>
        [ColumnAttribute("great_proportion_avg", Size = 5, Precision = 2)]
        public double? great_proportion_avg { get; set; }
        /// <summary>
        /// 平均原则精通掌握占比 
        /// </summary>
        [ColumnAttribute("perfect_proportion_avg", Size = 5, Precision = 2)]
        public double? perfect_proportion_avg { get; set; }
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