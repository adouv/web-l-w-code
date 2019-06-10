using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class SingleStudentQuestionStatisticsService : IAutofac
    {
        /**
        * BubbleDiagram Chart
        * */
        public List<object> BubbleDiagramChartStatistics(string exerciseRecordId, string questionId)
        {
            List<object> resultList = new List<object>();
            var questionRecords = APP.IDatas.ErSingleStudentQuestionRecord.listByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            var OriginalRecords = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId,null,null,null);
            var students = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordId(exerciseRecordId);
            IDictionary<long?, ErPaperPracticeRecordStudentSealUp> studentDic = students.ToDictionary(key => key.student_id, ErStudentObj => ErStudentObj);
            IDictionary<long?, ErOriginalRecord> oriDic = OriginalRecords.ToDictionary(key => key.student_id, ErOriginalRecordObj => ErOriginalRecordObj);
            foreach (var singleRecord in questionRecords)
            {
                oriDic.TryGetValue(singleRecord.student_id, out ErOriginalRecord erOriginalRecord);
                studentDic.TryGetValue(singleRecord.student_id, out ErPaperPracticeRecordStudentSealUp student);
                Dictionary<string, object> singleDic = new Dictionary<string, object>();
                singleDic.Add("useTime", erOriginalRecord.use_time);
                singleDic.Add("masteryLevel", singleRecord.mastery_level);
                singleDic.Add("masteryLevelName", GetMasteryLevelName(singleRecord.mastery_level));
                singleDic.Add("studentName", student.student_name);
                singleDic.Add("score", erOriginalRecord.student_score / 100);
                singleDic.Add("imgUrl", student.student_head_portrait);
                resultList.Add(singleDic);
            }
            return resultList;
        }

        /**
        * Table Chart
        * */
        public List<object> TableChart(string exerciseRecordId, string questionId, int type)
        {
            List<object> resultList = new List<object>();
            var questionRecords = APP.IDatas.ErSingleStudentQuestionRecord.listByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            var OriginalRecords = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId, null, null, null);
            IDictionary<long?, ErOriginalRecord> oriDic = OriginalRecords.ToDictionary(key => key.student_id, ErOriginalRecordObj => ErOriginalRecordObj);
            var students = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordId(exerciseRecordId);
            IDictionary<long?, ErPaperPracticeRecordStudentSealUp> studentDic = students.ToDictionary(key => key.student_id, ErStudentObj => ErStudentObj);
            var questions = questionRecords.Where(e => e.master_level_type == type).ToList();
            List<long?> studentIds = questions.Select(e => e.student_id).ToList();
            int? totalTime = 0;
            foreach(var studentId in studentIds)
            {
                oriDic.TryGetValue(studentId, out ErOriginalRecord erOriginalRecord);
                totalTime += erOriginalRecord.use_time;
            }
            int? avgTime = 0;
            if (studentIds != null && studentIds.Count > 0)
            {
                avgTime = totalTime / studentIds.Count;
            }
            foreach(var single in questions)
            {
                Dictionary<string, object> result = new Dictionary<string, object>();
                oriDic.TryGetValue(single.student_id, out ErOriginalRecord erOriginalRecord);
                studentDic.TryGetValue(single.student_id, out ErPaperPracticeRecordStudentSealUp student);
                result.Add("studentNumber", student.student_number);
                result.Add("studentName", student.student_name);
                result.Add("direct", single.deterministic_direct_feedback_score);
                result.Add("indect", single.deterministic_indirect_feedback_score);
                result.Add("useTime", erOriginalRecord.use_time);
                result.Add("avgTime", avgTime);
                string isRight = "";
                if (erOriginalRecord.is_right)
                {
                    isRight = "对";
                }
                else
                {
                    isRight = "错";
                }
                result.Add("result", erOriginalRecord.answer + "/" + isRight + "/" + erOriginalRecord.student_score + "分");
                resultList.Add(result);
            }
            return resultList;
        }

        private String GetMasteryLevelName(double? masteryLevel)
        {
            String masteryLevelName = "";
            if (masteryLevel > 0.8 && masteryLevel <= 1)
            {
                masteryLevelName = "perfect";
            }
            else if (masteryLevel > 0.6 && masteryLevel <= 0.8)
            {
                masteryLevelName = "great";
            }
            else if (masteryLevel > 0.5 && masteryLevel <= 0.6)
            {
                masteryLevelName = "good";
            }
            else if (masteryLevel > 0.2 && masteryLevel <= 0.5)
            {
                masteryLevelName = "bad";
            }
            else if (masteryLevel >= 0 && masteryLevel <= 0.2)
            {
                masteryLevelName = "worse";
            }
            return masteryLevelName;
        }

    }
}
