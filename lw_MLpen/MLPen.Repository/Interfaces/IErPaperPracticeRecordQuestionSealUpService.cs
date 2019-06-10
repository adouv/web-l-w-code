using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Interfaces
{
    /// <summary>
    /// 试卷练习记录试题封存表(接口)
    /// </summary>
    public interface IErPaperPracticeRecordQuestionSealUpService : IServiceBase<ErPaperPracticeRecordQuestionSealUp>, IAutofac
    {
        ErPaperPracticeRecordQuestionSealUp OneByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId);

        ErPaperPracticeRecordQuestionSealUp OneByQuestionId(string questionId);

        List<ErPaperPracticeRecordQuestionSealUp> ListByStatus();

        List<ErPaperPracticeRecordQuestionSealUp> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}