using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class AllStudentKnowledgeStatisticsService : IAutofac
    {

        /**
        * 获取班级知识点分析
        * */
        public void SaveAllStudentKnowledgeRecord(string exerciseRecordId)
        {
            var singleStudentQuestionRecords = APP.IDatas.ErSingleStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            if(singleStudentQuestionRecords == null && singleStudentQuestionRecords.Count <= 0)
            {
                return;
            }
            var originalStudentRecords = APP.IDatas.ErOriginalRecord.listByExerciseRecordId(exerciseRecordId);
            if(originalStudentRecords == null && originalStudentRecords.Count <= 0)
            {
                return;
            }
            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            var singleStudentPracticeRecords = APP.IDatas.ErSingleStudentPracticeRecord.ListByExerciseRecordId(exerciseRecordId);
            var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if(practiceRecord == null)
            {
                return;
            }

            List<ErAllStudentKnowledgeRecord> allStudentKnowledgeRecords = new List<ErAllStudentKnowledgeRecord>();
            //将学生反馈结果拼成dictionary
            Dictionary<string, List<ErOriginalRecord>> dicOr = new Dictionary<string, List<ErOriginalRecord>>();
            foreach (IGrouping<string, ErOriginalRecord> group in originalStudentRecords.GroupBy(s => s.question_id))
            {
                dicOr.Add(group.Key, group.ToList<ErOriginalRecord>());
            }

            var allTime = originalStudentRecords.Select(o => o.use_time).Sum();
            var allButtonCount = originalStudentRecords.Select(o => o.button_count).Sum();
            var allWriteCount = originalStudentRecords.Select(o => o.write_count).Sum();

            List<ErAllStudentQuestionRecord> list = allStudentQuestionRecords.Where(e => e.knowledge_id != null).ToList();
            if (list != null && list.Count > 0)
            {
                foreach (IGrouping<long?, ErAllStudentQuestionRecord> group in list.GroupBy(e => e.knowledge_id))
                {
                    List<ErAllStudentQuestionRecord> all = group.ToList<ErAllStudentQuestionRecord>();
                    if (all != null && all.Count() > 0)
                    {
                        ErAllStudentKnowledgeRecord studentKnowledgeRecord = new ErAllStudentKnowledgeRecord
                        {
                            id = group.Key + "_" + practiceRecord.id + "_" + GetTimeStamp(),
                            knowledge_id = group.Key,
                            knowledge_name = all[0].knowledge_name,
                            exercise_record_id = practiceRecord.id,
                            practice_paper_id = practiceRecord.paper_id,
                            practice_paper_name = practiceRecord.paper_name
                        };
                        //知识点认知度
                        var awarenessTotal = all.Select(a => a.awareness).Sum();
                        studentKnowledgeRecord.knowledge_awareness = awarenessTotal / all.Count();
                        //该知识点所有学生单题分析记录
                        List<ErSingleStudentQuestionRecord> records = new List<ErSingleStudentQuestionRecord>();
                        //该知识点所有学生原始数据
                        List<ErOriginalRecord> originals = new List<ErOriginalRecord>();
                        List<string> questionIds = all.Select(e => e.question_id).ToList();
                        int answerCount = 0;
                        foreach (var questionId in questionIds)
                        {
                            List<ErSingleStudentQuestionRecord> ques = singleStudentQuestionRecords.Where(e => e.question_id == questionId).ToList();
                            records.AddRange(ques);
                            dicOr.TryGetValue(questionId, out List<ErOriginalRecord> oriList);
                            if (oriList != null && oriList.Count > 0)
                            {
                                if (oriList.Count > answerCount)
                                {
                                    // 最多人
                                    answerCount = oriList.Count;
                                }
                                originals.AddRange(oriList);
                            }
                        }

                        if (records != null && records.Count() > 0)
                        {
                            int worseCountAvg = records.Where(e => e.mastery_level >= 0 && e.mastery_level <= 0.2).Count();
                            int badCountAvg = records.Where(e => e.mastery_level > 0.2 && e.mastery_level <= 0.5).Count();
                            int goodCountAvg = records.Where(e => e.mastery_level > 0.5 && e.mastery_level <= 0.6).Count();
                            int greatCountAvg = records.Where(e => e.mastery_level > 0.6 && e.mastery_level <= 0.8).Count();
                            int perfectCountAvg = records.Where(e => e.mastery_level > 0.8 && e.mastery_level <= 1).Count();
                            studentKnowledgeRecord.worse_proportion = (double)worseCountAvg / records.Count();
                            studentKnowledgeRecord.bad_proportion = (double)badCountAvg / records.Count();
                            studentKnowledgeRecord.good_proportion = (double)goodCountAvg / records.Count();
                            studentKnowledgeRecord.great_proportion = (double)greatCountAvg / records.Count();
                            studentKnowledgeRecord.perfect_proportion = (double)perfectCountAvg / records.Count();
                        }
                        //知识点区分度
                        var disTotal = all.Select(e => e.discrimination).Sum();
                        studentKnowledgeRecord.knowledge_discrimination = disTotal / all.Count();
                        //知识点难度系数
                        var diffTotal = all.Select(e => e.degree_of_difficulty).Sum();
                        studentKnowledgeRecord.knowledge_degree_of_difficulty = diffTotal / all.Count();
                        //认知指数
                        var totalCog = records.Select(s => (s.deterministic_direct_feedback_score + s.deterministic_indirect_feedback_score) * (s.degree_of_difficulty == 0 ? 1 : s.degree_of_difficulty)).Sum();
                        studentKnowledgeRecord.knowledge_cognitive_index = totalCog / records.Count();
                        //知识点得分率
                        double? totalScore = 0;
                        foreach (ErOriginalRecord original in originals)
                        {
                            List<ErAllStudentQuestionRecord> alls = allStudentQuestionRecords.Where(e => e.question_id == original.question_id).ToList();
                            if (alls != null && alls.Count > 0)
                            {
                                totalScore += alls[0].score;
                            }
                        }
                        var studentScore = originals.Select(e => e.student_score).Sum();
                        studentKnowledgeRecord.knowledge_scoring_average = studentScore / totalScore;

                        //知识点接纳度
                        int knowledgeCount = allStudentQuestionRecords.Where(e => e.knowledge_id != null).GroupBy(e => e.knowledge_id).Count();
                        double t1 = (double)allTime / knowledgeCount;

                        var studentTime = originals.Select(e => e.use_time).Sum();
                        //待验证。。。。
                        var t2 = (double)studentTime / answerCount;

                        var n2 = (double)(allButtonCount + allWriteCount) / knowledgeCount / allTime;
                        var totalButtonCount = originals.Select(o => o.button_count).Sum();
                        var totalWriteCount = originals.Select(o => o.write_count).Sum();
                        var n1 = (double)(totalButtonCount + totalWriteCount) / answerCount / studentTime;

                        var R = studentKnowledgeRecord.knowledge_awareness;
                        var T = logistic(t1 / t2);
                        var N = logistic(n1 / n2);

                        studentKnowledgeRecord.knowledge_acceptance = logistic(R + T + N);

                        studentKnowledgeRecord.create_time = DateTime.Now;
                        studentKnowledgeRecord.update_time = DateTime.Now;

                        allStudentKnowledgeRecords.Add(studentKnowledgeRecord);
                    }
                }
            }
            APP.IDatas.ErAllStudentKnowledgeRecord.InsertRange<ErAllStudentKnowledgeRecord>(allStudentKnowledgeRecords);
            //APP.IDatas.ErAllStudentKnowledgeRecord.
            // 保存allStudentKnowledgeRecords
        }

        /**
         * MultiDimensional Chart
         * */
        public Dictionary<string, object> MultiDimensionalChartStatistics(string exerciseRecordId)
        {
            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            List<object> prefectList = new List<object>(allStudentKnowledgeRecords.Count);
            List<object> greatList = new List<object>(allStudentKnowledgeRecords.Count);
            List<object> goodList = new List<object>(allStudentKnowledgeRecords.Count);
            List<object> badList = new List<object>(allStudentKnowledgeRecords.Count);
            List<object> worseList = new List<object>(allStudentKnowledgeRecords.Count);
            List<object> nameList = new List<object>(allStudentKnowledgeRecords.Count);
            int number = 0;
            foreach (var all in allStudentKnowledgeRecords)
            {
                number++;
                prefectList.Add("-");
                greatList.Add("-");
                goodList.Add("-");
                badList.Add("-");
                worseList.Add("-");
                nameList.Add(all.knowledge_name);
                if (all.knowledge_awareness > 0.8 && all.knowledge_awareness <= 1)
                {
                    prefectList[number - 1] = all.knowledge_awareness;
                }
                else if (all.knowledge_awareness > 0.6 && all.knowledge_awareness <= 0.8)
                {
                    greatList[number - 1] = all.knowledge_awareness;
                }
                else if (all.knowledge_awareness > 0.5 && all.knowledge_awareness <= 0.6)
                {
                    goodList[number - 1] = all.knowledge_awareness;
                }
                else if (all.knowledge_awareness > 0.2 && all.knowledge_awareness <= 0.5)
                {
                    badList[number - 1] = all.knowledge_awareness;
                }
                else if (all.knowledge_awareness > 0 && all.knowledge_awareness <= 0.2)
                {
                    worseList[number - 1] = all.knowledge_awareness;
                }
            }
            resultDic.Add("prefectList", prefectList);
            resultDic.Add("greatList", greatList);
            resultDic.Add("goodList", goodList);
            resultDic.Add("badList", badList);
            resultDic.Add("worseList", worseList);
            resultDic.Add("nameList", nameList);
            return resultDic;
        }

        /**
        * MultiBar Chart
        * */
        public Dictionary<string, object> MultiBarChartStatistics(string exerciseRecordId)
        {
            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentKnowledgeRecords == null && allStudentKnowledgeRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> prefectList = new List<object>();
            List<object> greatList = new List<object>();
            List<object> goodList = new List<object>();
            List<object> badList = new List<object>();
            List<object> worseList = new List<object>();
            List<object> nameList = new List<object>();
            List<object> unablePrefectList = new List<object>();
            List<object> unableGreatList = new List<object>();
            List<object> unableGoodList = new List<object>();
            List<object> unableBadList = new List<object>();
            List<object> unableWorseList = new List<object>();
            foreach (var all in allStudentKnowledgeRecords)
            {
                prefectList.Add(all.perfect_proportion);
                unablePrefectList.Add(1 - all.perfect_proportion);
                greatList.Add(all.great_proportion);
                unableGreatList.Add(1 - all.great_proportion);
                goodList.Add(all.good_proportion);
                unableGoodList.Add(1 - all.good_proportion);
                badList.Add(all.bad_proportion);
                unableBadList.Add(1 - all.bad_proportion);
                worseList.Add(all.worse_proportion);
                unableWorseList.Add(1 - all.worse_proportion);
                nameList.Add(all.knowledge_name);
            }
            resultDic.Add("prefectList", prefectList);
            resultDic.Add("greatList", greatList);
            resultDic.Add("goodList", goodList);
            resultDic.Add("badList", badList);
            resultDic.Add("worseList", worseList);
            resultDic.Add("nameList", nameList);
            resultDic.Add("unablePrefectList", unablePrefectList);
            resultDic.Add("unableGreatList", unableGreatList);
            resultDic.Add("unableGoodList", unableGoodList);
            resultDic.Add("unableBadList", unableBadList);
            resultDic.Add("unableWorseList", unableWorseList);
            return resultDic;
        }

        /**
       * Line Chart
       * */
        public Dictionary<string, object> LineChartStatistics(string exerciseRecordId)
        {
            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentKnowledgeRecords == null && allStudentKnowledgeRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> discrimination = new List<object>();
            List<object> degreeOfDifficulty = new List<object>();
            List<object> scoringAverage = new List<object>();
            List<object> awareness = new List<object>();
            List<object> acceptance = new List<object>();
            List<object> nameList = new List<object>();
            double? discriminationTotal = 0;
            double? degreeOfDifficultyTotal = 0;
            double? scoringAverageTotal = 0;
            double? awarenessTotal = 0;
            double? acceptanceTotal = 0;
            foreach (var all in allStudentKnowledgeRecords)
            {
                discriminationTotal += all.knowledge_discrimination == null ? 0 : (double)all.knowledge_discrimination;
                degreeOfDifficultyTotal += all.knowledge_degree_of_difficulty == null ? 0 : (double)all.knowledge_degree_of_difficulty;
                scoringAverageTotal += all.knowledge_scoring_average == null ? 0 : (double)all.knowledge_scoring_average;
                awarenessTotal += all.knowledge_awareness == null ? 0 : (double)all.knowledge_awareness;
                acceptanceTotal += all.knowledge_acceptance == null ? 0 : (double)all.knowledge_acceptance;
                discrimination.Add(all.knowledge_discrimination);
                degreeOfDifficulty.Add(all.knowledge_degree_of_difficulty);
                scoringAverage.Add(all.knowledge_scoring_average);
                awareness.Add(all.knowledge_awareness);
                acceptance.Add(all.knowledge_acceptance);
                nameList.Add(all.knowledge_name);

            }
            resultDic.Add("discrimination", discrimination);
            resultDic.Add("degreeOfDifficulty", degreeOfDifficulty);
            resultDic.Add("scoringAverage", scoringAverage);
            resultDic.Add("awareness", awareness);
            resultDic.Add("acceptance", acceptance);
            resultDic.Add("nameList", nameList);
            resultDic.Add("discriminationTotal", discriminationTotal);
            resultDic.Add("degreeOfDifficultyTotal", degreeOfDifficultyTotal);
            resultDic.Add("scoringAverageTotal", scoringAverageTotal);
            resultDic.Add("awarenessTotal", awarenessTotal);
            resultDic.Add("acceptanceTotal", acceptanceTotal);
            return resultDic;
        }

        /**
      * ScatterDiagramChart
      * */
        public Dictionary<string, object> ScatterDiagramChartStatistics(string exerciseRecordId)
        {
            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            List<object> sureList = new List<object>();
            List<object> notSureList = new List<object>();
            List<object> nameList = new List<object>();
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentKnowledgeRecords == null && allStudentKnowledgeRecords.Count <= 0)
            {
                return resultDic;
            }
            foreach (var all in allStudentKnowledgeRecords)
            {
                string awarenessName = GetAwarenessName(all.knowledge_awareness);
                List<object> singleList = new List<object>();
                nameList.Add(all.knowledge_name);
                if (all.knowledge_awareness > 0.5)
                {
                    singleList = new List<object>();
                    singleList.Add(all.knowledge_name);
                    singleList.Add(all.knowledge_degree_of_difficulty * 10);
                    singleList.Add(all.knowledge_awareness * 10);
                    sureList.Add(singleList);
                }
                else
                {
                    singleList = new List<object>();
                    singleList.Add(all.knowledge_name);
                    singleList.Add(all.knowledge_degree_of_difficulty * 10);
                    singleList.Add(all.knowledge_awareness * 10);
                    notSureList.Add(singleList);
                }
            }
            resultDic.Add("sure", sureList);
            resultDic.Add("notSure", notSureList);
            resultDic.Add("nameList", nameList);
            return resultDic;
        }

        /**
       * ScatterDiagramChart
       * */
        public Dictionary<string, object> RadarChartStatistics(string exerciseRecordId)
        {

            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentKnowledgeRecords == null && allStudentKnowledgeRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> name = new List<object>();
            List<object> totalScore = new List<object>();
            List<object> awareness = new List<object>();
            List<object> scoringAverage = new List<object>();
            foreach (var all in allStudentKnowledgeRecords)
            {
                name.Add(all.knowledge_name);
                totalScore.Add(1);
                awareness.Add(all.knowledge_awareness);
                scoringAverage.Add(all.knowledge_scoring_average);
            }
            resultDic.Add("name", name);
            resultDic.Add("totalScore", totalScore);
            resultDic.Add("awareness", awareness);
            resultDic.Add("scoringAverage", scoringAverage);
            return resultDic;
        }

        /**
        * ScatterDiagramChart
        * */
        public Dictionary<string, object> CognitiveIndexChartStatistics(string exerciseRecordId)
        {

            var allStudentKnowledgeRecords = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentKnowledgeRecords == null && allStudentKnowledgeRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> cognitiveIndex = new List<object>();
            List<object> nameList = new List<object>();
            foreach (var all in allStudentKnowledgeRecords)
            {
                cognitiveIndex.Add(all.knowledge_cognitive_index);
                nameList.Add(all.knowledge_name);
            }
            cognitiveIndex.Reverse();
            nameList.Reverse();
            resultDic.Add("cognitiveIndex", cognitiveIndex);
            resultDic.Add("nameList", nameList);
            return resultDic;
        }

        private String GetAwarenessName(double? awareness)
        {
            String awarenessName = "";
            if (awareness > 0.8 && awareness <= 1)
            {
                awarenessName = "精通掌握";
            }
            else if (awareness > 0.6 && awareness <= 0.8)
            {
                awarenessName = "熟练掌握";
            }
            else if (awareness > 0.5 && awareness <= 0.6)
            {
                awarenessName = "基本理解";
            }
            else if (awareness > 0.2 && awareness <= 0.5)
            {
                awarenessName = "一知半解";
            }
            else if (awareness >= 0 && awareness <= 0.2)
            {
                awarenessName = "完全不会";
            }
            return awarenessName;
        }

        /**
        * 难度系数名称
        * */
        private String GetDegreeOfDifficultyName(double? degreeOfDifficulty)
        {
            degreeOfDifficulty = degreeOfDifficulty == null ? 0 : (double)degreeOfDifficulty;
            String degreeOfDifficultyName;
            if (degreeOfDifficulty < 0.2)
            {
                degreeOfDifficultyName = "偏难";
            }
            else if (degreeOfDifficulty > 0.6)
            {
                degreeOfDifficultyName = "偏易";
            }
            else
            {
                degreeOfDifficultyName = "适中";
            }
            return degreeOfDifficultyName;
        }

        /**
         * 区分度名称
         * */
        private String GetDiscriminationName(double? discrimination)
        {
            discrimination = discrimination == null ? 0 : (double)discrimination;
            String discriminationName;
            if (discrimination <= 0.29)
            {
                discriminationName = "很差";
            }
            else if (discrimination >= 0.4)
            {
                discriminationName = "很好";
            }
            else
            {
                discriminationName = "一般";
            }
            return discriminationName;
        }

        /**
      * 逻辑回归计算
      */
        public static double logistic(double? x)
        {
            return Math.Round(Math.Exp((double)x) / (1 + Math.Exp((double)x)), 2);
        }

        /**
        * 生成时间戳
        */
        public static string GetTimeStamp()
        {
            long ts = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000;
            return ts.ToString();
        }

        public Dictionary<string, object> OnePracticeKnowledgeStatistics(String practiceRecordId)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            var knowledgeRecordList = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(practiceRecordId);
            if (knowledgeRecordList == null || knowledgeRecordList.Count() <= 0) return result;
            List<string> indexList = new List<string>();
            List<int> rightCountList = new List<int>();
            List<int> avgTimeList = new List<int>();
            foreach (ErAllStudentKnowledgeRecord knowledgeRecord in knowledgeRecordList)
            {
                indexList.Add(knowledgeRecord.knowledge_name);
                rightCountList.Add(knowledgeRecord.right_count == null ? 0 : (int)knowledgeRecord.right_count);
                avgTimeList.Add(knowledgeRecord.avg_time == null ? 0 : (int)knowledgeRecord.avg_time);
            }
            result.Add("index", indexList);
            result.Add("rightCount", rightCountList);
            result.Add("avgTime", avgTimeList);
            return result;
        }

        public List<object> OnePracticeKnowledgeBaseStatistics(string practiceRecordId)
        {
            List<object> result = new List<object>();
            var knowledgeRecordList = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(practiceRecordId);
            if (knowledgeRecordList == null || knowledgeRecordList.Count() <= 0) return result;

            foreach (ErAllStudentKnowledgeRecord knowledgeRecord in knowledgeRecordList)
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic.Add("knowledge_id", knowledgeRecord.knowledge_id);
                dic.Add("knowledge_name", knowledgeRecord.knowledge_name);
                dic.Add("score", knowledgeRecord.score == null ? 0 : (int)knowledgeRecord.score);
                dic.Add("student_avg_score", knowledgeRecord.student_avg_score == null ? 0 : (int)knowledgeRecord.student_avg_score);
                dic.Add("avg_time", knowledgeRecord.avg_time == null ? 0 : (int)knowledgeRecord.avg_time);
                dic.Add("degree_of_difficulty", knowledgeRecord.degree_of_difficulty == null ? 0 : (double)knowledgeRecord.degree_of_difficulty);
                dic.Add("difficultyName", GetDiscriminationName(knowledgeRecord.degree_of_difficulty));
                dic.Add("discrimination", knowledgeRecord.discrimination == null ? 0 : (double)knowledgeRecord.discrimination);
                dic.Add("discriminationName", GetDiscriminationName(knowledgeRecord.discrimination));
                dic.Add("right_count", knowledgeRecord.right_count == null ? 0 : (int)knowledgeRecord.right_count);
                dic.Add("error_count", knowledgeRecord.error_count == null ? 0 : (int)knowledgeRecord.error_count);

                result.Add(dic);
            }
            return result;
        }

        public Dictionary<string, object> onePracticeKnowledgeScoreStatistics(string practiceRecordId)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            //整理知识点，封存返回给前端的知识点内容
            List<object> knowledgeStatisticsList = new List<object>();
            var knowledgeRecordList = APP.IDatas.ErAllStudentKnowledgeRecord.listByExerciseRecordId(practiceRecordId);
            if (knowledgeRecordList == null || knowledgeRecordList.Count() <= 0) return result;

            foreach (ErAllStudentKnowledgeRecord allKnowledgeRecord in knowledgeRecordList)
            {
                Dictionary<string, object> knowledgeDic = new Dictionary<string, object>();
                knowledgeDic.Add("knowledge_id", allKnowledgeRecord.knowledge_id);
                knowledgeDic.Add("knowledge_name", allKnowledgeRecord.knowledge_name);
                knowledgeDic.Add("score", allKnowledgeRecord.score == null ? 0 : (int)allKnowledgeRecord.score);
                knowledgeDic.Add("student_avg_score", allKnowledgeRecord.student_avg_score == null ? 0 : (int)allKnowledgeRecord.student_avg_score); ;
                knowledgeStatisticsList.Add(knowledgeDic);
            }
            result.Add("knowledge", knowledgeStatisticsList);
            //整理每个知识点下各个学生的得分情况
            var singleStudentRecordList = APP.IDatas.ErSingleStudentKnowledgeRecord.ListByExerciseRecordId(practiceRecordId);
            if (singleStudentRecordList == null || singleStudentRecordList.Count() <= 0) return result;
            Dictionary<string, object> studentScore = new Dictionary<string, object>();
            foreach (var singleStudentKnowledeRecored in singleStudentRecordList)
            {
                studentScore.Add("student_id", singleStudentKnowledeRecored.student_id.ToString());

            }
            
            return result;
        }
    }
}
