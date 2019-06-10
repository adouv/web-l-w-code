using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 学生单道提作答记录表(原始数据)（er_original_record）
    /// </summary>
    [TableAttribute("er_original_record")]
    public class ErOriginalRecord : IEntity
    {
        /// <summary>
        /// 学生单道题作答记录id 
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
        /// 习题封存id 
        /// </summary>
        [ColumnAttribute("question_id", Size = 50)]
        public string question_id { get; set; }
        /// <summary>
        /// 练习卷id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 20)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 一阶反馈最终答案 
        /// </summary>
        [ColumnAttribute("answer", Size = 50)]
        public string answer { get; set; }
        /// <summary>
        /// 一阶答案是否正确 
        /// </summary>
        [ColumnAttribute("is_right", Size = 1)]
        public Boolean is_right { get; set; }
        /// <summary>
        /// 学生得分 
        /// </summary>
        [ColumnAttribute("student_score", Size = 5, Precision = 2)]
        public double? student_score { get; set; }
        /// <summary>
        /// 二次反馈最终答案 
        /// </summary>
        [ColumnAttribute("first_feed_back", Size = 20)]
        public string first_feed_back { get; set; }
        /// <summary>
        /// 三次反馈最终答案 
        /// </summary>
        [ColumnAttribute("second_feed_back", Size = 20)]
        public string second_feed_back { get; set; }
        /// <summary>
        /// 四次反馈最终答案 
        /// </summary>
        [ColumnAttribute("third_feed_back", Size = 20)]
        public string third_feed_back { get; set; }
        /// <summary>
        /// 学生单题答案总耗时 
        /// </summary>
        [ColumnAttribute("use_time", Size = 4)]
        public int? use_time { get; set; }
        /// <summary>
        /// 首次操作用时 
        /// </summary>
        [ColumnAttribute("first_operation_time", Size = 4)]
        public int? first_operation_time { get; set; }
        /// <summary>
        /// 首次提交用时 
        /// </summary>
        [ColumnAttribute("first_submit_time", Size = 4)]
        public int? first_submit_time { get; set; }
        /// <summary>
        /// 学生一阶所有答案集合（，分割） 
        /// </summary>
        [ColumnAttribute("all_answer", Size = 255)]
        public string all_answer { get; set; }
        /// <summary>
        /// 对应提交时间（，分割） 
        /// </summary>
        [ColumnAttribute("all_answer_time", Size = 255)]
        public string all_answer_time { get; set; }
        /// <summary>
        /// 所有阶梯试题答题总按钮次数 
        /// </summary>
        [ColumnAttribute("button_count", Size = 4)]
        public int? button_count { get; set; }
        /// <summary>
        /// 所有阶梯试题答题书写次数 
        /// </summary>
        [ColumnAttribute("write_count", Size = 4)]
        public int? write_count { get; set; }
        /// <summary>
        /// 属于几阶认知 
        /// </summary>
        [ColumnAttribute("cognitive", Size = 50)]
        public string cognitive { get; set; }
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