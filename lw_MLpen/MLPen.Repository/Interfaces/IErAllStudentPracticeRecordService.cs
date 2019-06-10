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
    /// 班级试卷作答记录分析(接口)
    /// </summary>
    public interface IErAllStudentPracticeRecordService : IServiceBase<ErAllStudentPracticeRecord>, IAutofac
    {
        ErAllStudentPracticeRecord OneByExerciseRecordId(string exerciseRecordId);

        List<ErAllStudentPracticeRecord> ListByStatus();

        List<ErAllStudentPracticeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}