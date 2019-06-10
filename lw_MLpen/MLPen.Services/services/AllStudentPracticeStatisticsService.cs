using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class AllStudentPracticeStatisticsService : IAutofac
    {
        /**
         * Dashboard Chart
         * */
        public Dictionary<string, object> AllDashboardStatistics(string exerciseRecordId, int type)
        {
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            var practiceRecord = APP.IDatas.ErAllStudentPracticeRecord.OneByExerciseRecordId(exerciseRecordId);
            if (practiceRecord == null) return resultDic;
            resultDic.Add("degreeOfDifficulty", practiceRecord.degree_of_difficulty);
            String degreeOfDifficultyName = GetDegreeOfDifficultyName(practiceRecord.degree_of_difficulty);
            resultDic.Add("degreeOfDifficultyName", degreeOfDifficultyName);
            resultDic.Add("discrimination", practiceRecord.discrimination);
            String discriminationName = GetDiscriminationName(practiceRecord.discrimination);
            resultDic.Add("discriminationName", discriminationName);
            double? plenary;
            if (type == 1)
            {
                plenary = practiceRecord.avg_plenary;
            }
            else
            {
                plenary = practiceRecord.low_plenary;
            }
            resultDic.Add("masteryProportion", plenary);
            double masteryProportionLabel = Math.Round((double)plenary / 2, 1, MidpointRounding.AwayFromZero);
            resultDic.Add("masteryProportionLabel", (masteryProportionLabel * 100).ToString());
            resultDic.Add("unableMasteryProportion", 1 - plenary);
            double unableMasteryProportionLabel = Math.Round((1 + (double)plenary) / 2, 1, MidpointRounding.AwayFromZero);
            resultDic.Add("unableMasteryProportionLabel", (unableMasteryProportionLabel * 100).ToString());
            return resultDic;
        }

        /**
         * FunnelFigure Chart
         * */
        public Dictionary<string, object> FunnelFigureChartStatistics(string exerciseRecordId, int type)
        {
            Dictionary<string, object> resultDic = new Dictionary<string, object>();
            var practiceRecord = APP.IDatas.ErAllStudentPracticeRecord.OneByExerciseRecordId(exerciseRecordId);
            if (practiceRecord == null) return resultDic;
            double? worseProportion;
            double? badProportion;
            double? goodProportion;
            double? greatProportion;
            double? perfectProportion;
            if (type == 1)
            {
                worseProportion = practiceRecord.worse_proportion_avg;
                badProportion = practiceRecord.bad_proportion_avg;
                goodProportion = practiceRecord.good_proportion_avg;
                greatProportion = practiceRecord.great_proportion_avg;
                perfectProportion = practiceRecord.perfect_proportion_avg;
            }
            else
            {
                worseProportion = practiceRecord.worse_proportion_low ;
                badProportion = practiceRecord.bad_proportion_low;
                goodProportion = practiceRecord.good_proportion_low;
                greatProportion = practiceRecord.great_proportion_low;
                perfectProportion = practiceRecord.perfect_proportion_low;
            }
            resultDic.Add("worseProportion", worseProportion);
            resultDic.Add("badProportion", badProportion);
            resultDic.Add("goodProportion", goodProportion);
            resultDic.Add("greatProportion", greatProportion);
            resultDic.Add("perfectProportion", perfectProportion);
            return resultDic;
        }

        /**
        * 获取班级习题卷练习记录
        * */
        public void SaveAllStudentPracticeRecord(string exerciseRecordId)
        {
            var allStudentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(exerciseRecordId);
            if(allStudentQuestionRecords == null && allStudentQuestionRecords.Count <= 0)
            {
                return;
            }
            var singleStudentPracticeRecords = APP.IDatas.ErSingleStudentPracticeRecord.ListByExerciseRecordId(exerciseRecordId);
            if(singleStudentPracticeRecords == null && singleStudentPracticeRecords.Count <= 0)
            {
                return;
            }
            var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if(practiceRecord == null)
            {
                return;
            }

            var allStudentPracticeRecord = new ErAllStudentPracticeRecord();
            if (practiceRecord != null)
            {
                allStudentPracticeRecord.id = practiceRecord.id + "_" + GetTimeStamp();
                allStudentPracticeRecord.exercise_record_id = practiceRecord.id;
                allStudentPracticeRecord.practice_paper_id = practiceRecord.paper_id;
                allStudentPracticeRecord.practice_paper_name = practiceRecord.paper_name;
                allStudentPracticeRecord.create_time = DateTime.Now;
                allStudentPracticeRecord.update_time = DateTime.Now;
            }
            if (singleStudentPracticeRecords != null && singleStudentPracticeRecords.Count > 0)
            {
                //就低原则全会所占比例
                int lowCount = singleStudentPracticeRecords.Where(s => s.mastery_level_low > 0.5).Count();
                allStudentPracticeRecord.low_plenary = (double)lowCount / singleStudentPracticeRecords.Count;
                //平均分原则全会所占比例
                int avgCount = singleStudentPracticeRecords.Where(s => s.mastery_level_avg > 0.5).Count();
                allStudentPracticeRecord.avg_plenary = (double)avgCount / singleStudentPracticeRecords.Count();
            }
            if (allStudentQuestionRecords != null && allStudentQuestionRecords.Count() > 0)
            {
                //难度系数
                double? totalDiff = allStudentQuestionRecords.Select(e => e.degree_of_difficulty).Sum();
                allStudentPracticeRecord.degree_of_difficulty = totalDiff / allStudentQuestionRecords.Count();
                //区分度
                double? totalDiscrimination = allStudentQuestionRecords.Select(e => e.discrimination).Sum();
                allStudentPracticeRecord.discrimination = totalDiscrimination / allStudentQuestionRecords.Count();
            }
            // 就低原则
            int worseCountLow = singleStudentPracticeRecords.Where(e => e.mastery_level_low >= 0 && e.mastery_level_low <= 0.2).Count();
            int badCountLow = singleStudentPracticeRecords.Where(e => e.mastery_level_low > 0.2 && e.mastery_level_low <= 0.5).Count();
            int goodCountLow = singleStudentPracticeRecords.Where(e => e.mastery_level_low > 0.5 && e.mastery_level_low <= 0.6).Count();
            int greatCountLow = singleStudentPracticeRecords.Where(e => e.mastery_level_low > 0.6 && e.mastery_level_low <= 0.8).Count();
            int perfectCountLow = singleStudentPracticeRecords.Where(e => e.mastery_level_low > 0.8 && e.mastery_level_low <= 1).Count();
            allStudentPracticeRecord.worse_proportion_low = (double)worseCountLow / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.bad_proportion_low = (double)badCountLow / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.good_proportion_low = (double)goodCountLow / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.great_proportion_low = (double)greatCountLow / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.perfect_proportion_low = (double)perfectCountLow / singleStudentPracticeRecords.Count();

            //平均原则
            int worseCountAvg = singleStudentPracticeRecords.Where(e => e.mastery_level_avg >= 0 && e.mastery_level_avg <= 0.2).Count();
            int badCountAvg = singleStudentPracticeRecords.Where(e => e.mastery_level_avg > 0.2 && e.mastery_level_avg <= 0.5).Count();
            int goodCountAvg = singleStudentPracticeRecords.Where(e => e.mastery_level_avg > 0.5 && e.mastery_level_avg <= 0.6).Count();
            int greatCountAvg = singleStudentPracticeRecords.Where(e => e.mastery_level_avg > 0.6 && e.mastery_level_avg <= 0.8).Count();
            int perfectCountAvg = singleStudentPracticeRecords.Where(e => e.mastery_level_avg > 0.8 && e.mastery_level_avg <= 1).Count();
            allStudentPracticeRecord.worse_proportion_avg = (double)worseCountAvg / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.bad_proportion_avg = (double)badCountAvg / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.good_proportion_avg = (double)goodCountAvg / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.great_proportion_avg = (double)greatCountAvg / singleStudentPracticeRecords.Count();
            allStudentPracticeRecord.perfect_proportion_avg = (double)perfectCountAvg / singleStudentPracticeRecords.Count();

            //保存
            APP.IDatas.ErAllStudentPracticeRecord.Insert<ErAllStudentPracticeRecord>(allStudentPracticeRecord);
        }


        /**
        * 练习卷历史记录标题
        * */
        public object PracticeResultTitle(string exerciseRecordId)
        {
           var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if (practiceRecord == null) return null;
            practiceRecord.week_name = GetWeekName(practiceRecord.week_day);
           return practiceRecord;
        }

        private string GetWeekName(int? week)
        {
            switch (week)
            {
                case 1:
                    return "一";
                case 2 :
                    return "二";
                case 3:
                    return "三";
                case 4:
                    return "四";
                case 5:
                    return "五";
                case 6:
                    return "六";
                case 7:
                    return "日";
                default:
                    return "";
            }
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
        * 生成时间戳
        */
        public static string GetTimeStamp()
        {
            long ts = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000;
            return ts.ToString();
        }
    }
}
