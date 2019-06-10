using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Interfaces;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Services
{
    /// <summary>
    /// 试卷练习学生答题按钮原始数据表(接口实现)
    ///</summary>
    internal class ErStudentButtonAnswerOriginalRecordService : ServiceBase<ErStudentButtonAnswerOriginalRecord>, IErStudentButtonAnswerOriginalRecordService
    {
        public ErStudentButtonAnswerOriginalRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErStudentButtonAnswerOriginalRecord> ListByDateAndStatus(DateTime date, int status)
        {
            return this.Where(r => r.synchronous_status == status && r.create_time < date).ToList();
        }

        public List<ErStudentButtonAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.question_id == questionId).ToList();
        }

        public List<ErStudentButtonAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionIdAndStudentId(string exercise_record_id, long question_id, long? student_id)
        {
            return this.Where(r => r.exercise_record_id == exercise_record_id && r.question_id == question_id && r.student_id == student_id).ToList();
        }

        public List<ErStudentButtonAnswerOriginalRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }
    }
}