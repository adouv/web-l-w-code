using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 阶梯选项
    /// </summary>
    public class StepOption
    {
        /// <summary>
        /// 内容
        /// </summary>
        public string content {get;set;}
        /// <summary>
        /// 是否为答案
        /// </summary>
        public bool isAnswer { get; set; }
        /// <summary>
        /// 选项
        /// </summary>
        public string option { get; set; }
}
}
