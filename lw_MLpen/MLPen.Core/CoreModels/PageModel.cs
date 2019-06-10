using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.CoreModels
{
    public class PageModel
    {
        /// <summary>
        /// 每页显示条数
        /// </summary>
        public int size { get; set; } = 10;
        /// <summary>
        /// 当前页码
        /// </summary>
        public int index { get; set; } = 1;
        /// <summary>
        /// 排序方式 asc
        /// </summary>
        public string order { get; set; } = "desc";
        /// <summary>
        /// 排序字段
        /// </summary>
        public string sort { get; set; } = "id";
        /// <summary>
        /// 查询
        /// </summary>
        public string search { get; set; }
    }
}
