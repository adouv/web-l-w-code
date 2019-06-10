using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 全局学习
    /// </summary>
    public class MSStudySession
    {
        /// <summary>
        /// 园区ID
        /// </summary>
        public int GardenId { get; set; }
        /// <summary>
        /// 园区名称
        /// </summary>
        public string GardenName { get; set; }
        /// <summary>
        /// 当前前登录用户
        /// </summary>
        public ApiModels.AuthInfo Account { get; set; }
        /// <summary>
        /// 当前班级的所有学生列表
        /// </summary>
        public List<ApiModels.Student> AllStudents { get; set; }
        /// <summary>
        /// 参与学习的学生ID
        /// </summary>
        public List<long> StudentIds { get; private set; }
        /// <summary>
        /// 练习卷ID
        /// </summary>
        public long PracticeId { get; private set; }
        /// <summary>
        /// 练习题ID（原始ID）
        /// </summary>
        public long QuestionID { get; private set; }
        /// <summary>
        /// 练习卷记录ID（exercise_record_id）
        /// </summary>
        public string PracticeRecordId { get; private set; }
        /// <summary>
        /// 练习题所在阶段
        /// </summary>
        public int QuestionStepNumber { get; private set; }

        /// <summary>
        /// 是否正在答题
        /// </summary>
        public bool IsAnswer { get; private set; }
        /// <summary>
        /// 是否正在自判
        /// </summary>
        public bool IsSelfJudgment { get; private set; }

        #region 方法
        /// <summary>
        /// 开始学习
        /// </summary>
        /// <param name="studentIds"></param>
        public void StartStudy(List<long> studentIds, long practiceId, string practiceRecordId)
        {
            this.StudentIds = studentIds;
            this.PracticeId = practiceId;
            this.PracticeRecordId = practiceRecordId;
        }
        /// <summary>
        /// 退出学习（退出做题）
        /// </summary>
        public void ExitStudy()
        {
            StopAnswer();
            StopSelfJudgment();

            this.StudentIds.Clear();
            this.PracticeId = 0;
            this.PracticeRecordId = string.Empty;
            this.QuestionID = 0;
        }
        /// <summary>
        /// 获取正在参与学习的学生列表
        /// </summary>
        /// <returns></returns>
        public List<ApiModels.Student> GetStudyStudents()
        {                                                                                         
            return AllStudents.Where(m => StudentIds.Any(c => m.id == c)).ToList();
        }
        /// <summary>
        /// 获取正在参与学习的学生
        /// </summary>
        /// <returns></returns>
        public ApiModels.Student GetStudyStudent(long studentId)
        {
            return AllStudents.Where(m => m.id == studentId).FirstOrDefault();
        }
        /// <summary>
        /// 更新当前的习题ID
        /// </summary>
        public void UpdateQuestion(long questionID, int questionStepNumber)
        {
            this.QuestionID = questionID;
            this.QuestionStepNumber = questionStepNumber;
        }

        /// <summary>
        /// 开始答题
        /// </summary>
        /// <param name="questionIndex">习题的索引</param>
        /// <param name="questionID">习题ID</param>
        public void StartAnswer()
        {
            this.IsAnswer = true;
        }
        /// <summary>
        /// 结束答题
        /// </summary>
        /// <param name="questionIndex">习题的索引</param>
        /// <param name="questionID">习题ID</param>
        public void StopAnswer()
        {
            this.IsAnswer = false;
        }
        /// <summary>
        /// 开始自判
        /// </summary>
        public void StartSelfJudgment()
        {
            this.IsSelfJudgment = true;
        }
        /// <summary>
        /// 停止自判
        /// </summary>
        public void StopSelfJudgment()
        {
            this.IsSelfJudgment = false;
        }
        /// <summary>
        /// 指定学生是否正在参与学习
        /// </summary>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public bool HasStudy(long studentId)
        {
            return StudentIds.Any(m => m == studentId);
        }
        #endregion
    }
}
