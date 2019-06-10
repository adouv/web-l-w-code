using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class SingleStudentPracticeStatisticsService : IAutofac
    {
        /**
        * BubbleDiagram Chart
        * */
        public List<object> AllBubbleDiagramChartStatistics(string exerciseRecordId, int type)
        {
            List<object> resultList = new List<object>();
            var students = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordId(exerciseRecordId);
            if(students == null && students.Count <= 0)
            {
                return null;
            }
            IDictionary<long?, ErPaperPracticeRecordStudentSealUp> studentDic = students.ToDictionary(key => key.student_id, ErStudentObj => ErStudentObj);
            var practiceRecords = APP.IDatas.ErSingleStudentPracticeRecord.ListByExerciseRecordId(exerciseRecordId);

            foreach (var singleRecord in practiceRecords)
            {
                Dictionary<string, object> singleDic = new Dictionary<string, object>();
                studentDic.TryGetValue(singleRecord.student_id, out ErPaperPracticeRecordStudentSealUp student);
                double? masteryLevel;
                if (type == 1)
                {
                    masteryLevel = singleRecord.mastery_level_avg;
                }
                else
                {
                    masteryLevel = singleRecord.mastery_level_low;
                }
                String masteryLevelName = getMasteryLevelName(masteryLevel);

                singleDic.Add("useTime", singleRecord.total_time);
                singleDic.Add("masteryLevel", masteryLevel);
                singleDic.Add("masteryLevelName", masteryLevelName);
                singleDic.Add("studentName", student.student_name);
                singleDic.Add("imgUrl", student.student_head_portrait);
                singleDic.Add("score", singleRecord.total_score / 100);
                resultList.Add(singleDic);
            }
            return resultList;
        }


        #region 单次练习学生答题结果统计
        /// <summary>
        /// 单次练习学生答题结果统计
        /// </summary>
        /// <param name="practiceRecordId"></param>
        /// <returns></returns>
        public List<object> OnePracticeStudentOriginalStatistics(string practiceRecordId)
        {
            List<object> result = new List<object>();
            var recordList = APP.IDatas.ErSingleStudentPracticeRecord.ListByExerciseRecordId(practiceRecordId);
            if(recordList==null || recordList.Count() <= 0)
            {
                return result;
            }
            var studentList = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordId(practiceRecordId);
            foreach (ErSingleStudentPracticeRecord practiceRecord in recordList)
            {
                Dictionary<string, object> recordDic = new Dictionary<string, object>();
                recordDic.Add("studentId", practiceRecord.student_id);
                recordDic.Add("exercise_record_id", practiceRecord.exercise_record_id);

                foreach (ErPaperPracticeRecordStudentSealUp studentSealUp in studentList)
                {
                    if (studentSealUp.student_id.Equals(practiceRecord.student_id))
                    {
                        recordDic.Add("studentNumber", studentSealUp.student_number);
                        recordDic.Add("studentName", studentSealUp.student_name);
                        break;
                    }
                }
                recordDic.Add("rightCount", practiceRecord.right_count == null ? 0 : (int)practiceRecord.right_count);
                recordDic.Add("errorCount", practiceRecord.error_count == null ? 0 : (int)practiceRecord.error_count);
                recordDic.Add("avgScore", practiceRecord.avg_score == null ? 0 : (int)practiceRecord.avg_score);
                recordDic.Add("totalScore", practiceRecord.total_score == null ? 0 : (int)practiceRecord.total_score);
                recordDic.Add("avgTime", practiceRecord.avg_time == null ? 0 : (int)practiceRecord.avg_time);
                recordDic.Add("totalTime", practiceRecord.total_time == null ? 0 : (int)practiceRecord.total_time);
                result.Add(recordDic);
            }
            return result;

        }
        #endregion

        /**
            * 获取单个学生习题卷练习记录
            * */
        public void GetSingleStudentPracticeRecords(string exerciseRecordId)
        {
            if (exerciseRecordId.IsEmpty()) return;
            var singleStudentQuestionRecords = APP.IDatas.ErSingleStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            if(singleStudentQuestionRecords == null && singleStudentQuestionRecords.Count<= 0)
            {
                return;
            }
            var originalStudentRecords = APP.IDatas.ErOriginalRecord.listByExerciseRecordId(exerciseRecordId);
            if(originalStudentRecords == null && originalStudentRecords.Count <= 0)
            {
                return;
            }
            var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if(practiceRecord == null)
            {
                return;
            }

            List<ErSingleStudentPracticeRecord> singleStudentPracticeRecords = new List<ErSingleStudentPracticeRecord>();
            Dictionary<long?, List<ErOriginalRecord>> dic = new Dictionary<long?, List<ErOriginalRecord>>();
            foreach (IGrouping<long?, ErOriginalRecord> group in originalStudentRecords.GroupBy(s => (s.student_id)))
            {
                dic.Add(group.Key, group.ToList<ErOriginalRecord>());
            }
            foreach (IGrouping<long?, ErSingleStudentQuestionRecord> group in singleStudentQuestionRecords.GroupBy(s => s.student_id))
            {
                ErSingleStudentPracticeRecord singleStudentPracticeRecord = new ErSingleStudentPracticeRecord
                {
                    id = group.Key + "_" + practiceRecord.id + "_" + GetTimeStamp(),
                    exercise_record_id = practiceRecord.id,
                    practice_paper_id = practiceRecord.paper_id,
                    practice_paper_name = practiceRecord.paper_name
                };

                List<ErSingleStudentQuestionRecord> records = group.ToList<ErSingleStudentQuestionRecord>();
                double avg_plenary = 0;
                singleStudentPracticeRecord.worse_proportion_avg = 0;
                singleStudentPracticeRecord.bad_proportion_avg = 0;
                singleStudentPracticeRecord.good_proportion_avg = 0;
                singleStudentPracticeRecord.great_proportion_avg = 0;
                singleStudentPracticeRecord.perfect_proportion_avg = 0;
                if (records != null && records.Count > 0)
                {
                    int count = records.Where(e => e.mastery_level > 0.5).Count();
                    avg_plenary  = count / records.Count;

                    int worseCountAvg = records.Where(e => e.mastery_level>= 0 && e.mastery_level <= 0.2).Count();
                    int badCountAvg = records.Where(e => e.mastery_level > 0.2 && e.mastery_level <= 0.5).Count();
                    int goodCountAvg = records.Where(e => e.mastery_level > 0.5 && e.mastery_level <= 0.6).Count();
                    int greatCountAvg = records.Where(e => e.mastery_level > 0.6 && e.mastery_level <= 0.8).Count();
                    int perfectCountAvg = records.Where(e => e.mastery_level > 0.8 && e.mastery_level <= 1).Count();
                    singleStudentPracticeRecord.worse_proportion_avg = (double)worseCountAvg / records.Count();
                    singleStudentPracticeRecord.bad_proportion_avg = (double)badCountAvg / records.Count();
                    singleStudentPracticeRecord.good_proportion_avg = (double)goodCountAvg / records.Count();
                    singleStudentPracticeRecord.great_proportion_avg = (double)greatCountAvg / records.Count();
                    singleStudentPracticeRecord.perfect_proportion_avg = (double)perfectCountAvg / records.Count();
                }
                singleStudentPracticeRecord.avg_plenary = avg_plenary;
                singleStudentPracticeRecord.student_id = group.Key;
                dic.TryGetValue(group.Key, out List<ErOriginalRecord> res);
                ErSingleStudentQuestionRecord singleStudentQuestionRecord = records.OrderByDescending(t => t.mastery_level).Last();
                singleStudentPracticeRecord.mastery_level_low = singleStudentQuestionRecord.mastery_level;
                double? total = records.Select(e => e.mastery_level).Sum();
                singleStudentPracticeRecord.mastery_level_avg = total / records.Count();
                int? totalUseTime = res.Select(e => e.use_time).Sum();
                double? totalScore = res.Select(e => e.student_score).Sum();
                singleStudentPracticeRecord.total_score = totalScore;
                singleStudentPracticeRecord.avg_score = totalScore / res.Count;
                singleStudentPracticeRecord.avg_time = totalUseTime / res.Count;

                singleStudentPracticeRecord.total_time = totalUseTime;
                singleStudentPracticeRecord.create_time = DateTime.Now;
                singleStudentPracticeRecord.update_time = DateTime.Now;
                singleStudentPracticeRecords.Add(singleStudentPracticeRecord);
            }
            //保存
            APP.IDatas.ErSingleStudentPracticeRecord.InsertRange<ErSingleStudentPracticeRecord>(singleStudentPracticeRecords);
        }

        private String getMasteryLevelName(double? masteryLevel)
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

        /**
        * 生成时间戳
        */
        public static string GetTimeStamp()
        {
            long ts = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000;
            return ts.ToString();
        }
    }
}
