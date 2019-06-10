using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.ViewModels
{
    public class StudentView : NotifyProperty
    {
        public StudentView(ApiModels.Student student)
        {
            StudentId = student.id;
            Name = student.name;
            Face = MSUtils.GetStudentFace(student.imgUrl, student.gender);
        }
        /// <summary>
        /// 学生ID
        /// </summary>
        public long StudentId { get; private set; }
        /// <summary>
        /// 学生姓名
        /// </summary>
        public string Name { get; private set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string Face { get; private set; }

        private bool _IsSelected;
        private bool _IsOnline;
        private bool _IsSubmit;
        private bool _IsWriteing;
        /// <summary>
        /// 是否选中
        /// </summary>
        public bool IsSelected { get { return _IsSelected; } set { _IsSelected = value; NotifyPropertyChange("IsSelected"); } }
        /// <summary>
        /// 是否在线
        /// </summary>
        public bool IsOnline { get { return _IsOnline; } set { _IsOnline = value; NotifyPropertyChange("IsOnline"); } }
        /// <summary>
        /// 是否提交
        /// </summary>
        public bool IsSubmit { get { return _IsSubmit; } set { _IsSubmit = value; NotifyPropertyChange("IsSubmit"); } }
        /// <summary>
        /// 是否提交
        /// </summary>
        public bool IsWriteing { get { return _IsWriteing; } set { _IsWriteing = value; NotifyPropertyChange("IsWriteing"); } }
    }
}
