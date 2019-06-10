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
    /// 学生单道提作答记录表(原始数据)(接口)
    /// </summary>
    public interface IErOriginalRecordService : IServiceBase<ErOriginalRecord>, IAutofac
    {
        List<ErOriginalRecord> listByExerciseRecordIdAndQuestionId(string exerciseRecordId, string questionId, string studentAnswer, double? studentScore, Boolean? studentIsRight);

        List<ErOriginalRecord> listByExerciseRecordId(string exerciseRecordId);

        List<ErOriginalRecord> ListByStatus();

        List<ErOriginalRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);

        List<ErOriginalRecord> listByExerciseRecordIdAndQuestion(string exerciseRecordId, string questionId);
    }
}