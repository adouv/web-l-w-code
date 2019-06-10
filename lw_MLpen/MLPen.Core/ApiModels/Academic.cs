using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    public class Academic
    {
        /// <summary>
        /// 发前学年
        /// </summary>
        public class Current
        {
            public int id { get; set; }
            public string name { get; set; }
            public int? gardenId { get; set; }
            public long? startDate { get; set; }
            public long? endDate { get; set; }
            public int? year { get; set; }
        }
    }
}
