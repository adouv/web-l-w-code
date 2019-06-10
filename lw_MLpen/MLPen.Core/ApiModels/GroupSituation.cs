using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 组答题情况
    /// </summary>
    public class GroupSituation
    {
        /// <summary>
        /// 全班答对组平均耗时
        /// </summary>
        public double? groupRightAverageTime { get; set; }
        /// <summary>
        /// 全班答对组平均首次反应时长
        /// </summary>
        public double? groupRightAverageFirstTime { get; set; }
        /// <summary>
        /// 全班答错组平均耗时
        /// </summary>
        public double? groupWrongAverageTime { get; set; }
        /// <summary>
        /// 全班答错组平均首次反应时长
        /// </summary>
        public double? groupWrongAverageFirstTime { get; set; }
        /// <summary>
        /// 本道题学生的平均的得分
        /// </summary>
        public double? studentAverageScore { get; set; }
        /// <summary>
        /// 答对人数
        /// </summary>
        public int rightCount { get; set; }
        /// <summary>
        /// 答错人数
        /// </summary>
        public int errorCount { get; set; }
        /// <summary>
        /// 答对组总用时
        /// </summary>
        public double rightTime { get; set; }
        /// <summary>
        /// 答错组总用时
        /// </summary>
        public double errorTime { get; set; }
    }
}
