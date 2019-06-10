using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 习题
    /// </summary>
    public class QuestionPractice
    {
        /// <summary>
        /// 试题ID
        /// </summary>
        public long id { get; set; }
        /// <summary>
        /// 练习卷ID
        /// </summary>
        public long? practicePaperId { get; set; }
        /// <summary>
        /// 园区Id
        /// </summary>
        public long? gardenId { get; set; }
        /// <summary>
        /// 组卷顺序
        /// </summary>
        public int? paperOrder { get; set; }
        /// <summary>
        /// 阶梯类型
        /// </summary>
        public string stepType { get; set; }
        /// <summary>
        /// 试题设计属性ID
        /// </summary>
        public long? designId { get; set; }
        /// <summary>
        /// 试题设计属性名称
        /// </summary>
        public string designName { get; set; }
        /// <summary>
        /// 试题阶段属性ID
        /// </summary>
        public int? questionPropertiesId { get; set; }
        /// <summary>
        /// 试题阶段属性名称
        /// </summary>
        public string questionPropertiesName { get; set; }
        /// <summary>
        /// 试题Id
        /// </summary>
        public int questionId { get; set; }
        /// <summary>
        /// 题型Code
        /// </summary>
        public long? typeCode { get; set; }
        /// <summary>
        /// 学科Code
        /// </summary>
        public string subjectCode { get; set; }
        /// <summary>
        /// 年级Code
        /// </summary>
        public string gradeCode { get; set; }
        /// <summary>
        /// 试题难度等级
        /// </summary>
        public int? level { get; set; }
        /// <summary>
        /// 试题状态（0：正常，1：冻结，2：删除）
        /// </summary>
        public int? status { get; set; }
        /// <summary>
        /// 试题来源（0：上课优，1：校本题库，2：本地导入）
        /// </summary>
        public int? source { get; set; }
        /// <summary>
        /// 来源Id
        /// </summary>
        public string sourceId { get; set; }
        /// <summary>
        /// 创建人Id
        /// </summary>
        public int? creatorId { get; set; }
        /// <summary>
        /// 试题内容
        /// </summary>
        public QuestionContent questionContent { get; set; }
        /// <summary>
        /// 试题类型
        /// </summary>
        public QuestionType questionType { get; set; }
        /// <summary>
        /// 阶段属性
        /// </summary>
        public List<QuestionProperties> PropertiesList { get; set; }

        /// <summary>
        /// 阶梯类型名称
        /// </summary>
        public string mStepTypeName
        {
            get
            {
                switch (stepType)
                {
                    case "SECOND_ORDER_COGNITIVE_DEGREE":
                        return "二阶认知程度反馈试题";
                    case "SECOND_ORDER_COGNITIVE_REASON":
                        return "二阶认知理由反馈试题";
                    case "THIRD_ORDER_COGNITIVE":
                        return "三阶试题";
                    case "FOURTH_ORDER_COGNITIVE":
                        return "四阶试题";
                    default: return null;
                }
            }
        }
    }
    /// <summary>
    /// 试题内容
    /// </summary>
    public class QuestionContent
    {
        /// <summary>
        /// 试题Id
        /// </summary>
        public int questionId { get; set; }
        /// <summary>
        /// 试题内容（无Html）
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 试题完整内容
        /// </summary>
        public string contentHtml { get; set; }
        /// <summary>
        /// 答案
        /// </summary>
        public string answer { get; set; }
        /// <summary>
        /// 解析
        /// </summary>
        public string analysis { get; set; }
        /// <summary>
        /// 点评
        /// </summary>
        public string comment { get; set; }
    }
    /// <summary>
    /// 试题类型
    /// </summary>
    public class QuestionType
    {
        /// <summary>
        /// 题型Id
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 题型名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 是否可以自动阅卷
        /// </summary>
        public bool? autoGrade { get; set; }
        /// <summary>
        /// 题型(结果是数字） 1单选题，2多选题，3判断题，4一题一问主观题，5一题多问单选题，6组合题，7一题多问多选题 
        /// </summary>
        public string selectType { get; set; }
        /// <summary>
        /// 类型描述
        /// </summary>
        public string descrption { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public long? createTime { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public long? updateTime { get; set; }
    }

    /// <summary>
    /// 阶段属性
    /// </summary>
    public class QuestionProperties
    {
        public int? id { get; set; }
        public string questionPropertiesId { get; set; }
        public int? questionId { get; set; }
        public string step { get; set; }
        public string prompt { get; set; }
        public string questionStem { get; set; }
        public string options { get; set; }
        public string answer { get; set; }
        /// <summary>
        /// 题型(结果是数字） 1单选题，2多选题，3判断题，4一题一问主观题，5一题多问单选题，6组合题，7一题多问多选题 
        /// </summary>
        public string selectType { get; set; }
        /// <summary>
        /// 是否可以自动阅卷
        /// </summary>
        public bool? autoGrade { get; set; }

        /// <summary>
        /// 题型名称
        /// </summary>
        public string mSelectTypeName
        {
            get
            {
                switch (selectType)
                {
                    case "1": return "单选题";
                    case "2": return "多选题";
                    case "3": return "判断题";
                    case "4": return "一题一问主观题";
                    case "5": return "一题多问单选题";
                    case "6": return "组合题";
                    case "7": return "一题多问多选题";
                    default: return null;
                }
            }
        }

        private string _ContentHtml { get; set; }
        /// <summary>
        /// 内容HTML
        /// </summary>
        public string ContentHtml
        {
            get
            {
                if (_ContentHtml.IsEmpty())
                {
                    var sb = new StringBuilder();
                    sb.AppendFormat("<p>{0}</div>", questionStem);
                    foreach (var item in OptionList)
                    {
                        sb.AppendFormat("<p>{0}、{1}</div>", item.option, item.content);
                    }
                    _ContentHtml = sb.ToString();
                }
                return _ContentHtml;
            }
        }

        private List<QuestionPropertieOption> _OptionList;
        /// <summary>
        /// 选项内容
        /// </summary>
        public List<QuestionPropertieOption> OptionList
        {
            get
            {
                if (_OptionList == null)
                {
                    _OptionList = Helpers.JsonHelper.ToObject<List<QuestionPropertieOption>>(options);
                }
                return _OptionList;
            }
        }
    }
    /// <summary>
    /// 阶段属选项选项
    /// </summary>
    public class QuestionPropertieOption
    {
        /// <summary>
        /// 选项内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 是否是正确答案
        /// </summary>
        public bool isAnswer { get; set; }
        /// <summary>
        /// 选项名称
        /// </summary>
        public string option { get; set; }
    }
}
