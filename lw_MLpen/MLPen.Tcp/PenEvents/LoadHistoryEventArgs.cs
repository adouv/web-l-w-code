using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.PenEvents
{
    /// <summary>
    /// 加载全部坐标
    /// </summary>
    public class LoadHistoryEventArgs : EventArgs
    {
        public List<PenPoint> PenPoints;
        public bool IsAnimation;
        public LoadHistoryEventArgs(List<PenPoint> points, bool isAnimation)
        {
            this.PenPoints = points;
            this.IsAnimation = isAnimation;
        }
    }
}
