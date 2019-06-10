using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ViewModels
{
    /// <summary>
    /// 班级
    /// </summary>
    public class Classes : NotifyProperty
    {
        /// <summary>
        /// 获取原始基类
        /// </summary>
        private ApiModels.Classes Base { get; set; }
        private bool _IsChecked;

        public Classes(ApiModels.Classes classes)
        {
            Base = classes;
        }

        /// <summary>
        /// 是否选中
        /// </summary>
        public bool IsChecked { get { return _IsChecked; } set { _IsChecked = value; NotifyPropertyChange("IsChecked"); } }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int GradeId { get { return Base.gradeId; } }
        /// <summary>
        /// 年级名称
        /// </summary>
        public string GradeName { get { return Base.gradeName; } }
        /// <summary>
        /// 班级ID
        /// </summary>
        public int ClassId { get { return Base.classId; } }
        /// <summary>
        /// 班级名称
        /// </summary>
        public string ClassName { get { return Base.className; } }
        /// <summary>
        /// 教师ID
        /// </summary>
        public int TeacherId { get { return Base.teacherId == null ? 0 : Base.teacherId.Split<int>()[0]; } }
        /// <summary>
        /// 教师名称
        /// </summary>
        public string TeacherName { get { return Base.teacherName; } }
        /// <summary>
        /// 全称(年级班级)
        /// </summary>
        public string FullName { get { return GradeName + ClassName; } }
    }
}
