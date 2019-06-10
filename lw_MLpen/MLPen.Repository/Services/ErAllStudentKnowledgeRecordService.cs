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
    /// 班级知识点作答分析结果(接口实现)
    ///</summary>
    internal class ErAllStudentKnowledgeRecordService : ServiceBase<ErAllStudentKnowledgeRecord>, IErAllStudentKnowledgeRecordService
    {
        public ErAllStudentKnowledgeRecordService(IUnitOfWorks works) : base(works) { }

        public List<ErAllStudentKnowledgeRecord> listByExerciseRecordId(string exerciseRecordId)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId).OrderBy(r => r.knowledge_id).ToList();
        }

        public List<ErAllStudentKnowledgeRecord> ListByExerciseRecordIdAndStatus(string exerciseRecordId, int status)
        {
            return this.Where(r => r.exercise_record_id == exerciseRecordId && r.synchronous_status == status).ToList();
        }

        public List<ErAllStudentKnowledgeRecord> ListByStatus()
        {
            return this.Where(r => r.synchronous_status == 0).ToList();
        }
    }
}