using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.CoreModels
{
    /// <summary>
    ///  BootTable分页
    /// </summary>
    public class BootTableModel
    {
        /// <summary>
        ///  BootTable分页（请求参数）
        /// </summary>
        public class Search
        {
            /// <summary>
            /// 每页显示条数
            /// </summary>
            public int limit { get; set; }
            /// <summary>
            /// 当前页
            /// </summary>
            public int offset { get; set; }
            /// <summary>
            /// 排序方式 asc
            /// </summary>
            public string order { get; set; }
            /// <summary>
            /// 排序字段
            /// </summary>
            public string sort { get; set; }
            /// <summary>
            /// 查询条件
            /// </summary>
            public string search { get; set; }
        }
        /// <summary>
        ///  BootTable分页（输出）
        /// </summary>
        /// <typeparam name="TResult"></typeparam>
        public class Result<TResult>
        {
            /// <summary>
            /// 总条数
            /// </summary>
            public int total { get; set; }
            /// <summary>
            /// 总页数
            /// </summary>
            public int count { get; set; }
            /// <summary>
            /// 记录
            /// </summary>
            public List<TResult> rows { get; set; }
        }
    }
}
