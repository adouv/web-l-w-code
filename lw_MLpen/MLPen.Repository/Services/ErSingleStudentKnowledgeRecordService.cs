using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Interfaces;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Services
{
    /// <summary>
    /// 单人知识点记录(接口实现)
    ///</summary>
    internal class ErSingleStudentKnowledgeRecordService : ServiceBase<ErSingleStudentKnowledgeRecord>, IErSingleStudentKnowledgeRecordService
    {
        public ErSingleStudentKnowledgeRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErSingleStudentKnowledgeRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }

        public List<ErSingleStudentKnowledgeRecord> ListByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).OrderBy(r => r.knowledge_id).ThenBy(r => r.student_id).ToList();
        }

        public List<ErSingleStudentKnowledgeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }
    }
}