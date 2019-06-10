using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Api
{
    /// <summary>
    /// API接口客户端
    /// </summary>
    public class ApiClient : ClientBase
    {
        /// <summary>
        /// 登录认证/获取TOKEN
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MSResult<ApiModels.Token> AuthToken(object data)
        {
            return this.Request<ApiModels.Token>("POST", MSTYPE.HOST.LW_AUTHZ_SERVER, "/oauth/token", data);
        }
        /// <summary>
        /// 获取当前登录用户的信息
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MSResult<ApiModels.AuthInfo> AccountAuthInfo()
        {
            return this.Request<ApiModels.AuthInfo>("GET", MSTYPE.HOST.LW_GARDEN_SERVER, "/account/auth-info");
        }
        /// <summary>
        /// 获取登录讲师所在园区的班级列表
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MSResult<List<ApiModels.Classes>> OrganizationTeacherGardenClasses(int gardenId, int teacherId)
        {
            return this.Request<List<ApiModels.Classes>>("GET", MSTYPE.HOST.LW_TPK_SERVER, "/organization/teacher/garden/classes", new
            {
                gardenId,
                teacherId
            });
        }
        /// <summary>
        /// 获取班级下的学生列表
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MSResult<List<ApiModels.Student>> StudentClassStudents(int gardenId, int classId, string keyWord)
        {
            return this.Request<List<ApiModels.Student>>("GET", MSTYPE.HOST.LW_GARDEN_SERVER, "/student/class/students", new
            {
                gardenId,
                classId,
                keyWord
            });
        }
        /// <summary>
        /// 获取试卷下的习题列表
        /// </summary>
        /// <param name="gardenId"></param>
        /// <param name="practicePaperId"></param>
        /// <returns></returns>
        public MSResult QuestionOfPracticePaper(int gardenId, long practicePaperId, Action<List<ApiModels.QuestionPractice>> action)
        {
            var result = this.Request<List<ApiModels.QuestionPractice>>("GET", MSTYPE.HOST.LW_CLASS_INTERACTION_SERVER, "/question/practice-paper/question-of-practice-paper", new
            {
                gardenId,
                practicePaperId
            });
            if (result.flag)
            {
                action(result.data);
                return MSResult.Init();
            }
            else
            {
                return MSResult.Init(result.msg);
            }
        }
        /// <summary>
        /// 获取试卷下每道题的阶段属性
        /// </summary>
        /// <param name="gardenId"></param>
        /// <param name="practicePaperId"></param>
        /// <param name="questionId"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        public MSResult GetQuestionProperties(int gardenId, long practicePaperId, long questionId, Action<ApiModels.QuestionProperties> action)
        {
            var result = this.Request<ApiModels.QuestionProperties>("GET", MSTYPE.HOST.LW_CLASS_INTERACTION_SERVER, "/practice-paper-question/relation/get-question-properties", new
            {
                gardenId,
                practicePaperId,
                questionId
            });
            if (result.flag)
            {
                action(result.data);
                return MSResult.Init();
            }
            else
            {
                return MSResult.Init(result.msg);
            }
        }

        /// <summary>
        /// 获取当前学年信息
        /// </summary>
        /// <param name="gardenId"></param>
        /// <returns></returns>
        public MSResult<ApiModels.Academic.Current> AcademicCurrent(int gardenId)
        {
            return this.Request<ApiModels.Academic.Current>("GET", MSTYPE.HOST.LW_GARDEN_SERVER, "/academic/current", new
            {
                gardenId
            });
        }
    }
}
