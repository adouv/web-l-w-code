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
    /// 班级单道题作答记录分析(接口)
    /// </summary>
    public interface IErAllStudentQuestionRecordService : IServiceBase<ErAllStudentQuestionRecord>, IAutofac
    {
        ErAllStudentQuestionRecord oneByExerciseRecoedIdAndQuestionId(string exerciseRecordId, string questionId);

        List<ErAllStudentQuestionRecord> listByExerciseRecordId(string exerciseRecordId);

        List<ErAllStudentQuestionRecord> ListByStatus();

        List<ErAllStudentQuestionRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);
    }
}