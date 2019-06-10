using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.PenEvents
{
    public class WriteingEventArgs : EventArgs
    {
        public List<PenPoint> PenPoints;
        public WriteingEventArgs(List<PenPoint> points) 
        {
            this.PenPoints = points;
        }
    }
}
