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
    /// 学生单道题作答记录分析(接口)
    /// </summary>
    public interface IErSingleStudentQuestionRecordService : IServiceBase<ErSingleStudentQuestionRecord>, IAutofac
    {
        List<ErSingleStudentQuestionRecord> listByExerciseRecordIdAndQuestionId(string exerciseRecordId, string questionId);

        List<ErSingleStudentQuestionRecord> listByExerciseRecordId(string exerciseRecordId);

        List<ErSingleStudentQuestionRecord> ListByStatus();

        List<ErSingleStudentQuestionRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}