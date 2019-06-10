using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 学生单道提作答记录表(原始数据)（er_original_record）
    /// </summary>
    public class ErOriginalRecordModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// 学生单道题作答记录id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 学生id 
            /// </summary>
            public long? student_id {  get; set; }
            /// <summary>
            /// 习题封存id 
            /// </summary>
            public string question_id {  get; set; }
            /// <summary>
            /// 练习卷id 
            /// </summary>
            public string exercise_record_id {  get; set; }
            /// <summary>
            /// 一阶反馈最终答案 
            /// </summary>
            public string answer {  get; set; }
            /// <summary>
            /// 一阶答案是否正确 
            /// </summary>
            public byte? is_right {  get; set; }
            /// <summary>
            /// 学生得分 
            /// </summary>
            public double? student_score {  get; set; }
            /// <summary>
            /// 二次反馈最终答案 
            /// </summary>
            public string first_feed_back {  get; set; }
            /// <summary>
            /// 三次反馈最终答案 
            /// </summary>
            public string second_feed_bac {  get; set; }
            /// <summary>
            /// 四次反馈最终答案 
            /// </summary>
            public string third_feed_back {  get; set; }
            /// <summary>
            /// 学生单题答案总耗时 
            /// </summary>
            public int? use_time {  get; set; }
            /// <summary>
            /// 首次操作用时 
            /// </summary>
            public int? first_operation_time {  get; set; }
            /// <summary>
            /// 首次提交用时 
            /// </summary>
            public int? first_submit_time {  get; set; }
            /// <summary>
            /// 学生一阶所有答案集合（，分割） 
            /// </summary>
            public string all_answer {  get; set; }
            /// <summary>
            /// 对应提交时间（，分割） 
            /// </summary>
            public string all_answer_time {  get; set; }
            /// <summary>
            /// 所有阶梯试题答题总按钮次数 
            /// </summary>
            public int? button_count {  get; set; }
            /// <summary>
            /// 所有阶梯试题答题书写次数 
            /// </summary>
            public int? write_count {  get; set; }
            /// <summary>
            /// 属于几阶认知 
            /// </summary>
            public string cognitive {  get; set; }
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