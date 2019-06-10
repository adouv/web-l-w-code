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
    /// 学生单道提作答记录表(原始数据)(接口实现)
    ///</summary>
    internal class ErOriginalRecordService : ServiceBase<ErOriginalRecord>, IErOriginalRecordService
    {
        public ErOriginalRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErOriginalRecord> listByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).ToList();
        }

        public List<ErOriginalRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErOriginalRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public List<ErOriginalRecord> listByExerciseRecordIdAndQuestionId(string exerciseRecordId, string questionId,string studentAnswer,double? studentScore,Boolean? studentIsRight) {
            var query = IDatas.ErOriginalRecord.DbSet;
            query = query.Where(r => r.exercise_record_id == exerciseRecordId && r.question_id == questionId);
            if (studentAnswer != null)
            {
                query = query.Where(r => r.answer == studentAnswer);
            }
            if (studentScore != null)
            {
                query = query.Where(r => r.student_score == studentScore);
            }
            if (studentIsRight != null)
            {
                query = query.Where(r => r.is_right == studentIsRight);
            }
            return query.ToList();
        }

        public List<ErOriginalRecord> listByExerciseRecordIdAndQuestion(string exerciseRecordId, string questionId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.question_id  == questionId).ToList();
        }
    }
}