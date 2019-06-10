using MLPen.Repository.Interfaces;

namespace MLPen.Repository
{
    /// <summary>
    /// 数据服务
    /// </summary>
    public class DataService : Disposable, IDataService
    {
        private IAppService factory;
        public DataService(IAppService factory)
        {
            this.factory = factory;
        }
        public T GetService<T>()
        {
            return factory.GetService<T>();
        }
        
        public IErAllStudentQuestionRecordService ErAllStudentQuestionRecord => GetService<IErAllStudentQuestionRecordService>(); //班级单道题作答记录分析
        public IErAllStudentPracticeRecordService ErAllStudentPracticeRecord => GetService<IErAllStudentPracticeRecordService>(); //班级试卷作答记录分析
        public IErAllStudentKnowledgeRecordService ErAllStudentKnowledgeRecord => GetService<IErAllStudentKnowledgeRecordService>(); //班级知识点作答分析结果
        public IErSingleStudentKnowledgeRecordService ErSingleStudentKnowledgeRecord => GetService<IErSingleStudentKnowledgeRecordService>(); //单人知识点记录
        public IErPaperPracticeRecordQuestionSealUpService ErPaperPracticeRecordQuestionSealUp => GetService<IErPaperPracticeRecordQuestionSealUpService>(); //试卷练习记录试题封存表
        public IErStudentButtonAnswerOriginalRecordService ErStudentButtonAnswerOriginalRecord => GetService<IErStudentButtonAnswerOriginalRecordService>(); //试卷练习学生答题按钮原始数据表
        public IErStudentHandwriteAnswerOriginalRecordService ErStudentHandwriteAnswerOriginalRecord => GetService<IErStudentHandwriteAnswerOriginalRecordService>(); //试卷练习学生答题笔记原始数据表
        public IErPaperPracticeRecordStudentSealUpService ErPaperPracticeRecordStudentSealUp => GetService<IErPaperPracticeRecordStudentSealUpService>(); //试卷练习学生信息封存表
        public IErPaperPracticeRecordService ErPracticeRecord => GetService<IErPaperPracticeRecordService>(); //习题练习记录表
        public IErOriginalRecordService ErOriginalRecord => GetService<IErOriginalRecordService>(); //学生单道提作答记录表(原始数据)
        public IErSingleStudentQuestionRecordService ErSingleStudentQuestionRecord => GetService<IErSingleStudentQuestionRecordService>(); //学生单道题作答记录分析
        public IErSingleStudentPracticeRecordService ErSingleStudentPracticeRecord => GetService<IErSingleStudentPracticeRecordService>(); //学生整套题作答记录分析
        public ITStudentDeviceService TStudentDeviceService => GetService<ITStudentDeviceService>(); //学生-设备
        public IErControlWordPanelService ErControlWordPanel => GetService<IErControlWordPanelService>();//打开划题面板标识

        public IErLoginLogService ErLoginLog => GetService<IErLoginLogService>();
    }
}