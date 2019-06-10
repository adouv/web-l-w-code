using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 班级单道题作答记录分析（er_all_student_question_record）
    /// </summary>
    [TableAttribute("er_all_student_question_record")]
    public class ErAllStudentQuestionRecord : IEntity
    {
        /// <summary>
        /// 班级单题作答记录Id 
        /// </summary>
        [NonAutoIncrement]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 50)]
        public string id { get; set; }
        /// <summary>
        /// 练习记录id 
        /// </summary>
        [ColumnAttribute("exercise_record_id", Size = 50)]
        public string exercise_record_id { get; set; }
        /// <summary>
        /// 习题封存id 
        /// </summary>
        [ColumnAttribute("question_id", Size = 20)]
        public string question_id { get; set; }
        /// <summary>
        /// 正确答案 
        /// </summary>
        [ColumnAttribute("right_answer", Size = 50)]
        public string right_answer { get; set; }
        /// <summary>
        /// 总分 
        /// </summary>
        [ColumnAttribute("score", Size = 5, Precision = 2)]
        public double? score { get; set; }
        /// <summary>
        /// 题干 
        /// </summary>
        [ColumnAttribute("content", Size = 500)]
        public string content { get; set; }
        /// <summary>
        /// 知识点id 
        /// </summary>
        [ColumnAttribute("knowledge_id", Size = 20)]
        public long? knowledge_id { get; set; }
        /// <summary>
        /// 知识点名称 
        /// </summary>
        [ColumnAttribute("knowledge_name", Size = 100)]
        public string knowledge_name { get; set; }
        /// <summary>
        /// 班级答题用时 
        /// </summary>
        [ColumnAttribute("use_time", Size = 4)]
        public int? use_time { get; set; }
        /// <summary>
        /// 班级人数 
        /// </summary>
        [ColumnAttribute("total_count", Size = 4)]
        public int? total_count { get; set; }
        /// <summary>
        /// 总答题人数 
        /// </summary>
        [ColumnAttribute("answer_count", Size = 4)]
        public int? answer_count { get; set; }
        /// <summary>
        /// 答对人数 
        /// </summary>
        [ColumnAttribute("right_count", Size = 4)]
        public int? right_count { get; set; }
        /// <summary>
        /// 答错人数 
        /// </summary>
        [ColumnAttribute("error_count", Size = 4)]
        public int? error_count { get; set; }
        /// <summary>
        /// 难度系数 
        /// </summary>
        [ColumnAttribute("degree_of_difficulty", Size = 5, Precision = 2)]
        public double? degree_of_difficulty { get; set; }
        /// <summary>
        /// 题目难度得分 
        /// </summary>
        [ColumnAttribute("difficult_score", Size = 5, Precision = 2)]
        public double? difficult_score { get; set; }
        /// <summary>
        /// 学生平均得分 
        /// </summary>
        [ColumnAttribute("student_avg_score", Size = 5, Precision = 2)]
        public double? student_avg_score { get; set; }
        /// <summary>
        /// 班级平均用时 
        /// </summary>
        [ColumnAttribute("avg_time", Size = 4)]
        public int? avg_time { get; set; }
        /// <summary>
        /// 答对平均耗时 
        /// </summary>
        [ColumnAttribute("right_avg_time", Size = 4)]
        public int? right_avg_time { get; set; }
        /// <summary>
        /// 答错平均耗时 
        /// </summary>
        [ColumnAttribute("error_avg_time", Size = 4)]
        public int? error_avg_time { get; set; }
        /// <summary>
        /// 答对平均首次反应时长 
        /// </summary>
        [ColumnAttribute("first_right_time", Size = 4)]
        public int? first_right_time { get; set; }
        /// <summary>
        /// 答错平均首次反应时长 
        /// </summary>
        [ColumnAttribute("first_error_time", Size = 4)]
        public int? first_error_time { get; set; }
        /// <summary>
        /// 正答率 
        /// </summary>
        [ColumnAttribute("right_proportion", Size = 5, Precision = 2)]
        public double? right_proportion { get; set; }
        /// <summary>
        /// 会的学生占比 
        /// </summary>
        [ColumnAttribute("mastery_proportion", Size = 5, Precision = 2)]
        public double? mastery_proportion { get; set; }
        /// <summary>
        /// 完全不会占比 
        /// </summary>
        [ColumnAttribute("worse_proportion", Size = 5, Precision = 2)]
        public double? worse_proportion { get; set; }
        /// <summary>
        /// 一知半解占比 
        /// </summary>
        [ColumnAttribute("bad_proportion", Size = 5, Precision = 2)]
        public double? bad_proportion { get; set; }
        /// <summary>
        /// 不是很熟占比 
        /// </summary>
        [ColumnAttribute("good_proportion", Size = 5, Precision = 2)]
        public double? good_proportion { get; set; }
        /// <summary>
        /// 不太精通占比 
        /// </summary>
        [ColumnAttribute("great_proportion", Size = 5, Precision = 2)]
        public double? great_proportion { get; set; }
        /// <summary>
        /// 精通掌握占比 
        /// </summary>
        [ColumnAttribute("perfect_proportion", Size = 5, Precision = 2)]
        public double? perfect_proportion { get; set; }
        /// <summary>
        /// 区分度 
        /// </summary>
        [ColumnAttribute("discrimination", Size = 5, Precision = 2)]
        public double? discrimination { get; set; }
        /// <summary>
        /// 认知度 
        /// </summary>
        [ColumnAttribute("awareness", Size = 5, Precision = 2)]
        public double? awareness { get; set; }
        /// <summary>
        /// 认知指数 
        /// </summary>
        [ColumnAttribute("cognitive_index", Size = 5, Precision = 2)]
        public double? cognitive_index { get; set; }
        /// <summary>
        /// 接纳度 
        /// </summary>
        [ColumnAttribute("acceptance", Size = 5, Precision = 2)]
        public double? acceptance { get; set; }
        /// <summary>
        /// 得分率 
        /// </summary>
        [ColumnAttribute("scoring_average", Size = 5, Precision = 2)]
        public double? scoring_average { get; set; }
        /// <summary>
        /// 判分模式，可空.为空时，为客观题;不为空时，为主观题 (0：赋分模式 1：对错模式)' 
        /// </summary>
        [ColumnAttribute("pattern", Size = 1)]
        public int? pattern { get; set; }
        /// <summary>
        /// 状态（0:未开始作答，1:正在作答，2:已做完） 
        /// </summary>
        [ColumnAttribute("status", Size = 1)]
        public int? status { get; set; }
        /// <summary>
        /// 学生作答最多项/得分最多分数 
        /// </summary>
        [ColumnAttribute("max_item", Size = 225)]
        public string max_item { get; set; }
        /// <summary>
        /// 答案最多项个数 
        /// </summary>
        [ColumnAttribute("max_item_count", Size = 2)]
        public int? max_item_count { get; set; }
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

        public ErAllStudentQuestionRecord()
        {
        }

        public ErAllStudentQuestionRecord(string id, string exercise_record_id, string question_id, string right_answer, long? knowledge_id, string knowledge_name, double? score, string content, int? use_time, int total_count, int right_count, int error_count, double? right_proportion, double? degree_of_difficulty, double? difficult_score, double? student_avg_score, int? avg_time, int? right_avg_time, int? error_avg_time, int? first_right_time, int? first_error_time, double? mastery_proportion, double? worse_proportion, double? bad_proportion, double? good_proportion, double? great_proportion, double? perfect_proportion, double? discrimination, double? awareness, double? acceptance, int? pattern, int status, string max_item, int max_item_count, DateTime? create_time, DateTime? update_time)
        {
            this.id = id;
            this.exercise_record_id = exercise_record_id;
            this.question_id = question_id;
            this.right_answer = right_answer;
            this.knowledge_id = knowledge_id;
            this.knowledge_name = knowledge_name;
            this.score = score;
            this.content = content;
            this.use_time = use_time;
            this.total_count = total_count;
            this.right_count = right_count;
            this.error_count = error_count;
            this.right_proportion = right_proportion;
            this.degree_of_difficulty = degree_of_difficulty;
            this.difficult_score = difficult_score;
            this.student_avg_score = student_avg_score;
            this.avg_time = avg_time;
            this.right_avg_time = right_avg_time;
            this.error_avg_time = error_avg_time;
            this.first_right_time = first_right_time;
            this.first_error_time = first_error_time;
            this.mastery_proportion = mastery_proportion;
            this.worse_proportion = worse_proportion;
            this.bad_proportion = bad_proportion;
            this.good_proportion = good_proportion;
            this.great_proportion = great_proportion;
            this.perfect_proportion = perfect_proportion;
            this.discrimination = discrimination;
            this.awareness = awareness;
            this.acceptance = acceptance;
            this.pattern = pattern;
            this.status = status;
            this.max_item = max_item;
            this.max_item_count = max_item_count;
            this.create_time = create_time;
            this.update_time = update_time;
        }
    }
}