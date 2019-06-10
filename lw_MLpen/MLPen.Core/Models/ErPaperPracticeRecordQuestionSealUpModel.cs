using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Models
{
    /// <summary>
    /// 试卷练习记录试题封存表（er_paper_practice_record_question_seal_up）
    /// </summary>
    public class ErPaperPracticeRecordQuestionSealUpModel
    {
        #region Detail
        /// <summary>
        /// 详情
        /// </summary>
        public class Detail
        {
            /// <summary>
            /// id 
            /// </summary>
            public string id {  get; set; }
            /// <summary>
            /// 试卷练习记录Id 
            /// </summary>
            public string paper_practice_record_id {  get; set; }
            /// <summary>
            /// 题库平台源试题id 
            /// </summary>
            public long? source_question_id {  get; set; }
            /// <summary>
            /// 排序 
            /// </summary>
            public int? question_order {  get; set; }
            /// <summary>
            /// 试题阶数 
            /// </summary>
            public string question_step_number {  get; set; }
            /// <summary>
            /// 试题阶梯类型 
            /// </summary>
            public string question_stem_type {  get; set; }
            /// <summary>
            /// 开始答题时间 
            /// </summary>
            public DateTime? start_practice_time {  get; set; }
            /// <summary>
            /// 结束答题时间 
            /// </summary>
            public DateTime? end_practice_time {  get; set; }
            /// <summary>
            /// 作答次数 
            /// </summary>
            public int? practice_count {  get; set; }
            /// <summary>
            /// 自判次数 
            /// </summary>
            public int? self_judgment_count {  get; set; }
            /// <summary>
            /// 自判开始时间 
            /// </summary>
            public DateTime? self_judgment_start_time {  get; set; }
            /// <summary>
            /// 自判结束时间 
            /// </summary>
            public DateTime? self_judgment_end_time {  get; set; }
            /// <summary>
            /// 自判模式 
            /// </summary>
            public int? self_judgment_model {  get; set; }
            /// <summary>
            /// 自判设置分数 
            /// </summary>
            public int? self_judgment_full_score {  get; set; }
            /// <summary>
            /// 一阶题干 
            /// </summary>
            public double? first_step_stem {  get; set; }
            /// <summary>
            /// 一阶选项 
            /// </summary>
            public double? first_step_option {  get; set; }
            /// <summary>
            /// 一阶正确选项 
            /// </summary>
            public double? first_step_correct_option {  get; set; }
            /// <summary>
            /// 一阶对应试题解析 
            /// </summary>
            public double? first_step_analysis {  get; set; }
            /// <summary>
            /// 二阶题干 
            /// </summary>
            public double? second_step_stem {  get; set; }
            /// <summary>
            /// 二阶选项 
            /// </summary>
            public double? second_step_option {  get; set; }
            /// <summary>
            /// 二阶正确选项 
            /// </summary>
            public double? second_step_correct_option {  get; set; }
            /// <summary>
            /// 三阶题干 
            /// </summary>
            public double? third_step_stem {  get; set; }
            /// <summary>
            /// 三阶选项 
            /// </summary>
            public double? third_step_option {  get; set; }
            /// <summary>
            /// 三阶正确选项 
            /// </summary>
            public double? third_step_correct_option {  get; set; }
            /// <summary>
            /// 四阶题干 
            /// </summary>
            public double? forth_step_stem {  get; set; }
            /// <summary>
            /// 四阶选项 
            /// </summary>
            public double? forth_step_option {  get; set; }
            /// <summary>
            /// 四阶正确选项 
            /// </summary>
            public double? forth_step_correct_option {  get; set; }
            /// <summary>
            /// 该试题的整体解析 
            /// </summary>
            public double? question_whole_analysis {  get; set; }
            /// <summary>
            /// 云端同步状态 
            /// </summary>
            public int? synchronous_status { get; set; }
        }
        #endregion
    }
}