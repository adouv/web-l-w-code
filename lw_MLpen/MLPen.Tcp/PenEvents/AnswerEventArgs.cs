using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.PenEvents
{
    public class AnswerEventArgs : EventArgs
    {
        public PenKey PenKey;
        public AnswerEventArgs(PenKey key)
        {
            this.PenKey = key;
        }
    }
}
