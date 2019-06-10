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
    /// 单人知识点记录(接口)
    /// </summary>
    public interface IErSingleStudentKnowledgeRecordService : IServiceBase<ErSingleStudentKnowledgeRecord>, IAutofac
    {
        List<ErSingleStudentKnowledgeRecord> ListByStatus();

        List<ErSingleStudentKnowledgeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status);

        List<ErSingleStudentKnowledgeRecord> ListByExerciseRecordId(string exerciseRecordId);
    }
}