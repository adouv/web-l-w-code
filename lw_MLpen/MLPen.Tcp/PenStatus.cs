using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 笔状态
    /// </summary>
    public class PenStatus
    {
        /// <summary>
        /// 是否在线
        /// </summary>
        public bool IsOnline{ get; internal set; }
        /// <summary>
        /// 是否已经提交答案
        /// </summary>
        public bool IsSubmit { get; internal set; }
        /// <summary>
        /// 是否正在书写
        /// </summary>
        public bool IsWriteing { get; internal set; }
    }
}
