using MLPen.Repository.Entitys;
using MLPen.Repository.Interfaces;
using MLPen.Helpers;
using MLPen.ApiModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace MLPen.Services
{
    /// <summary>
    /// 班级单道题作答记录分析service
    /// </summary>
    public class OriginalRecordService : IAutofac
    {

        /// <summary>
        /// 二阶认知程度反馈
        /// </summary>
        public const string SECOND_ORDER_COGNITIVE_DEGREE = "SECOND_ORDER_COGNITIVE_DEGREE";
        /// <summary>
        /// 二阶认知理由反馈
        /// </summary>
        public const string SECOND_ORDER_COGNITIVE_REASON = "SECOND_ORDER_COGNITIVE_REASON";
        /// <summary>
        /// 三阶认知
        /// </summary>
        public const string THIRD_ORDER_COGNITIVE = "THIRD_ORDER_COGNITIVE";
        /// <summary>
        /// 四阶认知
        /// </summary>
        public const string FOURTH_ORDER_COGNITIVE = "FOURTH_ORDER_COGNITIVE";


        public void analysisSingle(string exerciseRecordId, long questionId)
        {
            
            var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            if(questionSealUp == null)
            {
                return;
            }
            var originalStudentRecords = APP.IDatas.ErOriginalRecord.listByExerciseRecordIdAndQuestion(exerciseRecordId, questionSealUp.id);
            if(originalStudentRecords == null && originalStudentRecords.Count <= 0)
            {
                return;
            }
            DiagnosticQuestion diagnostic = new DiagnosticQuestion();
            diagnostic.question_id = questionSealUp.id;
            diagnostic.question_type = (null == questionSealUp.self_judgment_model) ?1:0;
            if(questionSealUp.self_judgment_model == 1)
            {
                diagnostic.questionTotalScore = (int)questionSealUp.self_judgment_full_score;
            }
            else
            {
                diagnostic.questionTotalScore = 1;
            }
            diagnostic.content = questionSealUp.first_step_stem;
            diagnostic.answer = questionSealUp.first_step_correct_option;
            diagnostic.secondOrderAnswer = questionSealUp.second_step_correct_option;
            diagnostic.thirdOrderAnswer = questionSealUp.third_step_correct_option;
            diagnostic.fourthOrderAnswer = questionSealUp.forth_step_correct_option;
            ///答案的选项集合
            List<string> answerOptions = new List<string>();
            ///二阶选项集合
            List<string> secondOrderOptions = new List<string>();
            ///三阶选项集合
            List<string> thirdOrderOptions = new List<string>();
            ///四阶选项集合
            List<string> fourthOrderOptions = new List<string>();
            if (!String.IsNullOrEmpty(questionSealUp.first_step_option))
            {
                diagnostic.answerOptions = questionSealUp.first_step_option.Split<string>(',').ToList();
            }
            if (diagnostic.answerOptions==null) {
                answerOptions.Add("A");
                answerOptions.Add("B");
                answerOptions.Add("C");
                answerOptions.Add("D");
                diagnostic.answerOptions = answerOptions;
            }
            if (null != questionSealUp.forth_step_option && !"".Equals(questionSealUp.forth_step_option))
            {
                List<StepOption> stepOptions = JsonHelper.ToObject<List<StepOption>>(questionSealUp.forth_step_option);
                stepOptions.ForEach(step => {
                    fourthOrderOptions.Add(step.option);
                });
            }
            if (!String.IsNullOrEmpty(questionSealUp.second_step_option))
            {
                List<StepOption> stepOptions = JsonHelper.ToObject<List<StepOption>>(questionSealUp.second_step_option);
                stepOptions.ForEach(step => {
                    secondOrderOptions.Add(step.option);
                });
                diagnostic.secondOrderOptions = secondOrderOptions;
            }
            if (!String.IsNullOrEmpty(questionSealUp.third_step_option))
            {
                List<StepOption> stepOptions = JsonHelper.ToObject<List<StepOption>>(questionSealUp.third_step_option);
                stepOptions.ForEach(step => {
                    thirdOrderOptions.Add(step.option);
                });
                diagnostic.thirdOrderOptions = thirdOrderOptions;
            }
            if (!String.IsNullOrEmpty(questionSealUp.forth_step_option))
            {
                List<StepOption> stepOptions = JsonHelper.ToObject<List<StepOption>>(questionSealUp.forth_step_option);
                stepOptions.ForEach(step => {
                    fourthOrderOptions.Add(step.option);
                });
                diagnostic.fourthOrderOptions = fourthOrderOptions;
            }
           
            diagnostic.cognitive = questionSealUp.question_stem_type;
            Random ran = new Random();
            int RandKey = ran.Next(1, 9);
            diagnostic.knowledge_id = RandKey;
            if(RandKey == 1)
            {
                diagnostic.knowledge_name = "细胞中的元素和化合物";
            }
            if (RandKey == 2)
            {
                diagnostic.knowledge_name = "细胞的分子组成";
            }
            if (RandKey == 3)
            {
                diagnostic.knowledge_name = "细胞膜系统的结构和功能";
            }
            if (RandKey == 4)
            {
                diagnostic.knowledge_name = "生物膜的流动镶嵌模型";
            }
            if (RandKey == 5)
            {
                diagnostic.knowledge_name = "核酸";
            }
            if (RandKey == 6)
            {
                diagnostic.knowledge_name = "水、无机盐";
            }
            if (RandKey == 7)
            {
                diagnostic.knowledge_name = "ATP";
            }
            if (RandKey == 8)
            {
                diagnostic.knowledge_name = "糖类、脂质";
            }

            diagnosticAnalysis(originalStudentRecords, diagnostic, exerciseRecordId);
        }

        /// <summary>
        /// 诊断分析
        /// </summary>
        /// <param name="studentList">学生集合</param>
        /// <param name="diagnosticQuestion">习题相关参数</param>
        /// <param name="practice_record_id">练习记录id</param>
        /// <returns></returns>
        public void diagnosticAnalysis(List<ErOriginalRecord> studentList, DiagnosticQuestion diagnosticQuestion, string practice_record_id)
        {
            if (studentList == null || studentList.Count <= 0 || diagnosticQuestion == null || string.IsNullOrEmpty(practice_record_id)) return;
            Dictionary<long, double> studentLogisticScores = new Dictionary<long, double>();
            Dictionary<long, DScoreItem> dScoreItems = new Dictionary<long, DScoreItem>();
            GroupSituation groupSituation = prepareDataForCalculateD(studentList, dScoreItems, diagnosticQuestion);
            double n = calculateScoreN(ValidateHelper.convertToNotNull(groupSituation.studentAverageScore), diagnosticQuestion.questionTotalScore);
            if (0==n) {
                n = 1;
            }
            //精通掌握人数
            int perfectNum = 0;
            //不太精通人数
            int greatNum = 0;
            //不是很熟
            int goodNum = 0;
            //一知半解
            int badNum = 0;
            //完全不会
            int worseNum = 0;
            int masteryNum = 0;
            int cognitiveMastery = 0;
            DateTime currentDate = DateTime.Now;
            string question_id = null;
            //全班学生得分
            double studentTotalScore = 0;
            //主观题：作答最多项和对应的人数，客观题：得分最多分数和对应的人数
            Dictionary<string, int> maxItems = new Dictionary<string, int>();
            List<ErSingleStudentQuestionRecord> singleStudentQuestionRecords = new List<ErSingleStudentQuestionRecord>();
            foreach (ErOriginalRecord student in studentList)
            {
                double q = calculateScoreQ(student, diagnosticQuestion);
                DScoreItem dScoreItem = new DScoreItem();
                dScoreItems.TryGetValue(ValidateHelper.convertToNotNull(student.student_id), out dScoreItem);
                double d = calculateScoreD(student, dScoreItem, groupSituation);
                double s = calculateScoreS();
                double score = logistic(q, d, s, n);
                if (!studentLogisticScores.ContainsKey(ValidateHelper.convertToNotNull(student.student_id))) {
                    studentLogisticScores.Add(ValidateHelper.convertToNotNull(student.student_id), score);
                }
                if(score > 0.5)
                {
                    masteryNum++;
                }
                if (score > 0.8 && score <= 1)
                {
                    perfectNum++;
                    cognitiveMastery = 4;
                }
                else if (score > 0.6 && score <= 0.8)
                {
                    greatNum++;
                    cognitiveMastery = 3;
                }
                else if (score > 0.5 && score <= 0.6)
                {
                    goodNum++;
                    cognitiveMastery = 2;
                }
                else if (score > 0.2 && score <= 0.5)
                {
                    badNum++;
                    cognitiveMastery = 1;
                }
                else if (score >= 0 && score <= 0.2)
                {
                    worseNum++;
                    cognitiveMastery = 0;
                }
                ErSingleStudentQuestionRecord singleStudentQuestionRecord = new ErSingleStudentQuestionRecord(student.student_id+ DateTimeHelper.GetTimeStamp(), student.student_id, practice_record_id, student.question_id,
                    student.id, (int)q, (int)d, dScoreItem.d1, dScoreItem.d2, dScoreItem.d3, dScoreItem.d4, dScoreItem.d5, dScoreItem.d6, dScoreItem.d7, student.first_operation_time, Math.Round(n, 2), (int)s,
                    score, cognitiveMastery, currentDate, currentDate);
                singleStudentQuestionRecords.Add(singleStudentQuestionRecord);
                if (question_id == null) {
                    question_id = student.question_id;
                }
                studentTotalScore += ValidateHelper.convertToNotNull(student.student_score);
                if (diagnosticQuestion.question_type == 1) {
                    int answerCount = 0;
                    maxItems.TryGetValue(student.answer, out answerCount);
                    maxItems.Remove(student.answer);
                    maxItems.Add(student.answer, ++answerCount);
                } else if (diagnosticQuestion.question_type == 0) {
                    int answerCount = 0;
                    maxItems.TryGetValue(ValidateHelper.convertToNotNull(student.student_score).ToString(), out answerCount);
                    maxItems.Add(student.answer, ++answerCount);
                }
            }
            int maxItemCount = 0;
            if (maxItems != null && maxItems.Count > 0)
            {
                maxItemCount = maxItems.Values.Max();
            }
            string maxItem = maxItems.FirstOrDefault(q => q.Value == maxItemCount).Key;
            APP.IDatas.ErSingleStudentQuestionRecord.InsertRange<ErSingleStudentQuestionRecord>(singleStudentQuestionRecords);

            ErAllStudentQuestionRecord allStudentQuestionRecord = new ErAllStudentQuestionRecord(practice_record_id + "" + DateTimeHelper.GetTimeStamp(), practice_record_id, question_id, diagnosticQuestion.answer, diagnosticQuestion.knowledge_id, diagnosticQuestion.knowledge_name, diagnosticQuestion.questionTotalScore, diagnosticQuestion.content, (int)(groupSituation.rightTime + groupSituation.errorTime),
                    studentList.Count, groupSituation.rightCount, groupSituation.errorCount, 0== studentList.Count?0:Math.Round((double)groupSituation.rightCount / studentList.Count, 2), Math.Round(n, 2), null, 0== studentList.Count?0:studentTotalScore / studentList.Count, 0== studentList.Count?0:(int)(groupSituation.rightTime + groupSituation.errorTime) / studentList.Count, (groupSituation.rightCount == 0 ? 0 : (int)(groupSituation.rightTime / groupSituation.rightCount)), (groupSituation.errorCount == 0 ? 0 : (int)(groupSituation.errorTime / groupSituation.errorCount)), (int)ValidateHelper.convertToNotNull(groupSituation.groupRightAverageFirstTime)
                    ,(int)ValidateHelper.convertToNotNull(groupSituation.groupWrongAverageFirstTime), 0== studentList.Count?0:Math.Round((double)masteryNum / studentList.Count, 2), 0== studentList.Count?0:Math.Round((double)worseNum / studentList.Count, 2), 0== studentList.Count?0:Math.Round((double)badNum / studentList.Count, 2), 0== studentList.Count?0:Math.Round((double)goodNum / studentList.Count, 2), 0== studentList.Count?0:Math.Round((double)greatNum / studentList.Count, 2), 0== studentList.Count?0:Math.Round((double)perfectNum / studentList.Count, 2), null, null, null, null, 0, maxItem, maxItemCount, currentDate, currentDate);
            calculateClasssAnswerQuestionSituation(studentLogisticScores, allStudentQuestionRecord, diagnosticQuestion.questionTotalScore);
            APP.IDatas.ErAllStudentQuestionRecord.Insert<ErAllStudentQuestionRecord>(allStudentQuestionRecord);
        }
        /// <summary>
        /// 计算班级答题情况
        /// </summary>
        /// <param name="studentLogisticScores">学生逻辑回归得分</param>
        /// <param name="allStudentQuestionRecord">班级单道题作答记录</param>
        /// <param name="questionTotalScore">问题总得分</param>
        /// <returns></returns>
        private void calculateClasssAnswerQuestionSituation(Dictionary<long, double> studentLogisticScores, ErAllStudentQuestionRecord allStudentQuestionRecord, double questionTotalScore) {
            double[] arr = new double[studentLogisticScores.Count];
            double understandNum = 0;
            double notUnderstandNum = 0;
            int i = 0;
            foreach (var item in studentLogisticScores)
            {
                double score = item.Value;
                arr[i++] = score;
                if (score > 0.5)
                {
                    understandNum++;
                    continue;
                }
                notUnderstandNum++;

            }
            QuickSortHelper.QuickSort(arr, 0, arr.Length - 1);
            double understand = (0 == studentLogisticScores.Count) ? 0:Math.Round(understandNum / studentLogisticScores.Count, 2);
            double notUnderstand = (0== studentLogisticScores.Count) ? 0:Math.Round(notUnderstandNum / studentLogisticScores.Count, 2);
            double degreeOfDifferentiation = calculateDegreeOfDifferentiation(arr, questionTotalScore);
           
            //allStudentQuestionRecord.mastery_proportion = understand;
            allStudentQuestionRecord.discrimination = degreeOfDifferentiation;
        }
        /**
         * 计算区分度
         */
        private static double calculateDegreeOfDifferentiation(double[] arr, double questionTotalScore)
        {
            int length = arr.Length;
            //低分组总分
            double lowTotalScore = 0;
            //高分组总分
            double highTotalScore = 0;
            //低分组平均分
            double lowAverageScore = 0;
            //高分组平均分
            double highAverageScore = 0;
            int lowPersonNum = 0;
            for (int i = 0; i < length; i++)
            {
                if (i < length * 0.5)
                {
                    lowPersonNum++;
                    lowTotalScore += arr[i];
                    continue;
                }
                highTotalScore += arr[i];
            }
            lowAverageScore = 0;
            if (Math.Floor(length * 0.5) > 0)
            {
                lowAverageScore = (lowPersonNum==0)?0:lowTotalScore / lowPersonNum;
            }
            highAverageScore = (length - lowPersonNum==0)?0:highTotalScore / (length - lowPersonNum);
            double e = 0;
            if (questionTotalScore > 0)
            {
                e = Math.Round(2 * (highAverageScore - lowAverageScore) / questionTotalScore, 2);
            }
            return e;
        }
        /**
         * 逻辑回归计算
         */
        public static double logistic(double q, double d, double s, double n)
        {
            double x = (q + d) * n;
            return Math.Round(Math.Exp(x) / (1 + Math.Exp(x)), 2);
        }
        /**
         * 为得分D项计算准备数据
         * studentList 学生原始记录集合
         * dScoreItems 得分D项
         * stepAnswer 阶答案
         * questionOptions 问题选项
         */
        private static GroupSituation prepareDataForCalculateD(List<ErOriginalRecord> studentList, Dictionary<long, DScoreItem> dScoreItems, DiagnosticQuestion diagnosticQuestion)
        {
            //答对组总人数
            int rightNum = 0;
            //答对组总耗时
            double rightTime = 0;
            //答对组首次反应总耗时
            int rightFirstTime = 0;
            //全班答对组平均耗时
            double groupRightAverageTime = 0;
            //全班答对组平均首次反应时长
            double groupRightAverageFirstTime = 0;

            //答错组总人数
            int wrongNum = 0;
            //答错组总耗时
            double wrongTime = 0;
            //答错组首次反应总耗时
            double wrongFirstTime = 0;
            //全班答错组平均耗时
            double groupWrongAverageTime = 0;
            //全班答错组平均首次反应时长
            double groupWrongAverageFirstTime = 0;
            //全班总得分
            double totalScoreOfClass = 0;
            var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.QueryByKey(diagnosticQuestion.question_id);
            foreach (ErOriginalRecord student in studentList)
            {
                
                var erStudentButtons = APP.IDatas.ErStudentButtonAnswerOriginalRecord.ListByExerciseRecordIdAndQuestionIdAndStudentId(student.exercise_record_id, (long)questionSealUp.source_question_id, student.student_id);
                Dictionary<int?, List<ErStudentButtonAnswerOriginalRecord>> dicOr = new Dictionary<int?, List<ErStudentButtonAnswerOriginalRecord>>();
                foreach (IGrouping<int?, ErStudentButtonAnswerOriginalRecord> group in erStudentButtons.GroupBy(s => s.step_number))
                {
                    dicOr.Add(group.Key, group.ToList<ErStudentButtonAnswerOriginalRecord>());
                }
                List<string> questionAnswers = new List<string>();
                List<string> secondOrderAnswers = new List<string>();
                List<string> thirdOrderAnswers = new List<string>();
                List<string> fourthOrderAnswers = new List<string>();
                List<ErStudentButtonAnswerOriginalRecord> first = erStudentButtons.Where(e => e.step_number == 1).ToList();
                if(first != null && first.Count > 0)
                {
                    questionAnswers = first.Select(e => e.button_item).ToList();
                }
                List<ErStudentButtonAnswerOriginalRecord> second = erStudentButtons.Where(e => e.step_number == 2).ToList();
                if (second != null && second.Count > 0)
                {
                    secondOrderAnswers = second.Select(e => e.button_item).ToList();
                }
                List<ErStudentButtonAnswerOriginalRecord> third = erStudentButtons.Where(e => e.step_number == 3).ToList();
                if (third != null && third.Count > 0)
                {
                    thirdOrderAnswers = third.Select(e => e.button_item).ToList();
                }
                List<ErStudentButtonAnswerOriginalRecord> forth = erStudentButtons.Where(e => e.step_number == 4).ToList();
                if (forth != null && forth.Count > 0)
                {
                    fourthOrderAnswers = forth.Select(e => e.button_item).ToList();
                }
                totalScoreOfClass += ValidateHelper.convertToNotNull(student.student_score);
                
                DScoreItem dScoreItem = new DScoreItem();
                //按无关按钮的次数
                int irrelevantButtonNum = 0;
                switch (diagnosticQuestion.cognitive)
                {
                    case SECOND_ORDER_COGNITIVE_DEGREE:
                        questionAnswers.ForEach(answer=> {
                            if (null != diagnosticQuestion.answerOptions && !diagnosticQuestion.answerOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        secondOrderAnswers.ForEach(answer=> {
                            if (null != diagnosticQuestion.secondOrderOptions && !diagnosticQuestion.secondOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        if (diagnosticQuestion.question_type==0) {
                            break;
                        }
                        if (student.is_right)
                        {
                            rightNum++;
                            rightTime += ValidateHelper.convertToNotNull(student.use_time);
                            rightFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 1;
                            }
                            else
                            {
                                dScoreItem.d5 = 0.5;
                            }
                            //命中正确答案次数
                            int hitRightNum = 0;
                            //提交答案总次数
                            int submitNum = 0;
                            questionAnswers.ForEach(answer=> {
                                if (student.answer == answer)
                                {
                                    hitRightNum++;
                                }
                                submitNum++;
                            });
                            dScoreItem.d6 = (0==submitNum)?0:(hitRightNum / submitNum) * 1 * 1;
                        }
                        else
                        {
                            wrongNum++;
                            wrongTime += ValidateHelper.convertToNotNull(student.use_time);
                            wrongFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 0;
                            }
                            else
                            {
                                dScoreItem.d5 = -0.5;
                            }
                            dScoreItem.d6 = 0;
                        }
                        break;
                    case SECOND_ORDER_COGNITIVE_REASON:
                        questionAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.answerOptions && !diagnosticQuestion.answerOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        secondOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.secondOrderOptions && !diagnosticQuestion.secondOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        if (diagnosticQuestion.question_type == 0)
                        {
                            break;
                        }
                        if (student.is_right && student.first_feed_back == diagnosticQuestion.secondOrderAnswer)
                        {
                            rightNum++;
                            rightTime += ValidateHelper.convertToNotNull(student.use_time);
                            rightFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 1;
                            }
                            else
                            {
                                dScoreItem.d5 = 0.5;
                            }
                            //命中正确答案次数
                            int hitRightNum = 0;
                            //提交答案总次数
                            int submitNum = 0;
                            questionAnswers.ForEach(answer=> {
                                if (student.answer == answer)
                                {
                                    hitRightNum++;
                                }
                                submitNum++;
                            });
                            dScoreItem.d6 = (0==submitNum)?0:(hitRightNum / submitNum) * 1 * 1;
                        }
                        else
                        {
                            wrongNum++;
                            wrongTime += ValidateHelper.convertToNotNull(student.use_time);
                            wrongFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 0;
                            }
                            else
                            {
                                dScoreItem.d5 = -0.5;
                            }
                            dScoreItem.d6 = 0;
                        }
                        break;
                    case THIRD_ORDER_COGNITIVE:
                        questionAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.answerOptions && !diagnosticQuestion.answerOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        secondOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.secondOrderOptions && !diagnosticQuestion.secondOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        thirdOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.thirdOrderOptions && !diagnosticQuestion.thirdOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        if (diagnosticQuestion.question_type == 0)
                        {
                            break;
                        }
                        if (student.is_right && student.first_feed_back == diagnosticQuestion.secondOrderAnswer)
                        {
                            rightNum++;
                            rightTime += ValidateHelper.convertToNotNull(student.use_time);
                            rightFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 1;
                            }
                            else
                            {
                                dScoreItem.d5 = 0.5;
                            }
                            //命中正确答案次数
                            int hitRightNum = 0;
                            //提交答案总次数
                            int submitNum = 0;
                            questionAnswers.ForEach(answer=> {
                                if (student.answer == answer)
                                {
                                    hitRightNum++;
                                }
                                submitNum++;
                            });
                            dScoreItem.d6 = (0==submitNum)?0:(hitRightNum / submitNum) * 1 * 1;
                        }
                        else
                        {
                            wrongNum++;
                            wrongTime += ValidateHelper.convertToNotNull(student.use_time);
                            wrongFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 0;
                            }
                            else
                            {
                                dScoreItem.d5 = -0.5;
                            }
                            dScoreItem.d6 = 0;
                        }
                        break;
                    case FOURTH_ORDER_COGNITIVE:
                        questionAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.answerOptions && !diagnosticQuestion.answerOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        secondOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.secondOrderOptions && !diagnosticQuestion.secondOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        thirdOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.thirdOrderOptions && !diagnosticQuestion.thirdOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        fourthOrderAnswers.ForEach(answer => {
                            if (null!= diagnosticQuestion.fourthOrderOptions && !diagnosticQuestion.fourthOrderOptions.Contains(answer))
                            {
                                irrelevantButtonNum++;
                            }
                        });
                        if (diagnosticQuestion.question_type == 0)
                        {
                            break;
                        }
                        if (student.is_right && student.second_feed_back == diagnosticQuestion.thirdOrderAnswer)
                        {
                            rightNum++;
                            rightTime += ValidateHelper.convertToNotNull(student.use_time);
                            rightFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 1;
                            }
                            else
                            {
                                dScoreItem.d5 = 0.5;
                            }
                            //命中正确答案次数
                            int hitRightNum = 0;
                            //提交答案总次数
                            int submitNum = 0;
                            questionAnswers.ForEach(answer=> {
                                if (student.answer == answer)
                                {
                                    hitRightNum++;
                                }
                                submitNum++;
                            });
                            dScoreItem.d6 = (0 == submitNum)?0:(hitRightNum / submitNum) * 1 * 1;
                        }
                        else
                        {
                            wrongNum++;
                            wrongTime += ValidateHelper.convertToNotNull(student.use_time);
                            wrongFirstTime += ValidateHelper.convertToNotNull(student.first_operation_time);
                            if (questionAnswers.Count == 1)
                            {
                                dScoreItem.d5 = 0;
                            }
                            else
                            {
                                dScoreItem.d5 = -0.5;
                            }
                            dScoreItem.d6 = 0;
                        }
                        break;
                }
                if (irrelevantButtonNum == 0)
                {
                    dScoreItem.d7 = 1;
                }
                else if (irrelevantButtonNum <= 3)
                {
                    dScoreItem.d7 = 0;
                }
                else if (irrelevantButtonNum > 3)
                {
                    dScoreItem.d7 = -1;
                }
                if (dScoreItems.ContainsKey(ValidateHelper.convertToNotNull(student.student_id)))
                {
                    dScoreItems.Remove(ValidateHelper.convertToNotNull(student.student_id));
                    dScoreItems.Add(ValidateHelper.convertToNotNull(student.student_id), dScoreItem);
                }
                else {
                    dScoreItems.Add(ValidateHelper.convertToNotNull(student.student_id), dScoreItem);
                }
                
            }
            if (rightNum != 0)
            {
                groupRightAverageTime = rightTime / rightNum;
                groupRightAverageFirstTime = rightFirstTime / rightNum;
            }
            if (wrongNum != 0)
            {
                groupWrongAverageTime = wrongTime / wrongNum;
                groupWrongAverageFirstTime = wrongFirstTime / wrongNum;
            }
            GroupSituation groupSituation = new GroupSituation();
            groupSituation.rightCount = rightNum;
            groupSituation.rightTime = rightTime;
            groupSituation.errorCount = wrongNum;
            groupSituation.errorTime = wrongTime;
            groupSituation.groupRightAverageTime = groupRightAverageTime;
            groupSituation.groupRightAverageFirstTime = groupRightAverageFirstTime;
            groupSituation.groupWrongAverageTime = groupWrongAverageTime;
            groupSituation.groupWrongAverageFirstTime = groupWrongAverageFirstTime;
            groupSituation.studentAverageScore = totalScoreOfClass / studentList.Count;
            return groupSituation;
        }
        /**
         * 计算得分Q
         * originalStudentRecord 学生答题记录
         * stepAnswer 阶梯答案
         */
        public static double calculateScoreQ(ErOriginalRecord originalRecord, DiagnosticQuestion diagnosticQuestion)
        {
            string answer = "WRONG";
            if (originalRecord.is_right)
                answer = "RIGHT";
            switch (diagnosticQuestion.cognitive)
            {
                case SECOND_ORDER_COGNITIVE_DEGREE:
                    answer += "_" + originalRecord.first_feed_back;
                    break;
                case SECOND_ORDER_COGNITIVE_REASON:
                    if (originalRecord.first_feed_back == diagnosticQuestion.secondOrderAnswer)
                    {
                        answer += "_RIGHT";
                    }
                    else
                    {
                        answer += "_WRONG";
                    }
                    break;
                case THIRD_ORDER_COGNITIVE:
                    if (originalRecord.first_feed_back == diagnosticQuestion.secondOrderAnswer)
                    {
                        answer += "_RIGHT";
                    }
                    else
                    {
                        answer += "_WRONG";
                    }
                    answer += "_" + originalRecord.second_feed_back;
                    break;
                case FOURTH_ORDER_COGNITIVE:
                    answer += "_" + originalRecord.first_feed_back;
                    if (originalRecord.second_feed_back == diagnosticQuestion.thirdOrderAnswer)
                    {
                        answer += "_RIGHT";
                    }
                    else
                    {
                        answer += "_WRONG";
                    }
                    answer += "_" + originalRecord.third_feed_back;
                    break;
            }
            var score = 0;
            switch (diagnosticQuestion.cognitive)
            {
                case SECOND_ORDER_COGNITIVE_DEGREE:
                    SecondOrderCognitiveDegree secondOrderCognitiveDegree;
                    if (Enum.TryParse(answer, out secondOrderCognitiveDegree))
                    {
                        score = (int)secondOrderCognitiveDegree;
                    }
                    break;
                case SECOND_ORDER_COGNITIVE_REASON:
                    SecondOrderCognitiveReason secondOrderCognitiveReason;
                    if (Enum.TryParse(answer, out secondOrderCognitiveReason))
                    {
                        score = (int)secondOrderCognitiveReason;
                    }
                    break;
                case THIRD_ORDER_COGNITIVE:
                    ThirdOrderCognitive thirdOrderCognitive;
                    if (Enum.TryParse(answer, out thirdOrderCognitive))
                    {
                        score = (int)thirdOrderCognitive;
                    }
                    break;
                case FOURTH_ORDER_COGNITIVE:
                    FourthOrderCognitive fourthOrderCognitive;
                    if (Enum.TryParse(answer, out fourthOrderCognitive))
                    {
                        score = (int)fourthOrderCognitive;
                    }
                    break;
            }
            return score;
        }
        /**
         * 计算得分D
         * result 答题结果
         * answerNumber 答题次数
         */
        public static double calculateScoreD(ErOriginalRecord student, DScoreItem dScoreItem, GroupSituation groupSituation)
        {

            if (student.is_right)
            {
                return calculateScoreDForRight(student, dScoreItem, groupSituation);
            }
            return calculateScoreDForWrong(student, dScoreItem, groupSituation);
        }
        /**
         * 计算得分N
         * studentAverageScore 本道题学生的平均的得分
         * questionTotalScore 该道题总分
         */
        public static double calculateScoreN(double studentAverageScore, double questionTotalScore)
        {
            return 0 == questionTotalScore?0:studentAverageScore / questionTotalScore;
        }
        /**
         * 计算得分S
         */
        public static double calculateScoreS()
        {
            return 0;
        }
        /**
         *答题正确时得分D 
         *student 学生反馈记录
         *dScoreItem 得分D项
         *groupSituation 分组答题情况
         */
        private static double calculateScoreDForRight(ErOriginalRecord student, DScoreItem dScoreItem, GroupSituation groupSituation)
        {
            double d1 = 0;
            if (student.use_time!=null && 0!=student.use_time) {
                d1 = (ValidateHelper.convertToNotNull(groupSituation.groupRightAverageTime) / (int)student.use_time) * 1;
            }
            double d2 = 0;
            if (student.first_operation_time!=null && 0 != student.first_operation_time) {
                d2 = (ValidateHelper.convertToNotNull(groupSituation.groupRightAverageFirstTime) / (int)student.first_operation_time) * 0.5;
            }
            dScoreItem.d1 = d1;
            dScoreItem.d2 = d2;
            double d = d1 + d2 + dScoreItem.d5 + dScoreItem.d6 + dScoreItem.d7;
            if (d < -2) {
                d = -2;
            } else if (d > 2) {
                d = 2;
            }
            return d;
        }
        /**
         * 答题错误时得分D
         * student 学生反馈记录
         * dScoreItem 得分D项
         * groupSituation 分组答题情况
         */
        private static double calculateScoreDForWrong(ErOriginalRecord student, DScoreItem dScoreItem, GroupSituation groupSituation)
        {
            double d3 = 0;
            if (student.use_time!=null) {
                d3 = (null==groupSituation.groupWrongAverageTime || 0 == groupSituation.groupWrongAverageTime) ? 0 :((int)student.use_time) / ValidateHelper.convertToNotNull(groupSituation.groupWrongAverageTime) * (-1);
            }
            double d4 = 0;
            if (student.first_operation_time!=null) {
                d4 = (null == groupSituation.groupWrongAverageFirstTime || 0 == groupSituation.groupWrongAverageFirstTime)?0:((int)student.first_operation_time / ValidateHelper.convertToNotNull(groupSituation.groupWrongAverageFirstTime)) * (-0.5);
            }
            dScoreItem.d3 = d3;
            dScoreItem.d4 = d4;
            return d3 + d4 + dScoreItem.d5 + dScoreItem.d6 + dScoreItem.d7;
        }

        /**
         * 原始记录分析
         */
        public bool analysisOriginal(string exerciseRecordId, long questionId)
        {
            var questionSealUp = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.OneByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            if(questionSealUp == null)
            {
                return false;
            }
            var practiceRecord = APP.IDatas.ErPracticeRecord.oneById(exerciseRecordId);
            if(practiceRecord == null)
            {
                return false;
            }
            var originalRecords  = APP.IDatas.ErStudentButtonAnswerOriginalRecord.ListByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            if(originalRecords == null && originalRecords.Count <= 0)
            {
                return false;
            }
            var HandwriteRecords = APP.IDatas.ErStudentHandwriteAnswerOriginalRecord.ListByExerciseRecordIdAndQuestionId(exerciseRecordId, questionId);
            
            Dictionary<long?, List<ErStudentHandwriteAnswerOriginalRecord>> dicOr = new Dictionary<long?, List<ErStudentHandwriteAnswerOriginalRecord>>();
            foreach (IGrouping<long?, ErStudentHandwriteAnswerOriginalRecord> group in HandwriteRecords.GroupBy(s => s.student_id))
            {
                dicOr.Add(group.Key, group.ToList<ErStudentHandwriteAnswerOriginalRecord>());
            }
            List<ErOriginalRecord> erOriginalRecords = new List<ErOriginalRecord>();
            foreach (IGrouping<long, ErStudentButtonAnswerOriginalRecord> group in originalRecords.GroupBy(e => e.student_id))
            {
                ErOriginalRecord erOriginalRecord = new ErOriginalRecord();
                erOriginalRecord.id = Guid.NewGuid().ToUUID();
                erOriginalRecord.student_id = group.Key;
                erOriginalRecord.exercise_record_id = practiceRecord.id;
                erOriginalRecord.question_id = questionSealUp.id;
                List<ErStudentButtonAnswerOriginalRecord> list = group.ToList();
                //DateTime? record = list.Where(e => e.step_number == 1).Select(e => e.create_time).Last();
                ErStudentButtonAnswerOriginalRecord record = new ErStudentButtonAnswerOriginalRecord();
                List<ErStudentButtonAnswerOriginalRecord> res = list.Where(e => e.step_number == 1).ToList();
                if(res != null && res.Count > 0)
                {
                    record =  res.OrderByDescending(t => t.create_time).First();
                }
                string answer = "";
                if (record.button_item != null && !"".Equals(record.button_item))
                {
                    string[] allContainsAnswer = new string[] { "A", "B", "C", "D", "E", "F", "G" };
                    String[] buttonItems = record.button_item.Split(',');
                    List<string> buttonItemList = null;
                    if (buttonItems != null)
                    {
                        if(buttonItems.Count() > 1)
                        {
                            buttonItemList = buttonItems.Where(b => allContainsAnswer.Contains(b)).Distinct().ToList();
                        }
                        else
                        {
                            buttonItemList = buttonItems.Distinct().ToList();
                        }
                        buttonItemList.Sort();
                        answer = string.Join("", buttonItemList.ToArray());
                    }
                }
                erOriginalRecord.answer = answer;
                List<ErStudentButtonAnswerOriginalRecord> models = list.Where(e => e.is_self_judgment).ToList();
                ErStudentButtonAnswerOriginalRecord model = null;
                if (models != null && models.Count > 0)
                {
                    model = models.Last();
                }
                string correctAnswer = questionSealUp.first_step_correct_option;
                if (questionSealUp.self_judgment_model == null)
                {
                    if (correctAnswer == null || "".Equals(correctAnswer))
                    {
                        erOriginalRecord.is_right = false;
                    }
                    else
                    {
                        List<char> correctAnswerList = correctAnswer.ToCharArray().ToList();
                        correctAnswerList.Sort();
                        correctAnswer = string.Join("", correctAnswerList);
                        if (correctAnswer.Trim().Equals(erOriginalRecord.answer.Trim()))
                        {
                            erOriginalRecord.is_right = true;
                        }
                        else
                        {
                            erOriginalRecord.is_right = false;
                        }
                    }
                }
                else if(questionSealUp.self_judgment_model == 0)
                {
                    if(model != null)
                    {
                        int score = 0;
                        if(model.button_item != null && model.button_item != "")
                        {
                            score = int.Parse(model.button_item);
                        }
                        if(questionSealUp.self_judgment_full_score == score)
                        {
                            erOriginalRecord.is_right = true;
                        }
                        else
                        {
                            erOriginalRecord.is_right = false;
                        }
                    }
                    else
                    {
                        erOriginalRecord.is_right = false;
                    }
                }
                else if(questionSealUp.self_judgment_model == 1)
                {
                    if (model != null)
                    {
                        if ("YES".Equals(model.button_item))
                        {
                            erOriginalRecord.is_right = true;
                        }
                        else
                        {
                            erOriginalRecord.is_right = false;
                        }
                    }
                    else
                    {
                        erOriginalRecord.is_right = false;
                    }
                }
                
                //学生得分
                if(questionSealUp.self_judgment_model == 0)
                {
                    
                    if (model != null)
                    {
                        double score = 0;
                        if (model.button_item != null && model.button_item != "")
                        {
                            score = double.Parse(model.button_item);
                        }
                        erOriginalRecord.student_score = score;
                    }
                    else
                    {
                        erOriginalRecord.student_score = 0;
                    }
                }
                else
                {
                    if (erOriginalRecord.is_right)
                    {
                        erOriginalRecord.student_score = 1;
                    }
                    else
                    {
                        erOriginalRecord.student_score = 0;
                    }
                }
                ErStudentButtonAnswerOriginalRecord secondOption = null;
                List<ErStudentButtonAnswerOriginalRecord> secondOptions = list.Where(e => e.step_number == 2).OrderByDescending(t => t.create_time).ToList();
                if(secondOptions != null && secondOptions.Count > 0)
                {
                     secondOption = secondOptions.First();
                }
                if (secondOption != null)
                {
                    erOriginalRecord.first_feed_back = secondOption.button_item;
                }
                ErStudentButtonAnswerOriginalRecord thirdOption = null;
                List<ErStudentButtonAnswerOriginalRecord> thirdOptions = list.Where(e => e.step_number == 3).OrderByDescending(t => t.create_time).ToList();
                if (thirdOptions != null && thirdOptions.Count > 0)
                {

                    thirdOption = thirdOptions.First();
                }
                if(thirdOption != null)
                {
                    erOriginalRecord.second_feed_back = thirdOption.button_item;
                }
                ErStudentButtonAnswerOriginalRecord fourthOption = null;
                List<ErStudentButtonAnswerOriginalRecord> fourthOptions = list.Where(e => e.step_number == 4).OrderByDescending(t => t.create_time).ToList();
                if (fourthOptions != null && fourthOptions.Count > 0)
                {
                    fourthOption = fourthOptions.First();
                }
                if (fourthOption != null)
                {
                    erOriginalRecord.third_feed_back = fourthOption.button_item;
                }
                ErStudentButtonAnswerOriginalRecord end = list.OrderByDescending(t => t.create_time).First();
                int endTime = 0;
                TimeSpan timeSpan = (TimeSpan)(end.create_time - questionSealUp.start_practice_time);
                endTime = timeSpan.Seconds;
                erOriginalRecord.use_time = endTime;
                ErStudentButtonAnswerOriginalRecord first = list.OrderByDescending(t => t.create_time).Last();
                //首次操作用时
                int startOperationTime = 0;
                TimeSpan startOperationTimeSpan = (TimeSpan)(first.create_time - questionSealUp.start_practice_time);
                startOperationTime = startOperationTimeSpan.Seconds;
                erOriginalRecord.first_operation_time = startOperationTime;
                //首次提交用时
                ErStudentButtonAnswerOriginalRecord firstSubmit = list.Where(t => t.is_submit == true).OrderByDescending(t => t.create_time).Last();
                int firstSubmitTime = 0;
                TimeSpan firstSubmitTimeSpan = (TimeSpan)(firstSubmit.create_time - questionSealUp.start_practice_time);
                firstSubmitTime = firstSubmitTimeSpan.Seconds;
                erOriginalRecord.first_submit_time = firstSubmitTime;

                string allAnswer = string.Join(",", list.Where(e => e.step_number == 1).Select(e => e.button_item));
                erOriginalRecord.all_answer = allAnswer;
                List<int> time = new List<int>();
                foreach(var button in list) { 

                    TimeSpan times = (TimeSpan)(button.create_time - questionSealUp.start_practice_time);

                    time.Add(times.Seconds);
                }
                string allAnswerTime = string.Join(",", time);
                erOriginalRecord.all_answer_time = allAnswerTime;
                erOriginalRecord.button_count = list.Count();
                dicOr.TryGetValue(group.Key, out List<ErStudentHandwriteAnswerOriginalRecord> handwrite);
                if(handwrite != null && handwrite.Count > 0)
                {
                    erOriginalRecord.write_count = handwrite.Count;
                }
                else
                {
                    erOriginalRecord.write_count = 0;
                }

                erOriginalRecord.cognitive = questionSealUp.question_stem_type;
                erOriginalRecord.create_time = DateTime.Now;
                erOriginalRecord.update_time = DateTime.Now;
                erOriginalRecords.Add(erOriginalRecord);
            }
            APP.IDatas.ErOriginalRecord.InsertRange<ErOriginalRecord>(erOriginalRecords);
            if(erOriginalRecords != null && erOriginalRecords.Count > 0)
            {
                return true;
            }
            return false;
        }


        public static int getNetStatus()
        {
            System.Net.NetworkInformation.Ping ping;
            System.Net.NetworkInformation.PingReply ret;
            ping = new System.Net.NetworkInformation.Ping();
            try
            {
                ret = ping.Send("www.baidu.com");
                if (ret.Status != System.Net.NetworkInformation.IPStatus.Success)
                {
                    //没网
                    return 1;
                }
                else
                {
                    //有网
                    return 0;
                }
            }
            catch (Exception err)
            {
                //MessageBox.Show("获取网络状态异常：" + err.ToString());
                //throw new 
                //MessageBox.Show("获取网络状态异常");
                return 1;
            }
        }


    }
    /// <summary>
    /// 二阶认知程度
    /// </summary>
    enum SecondOrderCognitiveDegree
    {
        [Description("1阶正确_2阶A")]
        RIGHT_A = 8,

        [Description("1阶正确_2阶B")]
        RIGHT_B = 4,

        [Description("1阶正确_2阶C")]
        RIGHT_C = 0,

        [Description("1阶错误_2阶A")]
        WRONG_A = -8,

        [Description("1阶错误_2阶B")]
        WRONG_B = -4,

        [Description("1阶错误_2阶C")]
        WRONG_C = 0
    }
    /// <summary>
    /// 二阶认知理由
    /// </summary>
    enum SecondOrderCognitiveReason
    {
        [Description("1阶正确_2阶正确")]
        RIGHT_RIGHT = 8,

        [Description("1阶正确_2阶错误")]
        RIGHT_WRONG = 0,

        [Description("1阶错误_2阶正确")]
        WRONG_RIGHT = 0,

        [Description("1阶错误_2阶错误")]
        WRONG_WRONG = -8
    }
    /// <summary>
    /// 三阶认知
    /// </summary>
    enum ThirdOrderCognitive
    {

        [Description("1阶正确_2阶正确_3阶A")]
        RIGHT_RIGHT_A = 8,

        [Description("1阶正确_2阶正确_3阶B")]
        RIGHT_RIGHT_B = 4,

        [Description("1阶正确_2阶正确_3阶C")]
        RIGHT_RIGHT_C = 1,

        [Description("1阶正确_2阶错误_3阶A")]
        RIGHT_WRONG_A = 4,

        [Description("1阶正确_2阶错误_3阶B")]
        RIGHT_WRONG_B = 1,

        [Description("1阶正确_2阶错误_3阶C")]
        RIGHT_WRONG_C = -1,

        [Description("1阶错误_2阶正确_3阶A")]
        WRONG_RIGHT_A = -4,

        [Description("1阶错误_2阶正确_3阶B")]
        WRONG_RIGHT_B = -1,

        [Description("1阶错误_2阶正确_3阶C")]
        WRONG_RIGHT_C = 0,

        [Description("1阶错误_2阶错误_3阶A")]
        WRONG_WRONG_A = -8,

        [Description("1阶错误_2阶错误_3阶B")]
        WRONG_WRONG_B = -4,

        [Description("1阶错误_2阶错误_3阶C")]
        WRONG_WRONG_C = 0
    }
    /// <summary>
    /// 四阶认知
    /// </summary>
    enum FourthOrderCognitive
    {
        [Description("1阶正确_2阶A_3阶正确_4阶A")]
        RIGHT_A_RIGHT_A = 8,

        [Description("1阶正确_2阶A_3阶正确_4阶B")]
        RIGHT_A_RIGHT_B = 6,

        [Description("1阶正确_2阶A_3阶正确_4阶C")]
        RIGHT_A_RIGHT_C = 3,
        
        [Description("1阶正确_2阶A_3阶错误_4阶A")]
        RIGHT_A_WRONG_A = 5,

        [Description("1阶正确_2阶A_3阶错误_4阶B")]
        RIGHT_A_WRONG_B = 3,

        [Description("1阶正确_2阶A_3阶错误_4阶C")]
        RIGHT_A_WRONG_C = 0,
        
        [Description("1阶正确_2阶B_3阶正确_4阶A")]
        RIGHT_B_RIGHT_A = 6,

        [Description("1阶正确_2阶B_3阶正确_4阶B")]
        RIGHT_B_RIGHT_B = 3,

        [Description("1阶正确_2阶B_3阶正确_4阶C")]
        RIGHT_B_RIGHT_C = -1,
        
        [Description("1阶正确_2阶B_3阶错误_4阶A")]
        RIGHT_B_WRONG_A = 1,

        [Description("1阶正确_2阶B_3阶错误_4阶B")]
        RIGHT_B_WRONG_B = 0,

        [Description("1阶正确_2阶B_3阶错误_4阶C")]
        RIGHT_B_WRONG_C = -1,
        
        [Description("1阶正确_2阶C_3阶正确_4阶A")]
        RIGHT_C_RIGHT_A = 4,

        [Description("1阶正确_2阶C_3阶正确_4阶B")]
        RIGHT_C_RIGHT_B = 1,

        [Description("1阶正确_2阶C_3阶正确_4阶C")]
        RIGHT_C_RIGHT_C = -2,
        
        [Description("1阶正确_2阶C_3阶错误_4阶A")]
        RIGHT_C_WRONG_A = 0,

        [Description("1阶正确_2阶C_3阶错误_4阶B")]
        RIGHT_C_WRONG_B = -1,

        [Description("1阶正确_2阶C_3阶错误_4阶C")]
        RIGHT_C_WRONG_C = -2,
        
        [Description("1阶错误_2阶A_3阶正确_4阶A")]
        WRONG_A_RIGHT_A = 0,

        [Description("1阶错误_2阶A_3阶正确_4阶B")]
        WRONG_A_RIGHT_B = -3,

        [Description("1阶错误_2阶A_3阶正确_4阶C")]
        WRONG_A_RIGHT_C = -5,
        
        [Description("1阶错误_2阶A_3阶错误_4阶A")]
        WRONG_A_WRONG_A = -8,

        [Description("1阶错误_2阶A_3阶错误_4阶B")]
        WRONG_A_WRONG_B = -4,

        [Description("1阶错误_2阶A_3阶错误_4阶C")]
        WRONG_A_WRONG_C = -2,
        
        [Description("1阶错误_2阶B_3阶正确_4阶A")]
        WRONG_B_RIGHT_A = -4,

        [Description("1阶错误_2阶B_3阶正确_4阶B")]
        WRONG_B_RIGHT_B = -1,

        [Description("1阶错误_2阶B_3阶正确_4阶C")]
        WRONG_B_RIGHT_C = 0,
        
        [Description("1阶错误_2阶B_3阶错误_4阶A")]
        WRONG_B_WRONG_A = -6,

        [Description("1阶错误_2阶B_3阶错误_4阶B")]
        WRONG_B_WRONG_B = -2,

        [Description("1阶错误_2阶B_3阶错误_4阶C")]
        WRONG_B_WRONG_C = 0,
        
        [Description("1阶错误_2阶C_3阶正确_4阶A")]
        WRONG_C_RIGHT_A = -7,

        [Description("1阶错误_2阶C_3阶正确_4阶B")]
        WRONG_C_RIGHT_B = -4,

        [Description("1阶错误_2阶C_3阶正确_4阶C")]
        WRONG_C_RIGHT_C = 0,
        
        [Description("1阶错误_2阶C_3阶错误_4阶A")]
        WRONG_C_WRONG_A = -8,

        [Description("1阶错误_2阶C_3阶错误_4阶B")]
        WRONG_C_WRONG_B = -4,

        [Description("1阶错误_2阶C_3阶错误_4阶C")]
        WRONG_C_WRONG_C = 0,

    }

   
}
