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
    /// 学生整套题作答记录分析(接口)
    /// </summary>
    public interface IErSingleStudentPracticeRecordService : IServiceBase<ErSingleStudentPracticeRecord>, IAutofac
    {
        List<ErSingleStudentPracticeRecord> ListByExerciseRecordId(String exerciseRecordId);

        List<ErSingleStudentPracticeRecord> ListByStatus();

        List<ErSingleStudentPracticeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}