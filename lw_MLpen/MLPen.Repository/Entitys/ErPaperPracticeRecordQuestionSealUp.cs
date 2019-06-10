using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 试卷练习记录试题封存表（er_paper_practice_record_question_seal_up）
    /// </summary>
    [TableAttribute("er_paper_practice_record_question_seal_up")]
    public class ErPaperPracticeRecordQuestionSealUp : IEntity
    {
        /// <summary>
        /// id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 试卷练习记录Id 
        /// </summary>
        [ColumnAttribute("paper_practice_record_id", Size = 50)]
        public string paper_practice_record_id { get; set; }
        /// <summary>
        /// 题库平台源试题id 
        /// </summary>
        [ColumnAttribute("source_question_id", Size = 20)]
        public long? source_question_id { get; set; }
        /// <summary>
        /// 排序 
        /// </summary>
        [ColumnAttribute("question_order", Size = 5)]
        public int? question_order { get; set; }
        /// <summary>
        /// 试题阶数 
        /// </summary>
        [ColumnAttribute("question_step_number", Size = 25)]
        public string question_step_number { get; set; }
        /// <summary>
        /// 试题阶梯类型 
        /// </summary>
        [ColumnAttribute("question_stem_type", Size = 25)]
        public string question_stem_type { get; set; }
        /// <summary>
        /// 开始答题时间 
        /// </summary>
        [ColumnAttribute("start_practice_time")]
        public DateTime? start_practice_time { get; set; }
        /// <summary>
        /// 结束答题时间 
        /// </summary>
        [ColumnAttribute("end_practice_time")]
        public DateTime? end_practice_time { get; set; }
        /// <summary>
        /// 作答次数 
        /// </summary>
        [ColumnAttribute("practice_count", Size = 5)]
        public int? practice_count { get; set; }
        /// <summary>
        /// 自判次数 
        /// </summary>
        [ColumnAttribute("self_judgment_count", Size = 5)]
        public int? self_judgment_count { get; set; }
        /// <summary>
        /// 自判开始时间 
        /// </summary>
        [ColumnAttribute("self_judgment_start_time")]
        public DateTime? self_judgment_start_time { get; set; }
        /// <summary>
        /// 自判结束时间 
        /// </summary>
        [ColumnAttribute("self_judgment_end_time")]
        public DateTime? self_judgment_end_time { get; set; }
        /// <summary>
        /// 自判模式 
        /// </summary>
        [ColumnAttribute("self_judgment_model", Size = 1)]
        public int? self_judgment_model { get; set; }
        /// <summary>
        /// 自判设置分数 
        /// </summary>
        [ColumnAttribute("self_judgment_full_score", Size = 3)]
        public int? self_judgment_full_score { get; set; }
        /// <summary>
        /// 一阶题干 
        /// </summary>
        [ColumnAttribute("first_step_stem")]
        public string first_step_stem { get; set; }
        /// <summary>
        /// 一阶选项 
        /// </summary>
        [ColumnAttribute("first_step_option")]
        public string first_step_option { get; set; }
        /// <summary>
        /// 一阶正确选项 
        /// </summary>
        [ColumnAttribute("first_step_correct_option")]
        public string first_step_correct_option { get; set; }
        /// <summary>
        /// 一阶对应试题解析 
        /// </summary>
        [ColumnAttribute("first_step_analysis")]
        public string first_step_analysis { get; set; }
        /// <summary>
        /// 二阶题干 
        /// </summary>
        [ColumnAttribute("second_step_stem")]
        public string second_step_stem { get; set; }
        /// <summary>
        /// 二阶选项 
        /// </summary>
        [ColumnAttribute("second_step_option")]
        public string second_step_option { get; set; }
        /// <summary>
        /// 二阶正确选项 
        /// </summary>
        [ColumnAttribute("second_step_correct_option")]
        public string second_step_correct_option { get; set; }
        /// <summary>
        /// 三阶题干 
        /// </summary>
        [ColumnAttribute("third_step_stem")]
        public string third_step_stem { get; set; }
        /// <summary>
        /// 三阶选项 
        /// </summary>
        [ColumnAttribute("third_step_option")]
        public string third_step_option { get; set; }
        /// <summary>
        /// 三阶正确选项 
        /// </summary>
        [ColumnAttribute("third_step_correct_option")]
        public string third_step_correct_option { get; set; }
        /// <summary>
        /// 四阶题干 
        /// </summary>
        [ColumnAttribute("forth_step_stem")]
        public string forth_step_stem { get; set; }
        /// <summary>
        /// 四阶选项 
        /// </summary>
        [ColumnAttribute("forth_step_option")]
        public string forth_step_option { get; set; }
        /// <summary>
        /// 四阶正确选项 
        /// </summary>
        [ColumnAttribute("forth_step_correct_option")]
        public string forth_step_correct_option { get; set; }
        /// <summary>
        /// 该试题的整体解析 
        /// </summary>
        [ColumnAttribute("question_whole_analysis")]
        public string question_whole_analysis { get; set; }
        /// <summary>
        /// 云端同步状态 
        /// </summary>
        [ColumnAttribute("synchronous_status", Size = 1)]
        public int synchronous_status { get; set; }
    }
}