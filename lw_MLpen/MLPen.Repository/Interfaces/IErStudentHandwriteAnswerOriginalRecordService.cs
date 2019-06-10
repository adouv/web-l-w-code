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
    /// 试卷练习学生答题笔记原始数据表(接口)
    /// </summary>
    public interface IErStudentHandwriteAnswerOriginalRecordService : IServiceBase<ErStudentHandwriteAnswerOriginalRecord>, IAutofac
    {
        List<ErStudentHandwriteAnswerOriginalRecord> ListByExerciseRecordIdAndQuestionId(string exerciseRecordId, long questionId);

        List<ErStudentHandwriteAnswerOriginalRecord> ListByStatus();

        List<ErStudentHandwriteAnswerOriginalRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}