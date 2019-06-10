using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 学生整套题作答记录分析（er_single_student_practice_record）
    /// </summary>
    public class ErSingleStudentPracticeRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 学生试卷作答记录分析ID 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 学生id 
            /// </summary>
            public long? student_id {  get; set; }
            /// <summary>
            /// 练习记录id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 练习卷id 
            /// </summary>
            public long? practice_paper_id {  get; set; }
            /// <summary>
            /// 练习卷名称 
            /// </summary>
            public string practice_paper_name {  get; set; }
            /// <summary>
            /// 练习卷就低原则学生掌握程度 
            /// </summary>
            public double? mastery_level_low {  get; set; }
            /// <summary>
            /// 练习卷平均原则学生掌握程度 
            /// </summary>
            public double? mastery_level_avg {  get; set; }
            /// <summary>
            /// 学生整套题总分 
            /// </summary>
            public double? total_score {  get; set; }
            /// <summary>
            /// 学生整套题平均分 
            /// </summary>
            public double? avg_score {  get; set; }
            /// <summary>
            /// 学生整体耗时 
            /// </summary>
            public int? total_time {  get; set; }
            /// <summary>
            /// 学生整套题平均耗时 
            /// </summary>
            public int? avg_time {  get; set; }
            /// <summary>
            /// 答对题数 
            /// </summary>
            public int? right_count {  get; set; }
            /// <summary>
            /// 答错题数 
            /// </summary>
            public int? error_count {  get; set; }
            /// <summary>
            /// 得分率 
            /// </summary>
            public double? scoring_average {  get; set; }
            /// <summary>
            /// 平均原则全会所占比例 
            /// </summary>
            public double? avg_plenary {  get; set; }
            /// <summary>
            /// 就低原则全会所占比例 
            /// </summary>
            public double? low_plenary {  get; set; }
            /// <summary>
            /// 就低原则完全不会占比 
            /// </summary>
            public double? worse_proportion_low {  get; set; }
            /// <summary>
            /// 就低原则一知半解占比 
            /// </summary>
            public double? bad_proportion_low {  get; set; }
            /// <summary>
            /// 就低原则不是很熟占比 
            /// </summary>
            public double? good_proportion_low {  get; set; }
            /// <summary>
            /// 就低原则不太精通占比 
            /// </summary>
            public double? great_proportion_low {  get; set; }
            /// <summary>
            /// 就低原则精通掌握占比 
            /// </summary>
            public double? perfect_proportion_low {  get; set; }
            /// <summary>
            /// 平均原则完全不会占比 
            /// </summary>
            public double? worse_proportion_avg {  get; set; }
            /// <summary>
            /// 平均原则一知半解占比 
            /// </summary>
            public double? bad_proportion_avg {  get; set; }
            /// <summary>
            /// 平均原则不是很熟占比 
            /// </summary>
            public double? good_proportion_avg {  get; set; }
            /// <summary>
            /// 平均原则不太精通占比 
            /// </summary>
            public double? great_proportion_avg {  get; set; }
            /// <summary>
            /// 平均原则精通掌握占比 
            /// </summary>
            public double? perfect_proportion_avg {  get; set; }
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