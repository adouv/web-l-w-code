using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class CheckDataTimedDeletionService
    {
        // 删除符合要求数据
        public void DeleteData()
        {
            long totalCount = APP.IDatas.ErStudentButtonAnswerOriginalRecord.Count();
            if(totalCount > 1000000)
            {
                DateTime date = DateTime.Now.AddDays(-30);
                var buttonRecords = APP.IDatas.ErStudentButtonAnswerOriginalRecord.ListByDateAndStatus(date, 1);
                List<String> exerciseRecordIds = buttonRecords.Select(e => e.exercise_record_id).ToList();
                foreach(String exerciseRecordId in exerciseRecordIds)
                {
                    bool isDelete = CheckData(exerciseRecordId);
                    if (isDelete)
                    {
                        APP.IDatas.ErPracticeRecord.DeleteByKey(exerciseRecordId);
                        APP.IDatas.ErStudentButtonAnswerOriginalRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErStudentHandwriteAnswerOriginalRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErPaperPracticeRecordStudentSealUp.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErPaperPracticeRecordQuestionSealUp.Delete(e => e.paper_practice_record_id == exerciseRecordId);
                        APP.IDatas.ErOriginalRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErAllStudentQuestionRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErAllStudentPracticeRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErAllStudentKnowledgeRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErSingleStudentQuestionRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErSingleStudentPracticeRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                        APP.IDatas.ErSingleStudentKnowledgeRecord.Delete(e => e.exercise_record_id == exerciseRecordId);
                    }
                }
            }
        }

        //检查数据是否可以删除
        public bool CheckData(string exerciseRecordId)
        {
            int status = 0;
            var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if(practiceRecord.synchronous_status == 0)
            {
                return false;
            }
            var handwriteRecords = APP.IDatas.ErStudentHandwriteAnswerOriginalRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if(handwriteRecords != null && handwriteRecords.Count > 0)
            {
                return false;
            }
            var studentSealUps = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (studentSealUps != null && studentSealUps.Count > 0)
            {
                return false;
            }
            var questionSealUps = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (questionSealUps != null && questionSealUps.Count > 0)
            {
                return false;
            }
            var originalRecords = APP.IDatas.ErOriginalRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (originalRecords != null && originalRecords.Count > 0)
            {
                return false;
            }
            var allQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (allQuestionRecords != null && allQuestionRecords.Count > 0)
            {
                return false;
            }
            var allPracticeRecords = APP.IDatas.ErAllStudentPracticeRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (allPracticeRecords != null && allPracticeRecords.Count > 0)
            {
                return false;
            }
            var allKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (allKnowledgeRecords != null && allKnowledgeRecords.Count > 0)
            {
                return false;
            }
            var singleQuestionRecords = APP.IDatas.ErSingleStudentQuestionRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (singleQuestionRecords != null && singleQuestionRecords.Count > 0)
            {
                return false;
            }
            var singlePracticeRecords = APP.IDatas.ErSingleStudentPracticeRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (singlePracticeRecords != null && singlePracticeRecords.Count > 0)
            {
                return false;
            }
            var singleKnowledgeRecords = APP.IDatas.ErSingleStudentKnowledgeRecord.ListByExerciseRecordIdAndStatus(exerciseRecordId, status);
            if (singleKnowledgeRecords != null && singleKnowledgeRecords.Count > 0)
            {
                return false;
            }
            return true;
        }
    }
}
