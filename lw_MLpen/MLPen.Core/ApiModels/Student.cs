using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ApiModels
{
    /// <summary>
    /// 学生信息
    /// </summary>
    public class Student
    {
        /// <summary>
        /// 学生ID
        /// </summary>
        public long id { get; set; }
        /// <summary>
        /// 学生姓名
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 头像地址
        /// </summary>
        public string imgUrl { get; set; }
        /// <summary>
        /// 性别 0女 1男
        /// </summary>
        public bool gender { get; set; }
        /// <summary>
        /// 优课号
        /// </summary>
        public string uid { get; set; }
        /// <summary>
        /// 学号
        /// </summary>
        public string number { get; set; }
        /// <summary>
        /// 班级ID
        /// </summary>
        public int classId { get; set; }
        /// <summary>
        /// 班级名称
        /// </summary>
        public string className { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int gradeId { get; set; }
        /// <summary>
        /// 年级名称
        /// </summary>
        public string gradeName { get; set; }
        /// <summary>
        /// 禁用状态 0没有禁用 1禁用
        /// </summary>
        public int status { get; set; }
        /// <summary>
        /// 是否借读 0否 1是
        /// </summary>
        public int isTransient { get; set; }
        /// <summary>
        /// 园区ID
        /// </summary>
        public int gardenId { get; set; }
        /// <summary>
        /// 学年ID
        /// </summary>
        public int? academicYearId { get; set; }
        /// <summary>
        /// 学年名称
        /// </summary>
        public string academicYearName { get; set; }
        /// <summary>
        /// 父母ID（后期会改动）
        /// </summary>
        public int? parentId { get; set; }
        /// <summary>
        /// 是否绑定父母 0未绑定 1已绑定
        /// </summary>
        public bool binding { get; set; }
        /// <summary>
        /// 更新时间
        /// </summary>
        public long updateTime { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public long createTime { get; set; }
        /// <summary>
        /// 园区名称
        /// </summary>
        public string gardenName { get; set; }
    }
}
