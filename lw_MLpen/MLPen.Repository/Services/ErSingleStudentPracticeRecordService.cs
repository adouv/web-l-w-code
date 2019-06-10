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
    /// 学生整套题作答记录分析(接口实现)
    ///</summary>
    internal class ErSingleStudentPracticeRecordService : ServiceBase<ErSingleStudentPracticeRecord>, IErSingleStudentPracticeRecordService
    {
        public ErSingleStudentPracticeRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErSingleStudentPracticeRecord> ListByExerciseRecordId(String exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).ToList();
        }

        public List<ErSingleStudentPracticeRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErSingleStudentPracticeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }
    }
}