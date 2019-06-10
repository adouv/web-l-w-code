using MLPen.Helpers;
using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Services
{
    public class MQSynchronousDataService
    {
        private static object lockObj = new object();

        /// <summary>
        /// 试卷练习记录数据同步
        /// </summary>
        public void SendErPracticeRecordMsg()
        {

            var practiceRecords = APP.IDatas.ErPracticeRecord.ListByStatus();
            if (practiceRecords != null && practiceRecords.Count > 0)
            {
                practiceRecords.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErPaperPracticeRecord>(e, "PRACTICE_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErPracticeRecord.Update<ErPaperPracticeRecord>(e);
                    }
                });
                
            }
        }

        public void test()
        {
            for(int i = 0; i < 30000; i++)
            {
                ErPaperPracticeRecord paperPracticeRecord = new ErPaperPracticeRecord();

            }
        }

        /// <summary>
        /// 班级知识点分析数据同步
        /// </summary>
        public void SendErAllStudentKnowledgeRecordMsg()
        {
            var records = APP.IDatas.ErAllStudentKnowledgeRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErAllStudentKnowledgeRecord>(e, "ALL_STUDENT_KNOWLEDGE_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                            e.synchronous_status = 1;
                            APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErAllStudentKnowledgeRecord>(e);
                    }
                });

               
            }
        }

        /// <summary>
        /// 班级整套题数据同步
        /// </summary>
        public void SendErAllStudentPracticeRecordMsg()
        {
            var records = APP.IDatas.ErAllStudentPracticeRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErAllStudentPracticeRecord>(e, "ALL_STUDENT_PRACTICE_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErAllStudentPracticeRecord>(e);
                    }
                });

               
            }
        }

        /// <summary>
        /// 班级单题分析数据同步
        /// </summary>
        public void SendErAllStudentQuestionRecordMsg()
        {
            var records = APP.IDatas.ErAllStudentQuestionRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErAllStudentQuestionRecord>(e, "ALL_STUDENT_QUESTION_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErAllStudentQuestionRecord>(e);
                    }
                });

                
            }
        }

        /// <summary>
        /// 原始数据同步
        /// </summary>
        public void SendErOriginalRecordMsg()
        {
            var records = APP.IDatas.ErOriginalRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErOriginalRecord>(e, "ORIGINAL_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErOriginalRecord>(e);
                    }
                });

               
            }
        }

        /// <summary>
        /// 题封存数据同步
        /// </summary>
        public void SendErPaperPracticeRecordQuestionSealUpMsg()
        {
            var records = APP.IDatas.ErPaperPracticeRecordQuestionSealUp.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErPaperPracticeRecordQuestionSealUp>(e, "PAPER_PRACTICE_RECORD_QUESTION_SEALUP_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErPaperPracticeRecordQuestionSealUp>(e);
                    }
                });

               
            }
        }

        /// <summary>
        /// 学生封存数据同步
        /// </summary>
        public void SendErPaperPracticeRecordStudentSealUpMsg()
        {
            var records = APP.IDatas.ErPaperPracticeRecordStudentSealUp.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErPaperPracticeRecordStudentSealUp>(e, "PAPER_PRACTICE_RECORD_STUDENT_SEALUP_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                       
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErPaperPracticeRecordStudentSealUp>(e);
                    }
                });

                
            }
        }

        /// <summary>
        /// 学生知识点数据同步
        /// </summary>
        public void SendErSingleStudentKnowledgeRecordMsg()
        {
            var records = APP.IDatas.ErSingleStudentKnowledgeRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErSingleStudentKnowledgeRecord>(e, "SINGLE_STUDENT_KNOWLEDGE_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErSingleStudentKnowledgeRecord>(e);
                    }
                });

                
            }
        }

        /// <summary>
        /// 学生整套题数据同步
        /// </summary>
        public void SendErSingleStudentPracticeRecordMsg()
        {
            var records = APP.IDatas.ErSingleStudentPracticeRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErSingleStudentPracticeRecord>(e, "SINGLE_STUDENT_PRACTICE_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErSingleStudentPracticeRecord>(e);
                    }
                });

                
            }
        }

        /// <summary>
        /// 学生答题分析数据同步
        /// </summary>
        public void SendErSingleStudentQuestionRecordMsg()
        {
            var records = APP.IDatas.ErSingleStudentQuestionRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErSingleStudentQuestionRecord>(e, "SINGLE_STUDENT_QUESTION_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErSingleStudentQuestionRecord>(e);
                    }
                });

               
            }
        }

        /// <summary>
        /// 选项数据同步
        /// </summary>
        public void SendErStudentButtonAnswerOriginalRecordMsg()
        {
            var records = APP.IDatas.ErStudentButtonAnswerOriginalRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErStudentButtonAnswerOriginalRecord>(e, "STUDENT_BUTTON_ANSWER_ORIGINAL_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                            e.synchronous_status = 1;
                            APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErStudentButtonAnswerOriginalRecord>(e);
                    }
                });

                
            }
        }

        /// <summary>
        /// 笔迹数据同步
        /// </summary>
        public void SendErStudentHandwriteAnswerOriginalRecordMsg()
        {
            var records = APP.IDatas.ErStudentHandwriteAnswerOriginalRecord.ListByStatus();
            if (records != null && records.Count > 0)
            {
                records.ForEach(e =>
                {
                    bool status = RabbitMQSendHelper.PushMsgToMq<ErStudentHandwriteAnswerOriginalRecord>(e, "STUDENT_HANDWRITE_ANSWER_ORIGINAL_RECORD_QUEUE", "direct_exchange", "direct");
                    if (status)
                    {
                        e.synchronous_status = 1;
                        APP.IDatas.ErAllStudentKnowledgeRecord.Update<ErStudentHandwriteAnswerOriginalRecord>(e);
                    }
                });

            }
            
        }
    }
}
