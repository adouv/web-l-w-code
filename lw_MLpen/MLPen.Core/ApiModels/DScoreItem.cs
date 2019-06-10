using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// D得分项
    /// </summary>
    public class DScoreItem
    {
        /// <summary>
        /// 学生id
        /// </summary>
        public string studentId { get; set; }
        /// <summary>
        /// 是否答对
        /// </summary>
        public Boolean right { get; set; }
        /// <summary>
        /// 得分d1
        /// </summary>
        public double d1 { get; set; }
        /// <summary>
        /// 得分d2
        /// </summary>
        public double d2 { get; set; }
        /// <summary>
        /// 得分d3
        /// </summary>
        public double d3 { get; set; }
        /// <summary>
        /// 得分d4
        /// </summary>
        public double d4 { get; set; }
        /// <summary>
        /// 得分d5
        /// </summary>
        public double d5 { get; set; }
        /// <summary>
        /// 得分d6
        /// </summary>
        public double d6 { get; set; }
        /// <summary>
        /// 得分d7
        /// </summary>
        public double d7 { get; set; }

    
    }
}
