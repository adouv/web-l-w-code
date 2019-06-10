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
    /// 班级试卷作答记录分析(接口实现)
    ///</summary>
    internal class ErAllStudentPracticeRecordService : ServiceBase<ErAllStudentPracticeRecord>, IErAllStudentPracticeRecordService
    {
        public ErAllStudentPracticeRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErAllStudentPracticeRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErAllStudentPracticeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public ErAllStudentPracticeRecord OneByExerciseRecordId(string exerciseRecordId)
        {
            var query = this.Where(r => r.exercise_record_id == exerciseRecordId);
            if (query != null && query.Count() > 0)
            {
                return query.First();
            }
            return null;
        }
    }
}