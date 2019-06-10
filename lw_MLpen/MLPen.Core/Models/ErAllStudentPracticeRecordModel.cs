using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 班级试卷作答记录分析（er_all_student_practice_record）
    /// </summary>
    public class ErAllStudentPracticeRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 班级试卷作答分析结果id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 练习卷记录id 
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
            /// 整套题难度系数 
            /// </summary>
            public double? degree_of_difficulty {  get; set; }
            /// <summary>
            /// 整套题区分度 
            /// </summary>
            public double? discrimination {  get; set; }
            /// <summary>
            /// 班级平均分 
            /// </summary>
            public double? avg_score {  get; set; }
            /// <summary>
            /// 就低原则全会所占比例 
            /// </summary>
            public double? low_plenary {  get; set; }
            /// <summary>
            /// 平均原则全会所占比例 
            /// </summary>
            public double? avg_plenary {  get; set; }
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
            /// 平均原则不是很熟占比 
            /// </summary>
            public double? good_proportion_avg {  get; set; }
            /// <summary>
            /// 平均原则一知半解占比 
            /// </summary>
            public double? bad_proportion_avg {  get; set; }
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