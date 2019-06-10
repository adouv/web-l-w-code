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
    /// 学生单道题作答记录分析(接口实现)
    ///</summary>
    internal class ErSingleStudentQuestionRecordService : ServiceBase<ErSingleStudentQuestionRecord>, IErSingleStudentQuestionRecordService
    {
        public ErSingleStudentQuestionRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErSingleStudentQuestionRecord> listByExerciseRecordIdAndQuestionId(string exerciseRecordId, string questionId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.question_id == questionId).ToList();
        }

        public List<ErSingleStudentQuestionRecord> listByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).ToList();
        }

        public void batchSave(List<ErSingleStudentQuestionRecord> records) {
            IDatas.ErSingleStudentQuestionRecord.InsertRange<ErSingleStudentQuestionRecord>(records);
        }

        public List<ErSingleStudentQuestionRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErSingleStudentQuestionRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }
    }
}