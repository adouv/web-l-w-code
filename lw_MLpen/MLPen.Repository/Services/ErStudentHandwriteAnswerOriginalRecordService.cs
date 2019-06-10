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
    /// 试卷练习学生答题笔记原始数据表(接口实现)
    ///</summary>
    internal class ErStudentHandwriteAnswerOriginalRecordService : ServiceBase<ErStudentHandwriteAnswerOriginalRecord>, IErStudentHandwriteAnswerOriginalRecordService
    {
        public ErStudentHandwriteAnswerOriginalRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErStudentHandwriteAnswerOriginalRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public List<ErStudentHandwriteAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.question_id == questionId).ToList();
        }

        public List<ErStudentHandwriteAnswerOriginalRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }
    }
}