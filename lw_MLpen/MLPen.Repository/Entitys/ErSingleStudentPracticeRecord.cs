using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 学生整套题作答记录分析（er_single_student_practice_record）
    /// </summary>
    [TableAttribute("er_single_student_practice_record")]
    public class ErSingleStudentPracticeRecord : IEntity
    {
        /// <summary>
        /// 学生试卷作答记录分析ID 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 学生id 
        /// </summary>
        [ColumnAttribute("student_id", Size = 20)]
        public long? student_id { get; set; }
        /// <summary>
        /// 练习记录id 
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
        /// 练习卷就低原则学生掌握程度 
        /// </summary>
        [ColumnAttribute("mastery_level_low", Size = 5, Precision = 2)]
        public double? mastery_level_low { get; set; }
        /// <summary>
        /// 练习卷平均原则学生掌握程度 
        /// </summary>
        [ColumnAttribute("mastery_level_avg", Size = 5, Precision = 2)]
        public double? mastery_level_avg { get; set; }
        /// <summary>
        /// 学生整套题总分 
        /// </summary>
        [ColumnAttribute("total_score", Size = 5, Precision = 2)]
        public double? total_score { get; set; }
        /// <summary>
        /// 学生整套题平均分 
        /// </summary>
        [ColumnAttribute("avg_score", Size = 5, Precision = 2)]
        public double? avg_score { get; set; }
        /// <summary>
        /// 学生整体耗时 
        /// </summary>
        [ColumnAttribute("total_time", Size = 4)]
        public int? total_time { get; set; }
        /// <summary>
        /// 学生整套题平均耗时 
        /// </summary>
        [ColumnAttribute("avg_time", Size = 4)]
        public int? avg_time { get; set; }
        /// <summary>
        /// 答对题数 
        /// </summary>
        [ColumnAttribute("right_count", Size = 4)]
        public int? right_count { get; set; }
        /// <summary>
        /// 答错题数 
        /// </summary>
        [ColumnAttribute("error_count", Size = 4)]
        public int? error_count { get; set; }
        /// <summary>
        /// 得分率 
        /// </summary>
        [ColumnAttribute("scoring_average", Size = 5, Precision = 2)]
        public double? scoring_average { get; set; }
        /// <summary>
        /// 平均原则全会所占比例 
        /// </summary>
        [ColumnAttribute("avg_plenary", Size = 5, Precision = 2)]
        public double? avg_plenary { get; set; }
        /// <summary>
        /// 就低原则全会所占比例 
        /// </summary>
        [ColumnAttribute("low_plenary", Size = 5, Precision = 2)]
        public double? low_plenary { get; set; }
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
        /// 平均原则一知半解占比 
        /// </summary>
        [ColumnAttribute("bad_proportion_avg", Size = 5, Precision = 2)]
        public double? bad_proportion_avg { get; set; }
        /// <summary>
        /// 平均原则不是很熟占比 
        /// </summary>
        [ColumnAttribute("good_proportion_avg", Size = 5, Precision = 2)]
        public double? good_proportion_avg { get; set; }
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