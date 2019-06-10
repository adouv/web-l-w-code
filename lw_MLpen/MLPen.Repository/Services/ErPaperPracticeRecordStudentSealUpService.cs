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
    /// 试卷练习学生信息封存表(接口实现)
    ///</summary>
    internal class ErPaperPracticeRecordStudentSealUpService : ServiceBase<ErPaperPracticeRecordStudentSealUp>, IErPaperPracticeRecordStudentSealUpService
    {
        public ErPaperPracticeRecordStudentSealUpService(IUnitOfWorks works) : base(works) { }

        public List<ErPaperPracticeRecordStudentSealUp> ListByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).ToList();
        }

        public List<ErPaperPracticeRecordStudentSealUp> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public List<ErPaperPracticeRecordStudentSealUp> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }
    }
}