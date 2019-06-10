using MLPen.Repository.Entitys;
using MLPen.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    /// <summary>
    /// 班级单道题作答记录分析service
    /// </summary>
    public class AllStudentQuestionStatisticsService : IAutofac
    {
        /// <summary>
        /// 单道题的结果统计
        /// </summary>
        /// <param name="exerciseRecordId"></param>
        /// <param name="questionId"></param>
        /// <returns></returns>
        public Dictionary<string, object> oneQuestionRecordStatistics(string exerciseRecordId, string questionId) {
            Dictionary<string, object> resultDic = new Dictionary<string, object>();

            var questionRecord = APP.IDatas.ErAllStudentQuestionRecord.oneByExerciseRecoedIdAndQuestionId(exerciseRecordId,questionId);
            if (questionRecord == null) return resultDic;

            resultDic.Add("record", questionRecord);

            List<ErOriginalRecord> originalRecordList = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId,null,null,null);
            if (originalRecordList == null || originalRecordList.Count <= 0) {
                resultDic.Add("echart", new List<String>());
                return resultDic;
            }

           
            if (questionRecord.pattern == 0)
            {
                //主观题的赋分模式
                Dictionary<string, object> echartMap = subjectiveQuestionScoreEchart(originalRecordList);
                resultDic.Add("echart", echartMap);

            }
            else if (questionRecord.pattern == 1)
            {
                //主观题的对错模式
                Dictionary<string, object> echartMap = subjectiveQuestionIsRightEchart(originalRecordList);
                resultDic.Add("echart", echartMap);
            }
            else
            {
                List<Dictionary<string, object>> echartList = objectiveQuestionEcharts(questionRecord, originalRecordList);

                resultDic.Add("echart", echartList);
            }

            return resultDic;
        }

        /// <summary>
        /// 主观题对错模式相关图表数据
        /// </summary>
        /// <param name="originalRecordList"></param>
        /// <returns></returns>
        private static Dictionary<string, object> subjectiveQuestionIsRightEchart(List<ErOriginalRecord> originalRecordList)
        {
            Dictionary<Boolean, int[]> isRightItemDic = new Dictionary<Boolean, int[]>();
            foreach (ErOriginalRecord originalRecord in originalRecordList)
            {
                int[] ints = new int[2];
                int count = 1;
                int useTime = 0;
                if (isRightItemDic.ContainsKey(originalRecord.is_right))
                {
                    ints = isRightItemDic[originalRecord.is_right];
                    count = ints[0];
                    count++;
                    ints[0] = count;
                    useTime = ints[1];
                    useTime = useTime + (originalRecord.use_time == null ? 0 : (int)originalRecord.use_time);
                    ints[1] = useTime;
                    isRightItemDic[originalRecord.is_right] = ints;
                }
                else
                {
                    ints[0] = count;
                    ints[1] = useTime;
                    isRightItemDic.Add(originalRecord.is_right, ints);
                }
            }
            isRightItemDic.OrderBy(o => o.Key).ToDictionary(o => o.Key, p => p.Value);
            List<object> scoreList = new List<object>();
            List<int> countList = new List<int>();
            List<int> avgTimeList = new List<int>();
            List<object> groupAvgTimeList = new List<object>();
            foreach (Boolean key in isRightItemDic.Keys)
            {
                scoreList.Add(key);
                int[] ints = isRightItemDic[key];
                int count = ints[0];
                int useTime = ints[1];
                countList.Add(count);
                int avgTime = 0;
                if (count != 0 && useTime != 0) avgTime = useTime / count;
                avgTimeList.Add(avgTime);

                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic.Add("name", key);
                dic.Add("avgTime", avgTime);
                groupAvgTimeList.Add(dic);
            }
            Dictionary<string, object> echartMap = new Dictionary<string, object>();
            echartMap.Add("scoreList", scoreList);
            echartMap.Add("countList", countList);
            echartMap.Add("avgTimeList", avgTimeList);
            echartMap.Add("groupAvgTimeList", groupAvgTimeList);
            return echartMap;
        }

        /// <summary>
        /// 主观题赋分模式统计相关图表数据
        /// </summary>
        /// <param name="originalRecordList"></param>
        /// <returns></returns>
        private static Dictionary<string, object> subjectiveQuestionScoreEchart(List<ErOriginalRecord> originalRecordList)
        {
            Dictionary<string, object> echartMap = new Dictionary<string, object>();
            Dictionary<double, int[]> scoreItemDic = new Dictionary<double, int[]>();
            foreach (ErOriginalRecord originalRecord in originalRecordList)
            {
                if (originalRecord.student_score == null)
                {
                    continue;
                }
                double studentScore = (double)originalRecord.student_score;
                int[] ints = new int[2];
                int count = 1;
                int useTime = 0;
                if (scoreItemDic.ContainsKey(studentScore))
                {
                    ints = scoreItemDic[studentScore];
                    count = ints[0];
                    count++;
                    ints[0] = count;
                    useTime = ints[1];
                    useTime = useTime + (originalRecord.use_time == null ? 0 : (int)originalRecord.use_time);
                    ints[1] = useTime;
                    scoreItemDic[studentScore] = ints;
                }
                else
                {
                    ints[0] = count;
                    ints[1] = useTime;
                    scoreItemDic.Add(studentScore, ints);
                }
            }
            scoreItemDic.OrderBy(o => o.Key).ToDictionary(o => o.Key, p => p.Value);
            List<string> scoreList = new List<string>();
            List<int> countList = new List<int>();
            List<int> avgTimeList = new List<int>();
            List<object> groupAvgTimeList = new List<object>();
            foreach (double key in scoreItemDic.Keys)
            {
                scoreList.Add(key.ToString());
                int[] ints = scoreItemDic[key];
                int count = ints[0];
                int useTime = ints[1];
                countList.Add(count);
                int avgTime = 0;
                if (count != 0 && useTime != 0) avgTime = useTime / count;
                avgTimeList.Add(avgTime);
                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic.Add("name", key.ToString());
                dic.Add("avgTime", avgTime);
                groupAvgTimeList.Add(dic);
            }
            
            echartMap.Add("scoreList", scoreList);
            echartMap.Add("countList", countList);
            echartMap.Add("avgTimeList", avgTimeList);
            echartMap.Add("groupAvgTimeList", groupAvgTimeList);
            return echartMap;
        }

        /// <summary>
        /// 客观题相关图表数据
        /// </summary>
        /// <param name="questionRecord"></param>
        /// <param name="originalRecordList"></param>
        /// <returns></returns>
        private static List<Dictionary<string, object>> objectiveQuestionEcharts(ErAllStudentQuestionRecord questionRecord, List<ErOriginalRecord> originalRecordList)
        {
            //客观题显示饼状图
            List<Dictionary<string, object>> echartList = new List<Dictionary<string, object>>();
            Dictionary<string, int> valueItemCountDic = new Dictionary<string, int>();
            Dictionary<string, int> useTimeDic = new Dictionary<string, int>();
            foreach (ErOriginalRecord originalRecord in originalRecordList)
            {
                int count = 1;
                if (valueItemCountDic.ContainsKey(originalRecord.answer))
                {
                    count = valueItemCountDic[originalRecord.answer];
                    count++;
                    valueItemCountDic[originalRecord.answer] = count;
                }
                else
                {
                    valueItemCountDic.Add(originalRecord.answer, count);
                }
                int useTime = 0;
                if (useTimeDic.ContainsKey(originalRecord.answer))
                {
                    useTime = useTimeDic[originalRecord.answer];
                    useTime = useTime + (originalRecord.use_time == null ? 0 : (int)originalRecord.use_time);
                    useTimeDic[originalRecord.answer] = useTime;
                }
                else
                {
                    useTime = originalRecord.use_time == null ? 0 : (int)originalRecord.use_time;
                    useTimeDic.Add(originalRecord.answer, useTime);
                }
            }
            Dictionary<string, object> echartMap;
            foreach (string key in valueItemCountDic.Keys)
            {
                echartMap = new Dictionary<string, object>();
                echartMap.Add("name", key);
                echartMap.Add("value", valueItemCountDic[key].ToString());
                int avgTime = 0;
                if (valueItemCountDic[key] != 0 && useTimeDic.ContainsKey(key)) avgTime = useTimeDic[key] / valueItemCountDic[key];
                echartMap.Add("avgTime", avgTime);
                echartMap.Add("percent", double.Parse(((double)valueItemCountDic[key] / (double)originalRecordList.Count()).ToString("0.00")));
                echartList.Add(echartMap);
            }
            int? noAnswerCount = questionRecord.total_count - questionRecord.right_count - questionRecord.error_count;
            if (noAnswerCount > 0) {
                echartMap = new Dictionary<string, object>();
                echartMap.Add("value", noAnswerCount.ToString());
                echartMap.Add("name", "未作答");
                echartMap.Add("percent", double.Parse(((double)noAnswerCount / (double)originalRecordList.Count()).ToString("0.00")));
                echartMap.Add("avgTime", "0");
                echartList.Add(echartMap);
            }
           
            return echartList;
        }

        public List<object> OnePracticeQuestionBaseInfo(String practiceRecordId)
        {
            List<object> result = new List<object>();
            List<ErAllStudentQuestionRecord> questionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(practiceRecordId);
            if (questionRecords == null || questionRecords.Count() <= 0) return result;
            int i = 1;
            foreach (ErAllStudentQuestionRecord record in questionRecords)
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic.Add("index", "第" + i + "题");
                dic.Add("question_id", record.question_id);
                dic.Add("exercise_record_id", record.exercise_record_id);
                dic.Add("score", record.score == null ? 0 : (int)record.score);
                dic.Add("student_avg_score", record.student_avg_score == null ? 0 : (int)record.student_avg_score);
                dic.Add("avg_time", record.avg_time == null ? 0 : (int)record.avg_time);
                dic.Add("degree_of_difficulty", record.degree_of_difficulty == null ? 0 : (double)record.degree_of_difficulty);
                dic.Add("difficultyName", GetDiscriminationName(record.degree_of_difficulty));
                dic.Add("discrimination", record.discrimination == null ? 0 : (double)record.discrimination);
                dic.Add("discriminationName", GetDiscriminationName(record.discrimination));
                dic.Add("right_count", record.right_count == null ? 0 : (int)record.right_count);
                dic.Add("error_count", record.error_count == null ? 0 : (int)record.error_count);
                dic.Add("max_item", record.max_item);
                result.Add(dic);
                i++;
            }
            return result;
        }


        /**
       * 更新班级单题分析记录
       * */
        public void UpdateAllStudentQuestionRecord(string exerciseRecordId)
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
            if(allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return;
            }
            //将学生反馈结果拼成dictionary
            Dictionary<string, List<ErOriginalRecord>> dicOr = new Dictionary<string, List<ErOriginalRecord>>();
            foreach (IGrouping<string, ErOriginalRecord> group in originalStudentRecords.GroupBy(s => s.question_id))
            {
                dicOr.Add(group.Key, group.ToList<ErOriginalRecord>());
            }

            //将学生单题作答分析拼成dictionary
            Dictionary<string, List<ErSingleStudentQuestionRecord>> dic = new Dictionary<string, List<ErSingleStudentQuestionRecord>>();
            foreach (IGrouping<string, ErSingleStudentQuestionRecord> group in singleStudentQuestionRecords.GroupBy(s => s.question_id))
            {
                dic.Add(group.Key, group.ToList<ErSingleStudentQuestionRecord>());
            }

            var allTime = originalStudentRecords.Select(o => o.use_time).Sum();
            var allButtonCount = originalStudentRecords.Select(o => o.button_count).Sum();
            var allWriteCount = originalStudentRecords.Select(o => o.write_count).Sum();
            var t1 = (double)allTime / allStudentQuestionRecords.Count();
            var n2 = (double)(allButtonCount + allWriteCount) / allStudentQuestionRecords.Count() / allTime;

            foreach (ErAllStudentQuestionRecord all in allStudentQuestionRecords)
            {
                dic.TryGetValue(all.question_id, out List<ErSingleStudentQuestionRecord> singleRecords);
                if (singleRecords != null && singleRecords.Count() > 0)
                {
                    //认知度
                    var sumMasteryLevel = singleRecords.Select(s => s.mastery_level).Sum();
                    all.awareness = sumMasteryLevel / singleRecords.Count();

                    //认知指数
                    var totalCog = singleRecords.Select(s => (s.deterministic_direct_feedback_score + s.deterministic_indirect_feedback_score) * (s.degree_of_difficulty == 0 ? 1 : s.degree_of_difficulty)).Sum();
                    double? cog = totalCog / singleRecords.Count();
                    if(cog > 0)
                    {
                        all.cognitive_index = cog;
                    }
                    else
                    {
                        all.cognitive_index = 0;
                    }
                }
                dicOr.TryGetValue(all.question_id, out List<ErOriginalRecord> oriList);
                double t2 = 0;
                double? n1 = 0;
                if (oriList != null && oriList.Count() > 0)
                {
                    int count = oriList.Where(e => e.is_right).Count();
                    all.right_proportion = count / oriList.Count;
                    int time = (int)oriList.Select(e => e.use_time).Sum();
                    all.right_avg_time = (time / oriList.Count);
                    //得分率
                    var totalScore = oriList.Select(o => o.student_score).Sum();
                    double? scoring_average = totalScore / (all.score * oriList.Count());
                    if (scoring_average > 0)
                    {
                        all.scoring_average = scoring_average;
                    }
                    else
                    {
                        all.scoring_average = 0;
                    }
                    var totalTime = oriList.Select(o => o.use_time).Sum();
                    t2 = (double)totalTime / oriList.Count();
                    var totalButtonCount = oriList.Select(o => o.button_count).Sum();
                    var totalWriteCount = oriList.Select(o => o.write_count).Sum();
                    n1 = (double)(totalButtonCount + totalWriteCount) / oriList.Count() / totalTime;
                }

                var R = all.awareness;
                double T = logistic(t1 / t2);
                double? N = logistic(n1 / n2);
                //接纳度
                double acceptance = logistic(R + T + N);
                if (acceptance > 0)
                {
                    all.acceptance = logistic(R + T + N);
                }
                else
                {
                    all.acceptance = 0;
                }
                all.update_time = DateTime.Now;
                APP.IDatas.ErAllStudentQuestionRecord.Update<ErAllStudentQuestionRecord>(all);
            }
            //更新allStudentQuestionRecords
        }

        /**
         * Dashboard Chart
         * */
        public Dictionary<string, object> DashboardChartStatistics(string exerciseRecordId, string questionId)
        {
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            var questionRecord = APP.IDatas.ErAllStudentQuestionRecord.oneByExerciseRecoedIdAndQuestionId(exerciseRecordId, questionId);
            if (questionRecord == null) return resultDic;
            resultDic.Add("degreeOfDifficulty", questionRecord.degree_of_difficulty);
            String degreeOfDifficultyName = GetDegreeOfDifficultyName(questionRecord.degree_of_difficulty);
            resultDic.Add("degreeOfDifficultyName", degreeOfDifficultyName);
            resultDic.Add("discrimination", questionRecord.discrimination);
            String discriminationName = GetDiscriminationName(questionRecord.discrimination);
            resultDic.Add("discriminationName", discriminationName);
            double? masteryProportion = questionRecord.mastery_proportion;
            resultDic.Add("masteryProportion", masteryProportion);
            double masteryProportionLabel = Math.Round((double)questionRecord.mastery_proportion / 2, 1, MidpointRounding.AwayFromZero);
            resultDic.Add("masteryProportionLabel", (masteryProportionLabel * 100).ToString());
            resultDic.Add("unableMasteryProportion", 1 - masteryProportion);
            double unableMasteryProportionLabel = Math.Round((double)(1 + masteryProportion) / 2, 1, MidpointRounding.AwayFromZero);
            resultDic.Add("unableMasteryProportionLabel", (unableMasteryProportionLabel * 100).ToString());
            return resultDic;
        }

        /**
         * FunnelFigure Chart
         * */
        public Dictionary<string, object> FunnelFigureChartStatistics(string exerciseRecordId, string questionId)
        {
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            var questionRecord = APP.IDatas.ErAllStudentQuestionRecord.oneByExerciseRecoedIdAndQuestionId(exerciseRecordId, questionId);
            if (questionRecord == null) return resultDic;
            resultDic.Add("worseProportion", questionRecord.worse_proportion);
            resultDic.Add("badProportion", questionRecord.bad_proportion);
            resultDic.Add("goodProportion", questionRecord.good_proportion);
            resultDic.Add("greatProportion", questionRecord.great_proportion);
            resultDic.Add("perfectProportion", questionRecord.perfect_proportion);
            return resultDic;
        }

        /**
         * MultiDimensional Chart
         * */
        public Dictionary<string, object> MultiDimensionalChartStatistics(string exerciseRecordId)
        {
            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if(allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> prefectList = new List<object>(allStudentQuestionRecords.Count);
            List<object> greatList = new List<object>(allStudentQuestionRecords.Count);
            List<object> goodList = new List<object>(allStudentQuestionRecords.Count);
            List<object> badList = new List<object>(allStudentQuestionRecords.Count);
            List<object> worseList = new List<object>(allStudentQuestionRecords.Count);
            List<object> nameList = new List<object>(allStudentQuestionRecords.Count);
            int number = 0;
            foreach (var all in allStudentQuestionRecords)
            {
                prefectList.Add("-");
                greatList.Add("-");
                goodList.Add("-");
                badList.Add("-");
                worseList.Add("-");
                number++;
                int i = number;
                nameList.Add("第" + i.ToString() + "题");
                if(all.awareness > 0.8 && all.awareness <= 1)
                {
                    prefectList[number - 1] = all.awareness;
                }
                else if (all.awareness > 0.6 && all.awareness <= 0.8)
                {
                    greatList[number - 1] = all.awareness;
                }
                else if (all.awareness > 0.5 && all.awareness <= 0.6)
                {
                    goodList[number - 1] = all.awareness;
                }
                else if (all.awareness > 0.2 && all.awareness <= 0.5)
                {
                    badList[number - 1] = all.awareness;
                }
                else if (all.awareness >= 0 && all.awareness <= 0.2)
                {
                    worseList[number - 1] = all.awareness;
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
            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
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
            int number = 0;
            foreach (var all in allStudentQuestionRecords)
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
                number++;
                int i = number;
                nameList.Add("第" + i + "题");
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
            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> discrimination = new List<object>();
            List<object> degreeOfDifficulty = new List<object>();
            List<object> scoringAverage = new List<object>();
            List<object> awareness = new List<object>();
            List<object> acceptance = new List<object>();
            List<object> nameList = new List<object>();
            var number = 0;
            double discriminationTotal = 0;
            double degreeOfDifficultyTotal = 0;
            double scoringAverageTotal = 0;
            double awarenessTotal = 0;
            double acceptanceTotal = 0;
            foreach (var all in allStudentQuestionRecords)
            {
                discriminationTotal += all.discrimination == null ? 0: (double)all.discrimination;
                degreeOfDifficultyTotal += all.degree_of_difficulty == null ? 0 : (double)all.degree_of_difficulty;
                scoringAverageTotal += all.scoring_average == null ? 0 : (double)all.scoring_average;
                awarenessTotal += all.awareness == null ? 0 : (double)all.awareness;
                acceptanceTotal += all.acceptance == null ? 0 : (double)all.acceptance;
                discrimination.Add(all.discrimination);
                degreeOfDifficulty.Add(all.degree_of_difficulty);
                scoringAverage.Add(all.scoring_average);
                awareness.Add(all.awareness);
                acceptance.Add(all.acceptance);
                number++;
                int i = number;
                nameList.Add("第" + i + "题");
               
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

            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            List<object> sureList = new List<object>();
            List<object> notSureList = new List<object>();
            List<object> nameList = new List<object>();
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return resultDic;
            }
            var number = 0;
            foreach (var all in allStudentQuestionRecords)
            {

                string awarenessName = GetAwarenessName(all.awareness);
                List<object> singleList = new List<object>();
                number++;
                int i = number;
                nameList.Add("第" + i + "题");
                if (all.awareness > 0.5)
                {
                    singleList = new List<object>();
                    singleList.Add("第" + i + "题");
                    singleList.Add(all.degree_of_difficulty * 10);
                    singleList.Add(all.awareness * 10);
                    sureList.Add(singleList);
                }
                else
                {
                    singleList = new List<object>();
                    singleList.Add("第" + i + "题");
                    singleList.Add(all.degree_of_difficulty * 10);
                    singleList.Add(all.awareness * 10);
                    notSureList.Add(singleList);
                }
            }
            resultDic.Add("sure", sureList);
            resultDic.Add("notSure", notSureList);
            resultDic.Add("nameList", nameList);
            return resultDic;
        }

        /**
        * RadarDiagramChart
        * */
        public Dictionary<string, object> RadarChartStatistics(string exerciseRecordId)
        {

            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> name = new List<object>();
            List<object> totalScore = new List<object>();
            List<object> awareness = new List<object>();
            List<object> scoringAverage = new List<object>();
            var number = 0;
            foreach (var all in allStudentQuestionRecords)
            {
                number++;
                int i = number;
                name.Add("第" + i + "题");
                totalScore.Add(1);
                awareness.Add(all.awareness);
                scoringAverage.Add(all.scoring_average);
            }
            resultDic.Add("name", name);
            resultDic.Add("totalScore", totalScore);
            resultDic.Add("awareness", awareness);
            resultDic.Add("scoringAverage", scoringAverage);
            return resultDic;
        }

        /**
         * CognitiveIndexChart
         * */
        public Dictionary<string, object> CognitiveIndexChartStatistics(string exerciseRecordId)
        {

            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            if (allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return resultDic;
            }
            List<object> cognitiveIndex = new List<object>();
            List<object> nameList = new List<object>();
            var number = 0;
            foreach (var all in allStudentQuestionRecords)
            {
                cognitiveIndex.Add(all.cognitive_index);
                number++;
                int i = number;
                nameList.Add("第" + i + "题");
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
    }
}
