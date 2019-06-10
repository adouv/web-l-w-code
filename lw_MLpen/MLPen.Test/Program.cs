using MLPen.ApiModels;
using MLPen.Helpers;
using MLPen.Repository.Entitys;
using MLPen.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            APP.Run();
            //List<StepOption> stepOptions = JsonHelper.ToObject<List<StepOption>>("[{\"content\":\"非常确定\",\"isAnswer\":false,\"option\":\"A\"},{\"content\":\"不太确定\",\"isAnswer\":false,\"option\":\"B\"},{\"content\":\"我猜测的\",\"isAnswer\":false,\"option\":\"C\"}]");
            //stepOptions.ForEach(step=> {
            //    Console.WriteLine(step.option);
            //    int a = 1;
            //});

            ErStudentButtonAnswerOriginalRecord record = new ErStudentButtonAnswerOriginalRecord();
            Console.WriteLine(record);
            Console.WriteLine(record.button_item);

            /*
            AllStudentQuestionStatisticsService allStudentQuestionStatisticsService = new AllStudentQuestionStatisticsService();
            Dictionary<string, object> dic = allStudentQuestionStatisticsService.oneQuestionRecordStatistics("1", "2");

            string jsonStr = MLPen.Helpers.JsonHelper.ToJSON(dic);

            Console.WriteLine(jsonStr);

            List<ErOriginalRecord> originalRecordList = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId("1", "2", null, null, null);
            jsonStr = MLPen.Helpers.JsonHelper.ToJSON(originalRecordList); */


            //PracticeRecordStatisticsService practiceRecordStatisticsService = new PracticeRecordStatisticsService();
            //Dictionary<string, object> result = practiceRecordStatisticsService.practiceRecordStatistics("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(result);
            //Console.WriteLine(jsonStr);

            //SingleStudentPracticeStatisticsService studentPracticeStatisticsService = new SingleStudentPracticeStatisticsService();
            //var result2 = studentPracticeStatisticsService.OnePracticeStudentOriginalStatistics("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(result2);
            //Console.WriteLine(jsonStr);

            //var result6 = allStudentQuestionStatisticsService.OnePracticeQuestionBaseInfo("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(result6);
            //Console.WriteLine(jsonStr);

            //AllStudentKnowledgeStatisticsService allStudentKnowledgeStatisticsService = new AllStudentKnowledgeStatisticsService();
            //var result3 = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeStatistics("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(result3);
            //Console.WriteLine(jsonStr);

            //var result4 = allStudentKnowledgeStatisticsService.OnePracticeKnowledgeBaseStatistics("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(result4);
            //Console.WriteLine(jsonStr);

            //List<ErAllStudentQuestionRecord> questionRecords = APP.IDatas.ErAllStudentQuestionRecord.listByExerciseRecordId("1");
            //jsonStr = MLPen.Helpers.JsonHelper.ToJSON(questionRecords);
            //Console.WriteLine(jsonStr);
            //List<ErOriginalRecord> records = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestionId("1", 1);

            //List<string> answerOptions = new List<string>();
            //answerOptions.Add("A");
            //answerOptions.Add("B");
            //answerOptions.Add("C");
            //answerOptions.Add("D");
            //List<string> secondOrderOptions = new List<string>();
            //secondOrderOptions.Add("A");
            //secondOrderOptions.Add("B");
            //secondOrderOptions.Add("C");
            //secondOrderOptions.Add("D");
            //List<string> thirdOrderOptions = new List<string>();
            //thirdOrderOptions.Add("A");
            //thirdOrderOptions.Add("B");
            //thirdOrderOptions.Add("C");
            //thirdOrderOptions.Add("D");
            //List<string> fourthOrderOptions = new List<string>();
            //fourthOrderOptions.Add("A");
            //fourthOrderOptions.Add("B");
            //fourthOrderOptions.Add("C");

            //Dictionary<long, string> studentNames = new Dictionary<long, string>();
            //studentNames.Add(1, "张三");
            //OriginalRecordService originalRecordService = new OriginalRecordService();
            //DiagnosticQuestion question = new DiagnosticQuestion();
            //question.question_id = 1;
            //question.content = "测试1";
            //question.question_type = 1;
            //question.answer = "A";
            //question.secondOrderAnswer = "";
            //question.thirdOrderAnswer = "C";
            //question.fourthOrderAnswer = "";
            //question.cognitive = "FOURTH_ORDER_COGNITIVE";
            //question.questionTotalScore = 10;
            //question.answerOptions = answerOptions;
            //question.secondOrderOptions = secondOrderOptions;
            //question.thirdOrderOptions = thirdOrderOptions;
            //question.fourthOrderOptions = fourthOrderOptions;
            //string json = originalRecordService.diagnosticAnalysis(records, question, "20190319");


            //Console.WriteLine("--------------\n" + json);

            //string strPwd = "lisi";
            //string solt = "lisi";
            //byte[] result = Encoding.Default.GetBytes(strPwd + solt);
            //MD5 md5 = new MD5CryptoServiceProvider();
            //byte[] output = md5.ComputeHash(result);
            //string pass = BitConverter.ToString(output).Replace("-", "");

            ////int? a = null;
            ////int b = a==null ? 0:(int)a;
            ////Console.WriteLine(pass);

            //string ss = md5Str(strPwd, solt);
            //string sss = md5Str(ss, solt);
            Console.WriteLine("--------------");
        }

        public static string md5Str(string strPwd, string salt)
        {
            var md5Csp = new MD5CryptoServiceProvider();
            byte[] md5Source = Encoding.UTF8.GetBytes(strPwd + salt);
            byte[] md5Out = md5Csp.ComputeHash(md5Source);
            string pwd = "";
            for (int i = 0; i < md5Out.Length; i++)
            {
                pwd += md5Out[i].ToString("x2");
            }
            string ss = pwd;
            return ss;
        }
    }
}
