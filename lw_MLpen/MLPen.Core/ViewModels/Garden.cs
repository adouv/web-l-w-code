using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ViewModels
{
    /// <summary>
    /// 园区
    /// </summary>
    public class Garden
    {
        /// <summary>
        /// 园区id
        /// </summary>
        public int GardenId { get; set; }
        /// <summary>
        /// 园区名称
        /// </summary>
        public string GardenName { get; set; }
        /// <summary>
        /// 园区类型id
        /// </summary>
        public int GardenTypeId { get; set; }
    }
}
