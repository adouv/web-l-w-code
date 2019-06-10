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
    /// 试卷练习学生信息封存表(接口)
    /// </summary>
    public interface IErPaperPracticeRecordStudentSealUpService : IServiceBase<ErPaperPracticeRecordStudentSealUp>, IAutofac
    {
        List<ErPaperPracticeRecordStudentSealUp> ListByStatus();

        List<ErPaperPracticeRecordStudentSealUp> ListByExerciseRecordId(string exerciseRecordId);

        List<ErPaperPracticeRecordStudentSealUp> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}