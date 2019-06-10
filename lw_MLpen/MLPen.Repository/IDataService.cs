using MLPen.Repository.Interfaces;
using System;

namespace MLPen.Repository
{
    /// <summary>
    /// 数据库服务接口
    /// </summary>
    public interface IDataService : IDisposable, IAutofac
    {
        /// <summary>
        /// 班级单道题作答记录分析
        /// </summary>
        IErAllStudentQuestionRecordService ErAllStudentQuestionRecord { get; }
        /// <summary>
        /// 班级试卷作答记录分析
        /// </summary>
        IErAllStudentPracticeRecordService ErAllStudentPracticeRecord { get; }
        /// <summary>
        /// 班级知识点作答分析结果
        /// </summary>
        IErAllStudentKnowledgeRecordService ErAllStudentKnowledgeRecord { get; }
        /// <summary>
        /// 单人知识点记录
        /// </summary>
        IErSingleStudentKnowledgeRecordService ErSingleStudentKnowledgeRecord { get; }
        /// <summary>
        /// 试卷练习记录试题封存表
        /// </summary>
        IErPaperPracticeRecordQuestionSealUpService ErPaperPracticeRecordQuestionSealUp { get; }
        /// <summary>
        /// 试卷练习学生答题按钮原始数据表
        /// </summary>
        IErStudentButtonAnswerOriginalRecordService ErStudentButtonAnswerOriginalRecord { get; }
        /// <summary>
        /// 试卷练习学生答题笔记原始数据表
        /// </summary>
        IErStudentHandwriteAnswerOriginalRecordService ErStudentHandwriteAnswerOriginalRecord { get; }
        /// <summary>
        /// 试卷练习学生信息封存表
        /// </summary>
        IErPaperPracticeRecordStudentSealUpService ErPaperPracticeRecordStudentSealUp { get; }
        /// <summary>
        /// 习题练习记录表
        /// </summary>
        IErPaperPracticeRecordService ErPracticeRecord { get; }
        /// <summary>
        /// 学生单道提作答记录表(原始数据)
        /// </summary>
        IErOriginalRecordService ErOriginalRecord { get; }
        /// <summary>
        /// 学生单道题作答记录分析
        /// </summary>
        IErSingleStudentQuestionRecordService ErSingleStudentQuestionRecord { get; }
        /// <summary>
        /// 学生整套题作答记录分析
        /// </summary>
        IErSingleStudentPracticeRecordService ErSingleStudentPracticeRecord { get; }
        /// <summary>
        /// 学生-设备
        /// </summary>
        ITStudentDeviceService TStudentDeviceService { get; }

        /// <summary>
        /// 是否开启word标识
        /// </summary>
        IErControlWordPanelService ErControlWordPanel { get; }
        /// <summary>
        /// 登录日志
        /// </summary>
        IErLoginLogService ErLoginLog { get; }
    }
}