using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Packs;

namespace MLPen
{
    /// <summary>
    /// 笔记坐标点
    /// </summary>
    public class PenPoint
    {
        //private Pendot pendot;
        public PenPoint(Pendot pendot)
        {
            this.StudentId = pendot.penid;
            this.Pressure = pendot.pressure;
            this.X = pendot.x;
            this.Y = pendot.y;
        }
        /// <summary>
        /// 学生ID
        /// </summary>
        public long StudentId { get; internal set; }
        /// <summary>
        /// 压力值
        /// </summary>
        public ushort Pressure { get; internal set; }
        /// <summary>
        /// X坐标
        /// </summary>
        public int X { get; internal set; }
        /// <summary>
        /// Y坐标
        /// </summary>
        public int Y { get; internal set; }
    }
}
