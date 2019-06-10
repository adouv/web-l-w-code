using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    public class DiagnosticQuestion
    {
        /// <summary>
        /// 习题id 
        /// </summary>
        public string question_id { get; set; }
        /// <summary>
        /// 习题类型(0主观题1客观题)
        /// </summary>
        public int? question_type { get; set; }
        /// <summary>
        /// 习题内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 知识点ID
        /// </summary>
        public long? knowledge_id { get; set; }
        /// <summary>
        /// 知识点名称
        /// </summary>
        public string knowledge_name { get; set; }
        /// <summary>
        /// 习题答案)
        /// </summary>
        public string answer { get; set; }
        /// <summary>
        /// 二阶答案
        /// </summary>
        public string secondOrderAnswer { get; set; }
        /// <summary>
        /// 三阶答案
        /// </summary>
        public string thirdOrderAnswer { get; set; }
        /// <summary>
        /// 四阶答案
        /// </summary>
        public string fourthOrderAnswer { get; set; }
        /// <summary>
        /// 属于几阶认知
        /// </summary>
        public String cognitive { get; set; }
        /// <summary>
        /// 该道题总分
        /// </summary>
        public double questionTotalScore { get; set; }
        /// <summary>
        ///答案的选项集合
        /// </summary>
        public List<string> answerOptions { get; set; }
        /// <summary>
        ///二阶选项集合
        /// </summary>
        public List<string> secondOrderOptions { get; set; }
        /// <summary>
        ///三阶选项集合
        /// </summary>
        public List<string> thirdOrderOptions { get; set; }
        /// <summary>
        ///四阶选项集合
        /// </summary>
        public List<string> fourthOrderOptions { get; set; }
    }
}
