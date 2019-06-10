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
    /// 试卷练习记录试题封存表(接口实现)
    ///</summary>
    internal class ErPaperPracticeRecordQuestionSealUpService : ServiceBase<ErPaperPracticeRecordQuestionSealUp>, IErPaperPracticeRecordQuestionSealUpService
    {
        public ErPaperPracticeRecordQuestionSealUpService(IUnitOfWorks works) : base(works) { }

        public ErPaperPracticeRecordQuestionSealUp OneByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId)
        {
            return IDatas.ErPaperPracticeRecordQuestionSealUp.Where(r => r.paper_practice_record_id == exerciseRecordId && r.source_question_id == questionId).First();
        }

        public ErPaperPracticeRecordQuestionSealUp OneByQuestionId(string questionId)
        {
            return IDatas.ErPaperPracticeRecordQuestionSealUp.Where(r => r.id == questionId).First();
        }

        public List<ErPaperPracticeRecordQuestionSealUp> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.paper_practice_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public List<ErPaperPracticeRecordQuestionSealUp> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

    }
}