using MLPen.Controls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 浏览器对外脚本
    /// </summary>
    public class ChormeScripts
    {
        private UCChorme mUCChorme;

        public ChormeScripts(UCChorme window)
        {
            this.mUCChorme = window;
        }
        /// <summary>
        /// 显示指定的消息
        /// </summary>
        /// <param name="text"></param>
        /// <param name="title"></param>
        public void showMessage(string text, string title = "提示")
        {
            mUCChorme.UICall(() =>
            {
                MSMessageBox.ShowModal(MSMessageBox.MSMessageBoxButton.OK, title, text);
            });
        }
        /// <summary>
        /// 关闭当前窗口
        /// </summary>
        public void closeWindow()
        {
            mUCChorme.UICall(() => { mUCChorme.CloseWindow(); });
        }

        /// <summary>
        /// 返回给前端页面TOKEN参数
        /// </summary>
        /// <returns></returns>
        public string getToken()
        {
            var tokenManage = Api.TokenManage.Instance();
            if (tokenManage.HasToken)
            {
                return tokenManage.Token;
            }
            return "";
        }

        /// <summary>
        /// 加载试题历史笔记
        /// </summary>
        /// <param name="practiceRecordId">练习卷ID</param>
        /// <param name="questionId">习题ID</param>
        public void loadHistoryHandwritingForQuestion(string practiceRecordId, string questionId)
        {
            var win = new MultiStudyWindow();
            win.loadHistoryHandwritingForQuestion(practiceRecordId, questionId);
        }
        /// <summary>
        /// 加载学生历史笔记
        /// </summary>
        /// <param name="practiceRecordId">练习卷ID</param>
        /// <param name="studentId">学生ID</param>
        public void loadHistoryHandwritingForStudent(string practiceRecordId, long studentId)
        {
            mUCChorme.UICall(() =>
            {
                var win = new SingleStudyWindow(studentId);
                win.LoadHistoryHandwriting(practiceRecordId);
            });
        }
              
    }
}
