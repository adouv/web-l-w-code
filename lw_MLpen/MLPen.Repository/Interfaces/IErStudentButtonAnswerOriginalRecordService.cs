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
    /// 试卷练习学生答题按钮原始数据表(接口)
    /// </summary>
    public interface IErStudentButtonAnswerOriginalRecordService : IServiceBase<ErStudentButtonAnswerOriginalRecord>, IAutofac
    {
        List<ErStudentButtonAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId);

        List<ErStudentButtonAnswerOriginalRecord> ListByDateAndStatus(DateTime date, int status);

        List<ErStudentButtonAnswerOriginalRecord> ListByStatus();

        List<ErStudentButtonAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionIdAndStudentId(string exercise_record_id, long question_id, long? student_id);
    }
}