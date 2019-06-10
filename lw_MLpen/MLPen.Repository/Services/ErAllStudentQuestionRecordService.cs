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
    /// 班级单道题作答记录分析(接口实现)
    ///</summary>
    internal class ErAllStudentQuestionRecordService : ServiceBase<ErAllStudentQuestionRecord>, IErAllStudentQuestionRecordService
    {
        public ErAllStudentQuestionRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErAllStudentQuestionRecord> listByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).ToList();
        }

        public List<ErAllStudentQuestionRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErAllStudentQuestionRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public ErAllStudentQuestionRecord oneByExerciseRecoedIdAndQuestionId(string exerciseRecordId, string questionId) {
            var query = this.Where(r => r.exercise_record_id.Equals(exerciseRecordId) && r.question_id == questionId);
            if (query != null && query.Count() > 0)
            {
                return query.First();
            }
            return null;
        }
    }
}