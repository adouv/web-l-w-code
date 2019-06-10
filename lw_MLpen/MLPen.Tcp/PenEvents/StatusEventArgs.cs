using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.PenEvents
{
    /// <summary>
    /// 答题状态
    /// </summary>
    public class StatusEventArgs : EventArgs
    {
        public PenStatus PenStatus;
        public StatusEventArgs(PenStatus status)
        {
            this.PenStatus = status;
        }
    }
}
