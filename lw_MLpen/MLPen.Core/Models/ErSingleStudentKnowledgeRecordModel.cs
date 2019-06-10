using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 单人知识点记录（er_single_student_knowledge_record）
    /// </summary>
    public class ErSingleStudentKnowledgeRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 单人知识点记录id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 学生id 
            /// </summary>
            public long? student_id {  get; set; }
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
            /// 相对实力值 
            /// </summary>
            public double? relative_power {  get; set; }
            /// <summary>
            /// 知识点下平均分
            /// </summary>
            public double? avg_score { get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
            /// <summary>
            /// 练习创建时间 
            /// </summary>
            public DateTime? create_time {  get; set; }
            /// <summary>
            /// 练习更新时间 
            /// </summary>
            public DateTime? update_time {  get; set; }
        }
        #endregion
    }
}