using MLPen.Repository.Entitys;
using MLPen.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class PracticeRecordStatisticsService : IAutofac
    {
        public Dictionary<string, object> List(int? gardenId, int? gradeId, int? type, string keyWord, int? noPage, int? size)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            List<ErPaperPracticeRecord> erPracticeRecords =  APP.IDatas.ErPracticeRecord.list(gardenId, gradeId, type, keyWord, noPage, size);
            long count = APP.IDatas.ErPracticeRecord.count(gardenId, gradeId, type, keyWord);
            result.Add("erPracticeRecords", erPracticeRecords);
            result.Add("totalCount", count);
            return result;
        }

        #region 班级单次练习结果统计 试题维度柱状图
        /// <summary>
        /// 班级单次练习结果统计 试题维度柱状图
        /// </summary>
        /// <param name="practiceRecordId">练习卷ID</param>
        /// <returns></returns>
        public Dictionary<string, object> practiceRecordStatistics(string practiceRecordId)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            List<ErAllStudentQuestionRecord> studentQuestionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId(practiceRecordId);
            List<string> questionIndexList = new List<string>();
            List<int> rightCountList = new List<int>();
            List<int> avgTimeList = new List<int>();
            if (studentQuestionRecords != null && studentQuestionRecords.Count() > 0)
            {
               
                int i = 0;
                foreach (ErAllStudentQuestionRecord studentQuestionRecord in studentQuestionRecords)
                {
                    i++;
                    questionIndexList.Add("第" + i + "题");
                    rightCountList.Add(studentQuestionRecord.right_count == null ? 0 : (int)studentQuestionRecord.right_count);
                    avgTimeList.Add(studentQuestionRecord.avg_time == null ? 0 : (int)studentQuestionRecord.avg_time);

                }
            }
            result.Add("index", questionIndexList);
            result.Add("rightCount", rightCountList);
            result.Add("avgTime", avgTimeList);
            return result;
        }
        #endregion


        public List<object> OneQuestionOriginalRecordList(string practiceRecordId, string questionId, string studentAnswer, double? studentScore, Boolean? studentIsRight)
        {
            List<object> result = new List<object>();
            List<ErOriginalRecord> originalRecordList = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId(practiceRecordId, questionId, studentAnswer, studentScore, studentIsRight);
            if(originalRecordList==null || originalRecordList.Count() <= 0)
            {
                return result;
            }
            var studentList = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByExerciseRecordId(practiceRecordId);
            if (studentList == null || studentList.Count() <= 0)
            {
                return result;
            }
            foreach (ErOriginalRecord record in originalRecordList)
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();
                dic.Add("student_id", record.student_id);
                foreach (ErPaperPracticeRecordStudentSealUp studentSealUp in studentList)
                {
                    if (studentSealUp.student_id.Equals(record.student_id))
                    {
                        dic.Add("student_number", studentSealUp.student_number);
                        dic.Add("student_name", studentSealUp.student_name);
                        break;
                    }
                }
                dic.Add("answer", record.answer);
                dic.Add("student_score", record.student_score);
                dic.Add("is_right", record.is_right);
                dic.Add("use_time", record.use_time);
                result.Add(dic);
            }
            return result;
        }


    }
}
