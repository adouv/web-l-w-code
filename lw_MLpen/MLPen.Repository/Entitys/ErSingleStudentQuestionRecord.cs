using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 学生单道题作答记录分析（er_single_student_question_record）
    /// </summary>
    [TableAttribute("er_single_student_question_record")]
    public class ErSingleStudentQuestionRecord : IEntity
    {
        /// <summary>
        /// 学生单题作答分析结果id 
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
        /// 试卷练习记录id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 习题封存id 
        /// </summary>
        [ColumnAttribute("question_id", Size = 50)]
        public string question_id { get; set; }
        /// <summary>
        /// 学生反馈结果记录id 
        /// </summary>
        [ColumnAttribute("original_student_record_id", Size = 50)]
        public string original_student_record_id { get; set; }
        /// <summary>
        /// 确定性直接反馈得分 
        /// </summary>
        [ColumnAttribute("deterministic_direct_feedback_score", Size = 4)]
        public int? deterministic_direct_feedback_score { get; set; }
        /// <summary>
        /// 确定性间接反馈得分 
        /// </summary>
        [ColumnAttribute("deterministic_indirect_feedback_score", Size = 4)]
        public int? deterministic_indirect_feedback_score { get; set; }
        /// <summary>
        /// d1 
        /// </summary>
        [ColumnAttribute("d_one_score", Size = 5, Precision = 2)]
        public double? d_one_score { get; set; }
        /// <summary>
        /// d2 
        /// </summary>
        [ColumnAttribute("d_two_score", Size = 5, Precision = 2)]
        public double? d_two_score { get; set; }
        /// <summary>
        /// d3 
        /// </summary>
        [ColumnAttribute("d_three_score", Size = 5, Precision = 2)]
        public double? d_three_score { get; set; }
        /// <summary>
        /// d4 
        /// </summary>
        [ColumnAttribute("d_four_score", Size = 5, Precision = 2)]
        public double? d_four_score { get; set; }
        /// <summary>
        /// d5 
        /// </summary>
        [ColumnAttribute("d_five_score", Size = 5, Precision = 2)]
        public double? d_five_score { get; set; }
        /// <summary>
        /// d6 
        /// </summary>
        [ColumnAttribute("d_six_score", Size = 5, Precision = 2)]
        public double? d_six_score { get; set; }
        /// <summary>
        /// d7 
        /// </summary>
        [ColumnAttribute("d_seven_score", Size = 5, Precision = 2)]
        public double? d_seven_score { get; set; }
        /// <summary>
        /// 学生答对答错首次反应时长 
        /// </summary>
        [ColumnAttribute("first_time", Size = 4)]
        public int? first_time { get; set; }
        /// <summary>
        /// 难度系数 
        /// </summary>
        [ColumnAttribute("degree_of_difficulty", Size = 5, Precision = 2)]
        public double? degree_of_difficulty { get; set; }
        /// <summary>
        /// 实力得分 
        /// </summary>
        [ColumnAttribute("strength_score", Size = 4)]
        public int? strength_score { get; set; }
        /// <summary>
        /// 相对实力值 
        /// </summary>
        [ColumnAttribute("relative_power", Size = 5, Precision = 2)]
        public double? relative_power { get; set; }
        /// <summary>
        /// 掌握程度 
        /// </summary>
        [ColumnAttribute("mastery_level", Size = 5, Precision = 2)]
        public double? mastery_level { get; set; }
        /// <summary>
        /// 掌握程度类型 
        /// </summary>
        [ColumnAttribute("master_level_type", Size = 1)]
        public int? master_level_type { get; set; }
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

        public ErSingleStudentQuestionRecord()
        {

        }

        public ErSingleStudentQuestionRecord(string id, long? student_id, string exercise_record_id, string question_id, string original_student_record_id, int? deterministic_direct_feedback_score, int? deterministic_indirect_feedback_score, double? d_one_score, double? d_two_score, double? d_three_score, double? d_four_score, double? d_five_score, double? d_six_score, double? d_seven_score, int? first_time, double? degree_of_difficulty, int? strength_score, double? mastery_level, int? master_level_type, DateTime? create_time, DateTime? update_time)
        {
            this.id = id;
            this.student_id = student_id;
            this.exercise_record_id = exercise_record_id;
            this.question_id = question_id;
            this.original_student_record_id = original_student_record_id;
            this.deterministic_direct_feedback_score = deterministic_direct_feedback_score;
            this.deterministic_indirect_feedback_score = deterministic_indirect_feedback_score;
            this.d_one_score = d_one_score;
            this.d_two_score = d_two_score;
            this.d_three_score = d_three_score;
            this.d_four_score = d_four_score;
            this.d_five_score = d_five_score;
            this.d_six_score = d_six_score;
            this.d_seven_score = d_seven_score;
            this.first_time = first_time;
            this.degree_of_difficulty = degree_of_difficulty;
            this.strength_score = strength_score;
            this.mastery_level = mastery_level;
            this.master_level_type = master_level_type;
            this.create_time = create_time;
            this.update_time = update_time;
        }
    }
}