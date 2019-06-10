using CefSharp.Wpf;
using MLPen.Repository.Entitys;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            //启动通信
            PenController.Instance.Start();
            QueueManage.Instance.Start();

            LoginWindow window = new LoginWindow();
            bool? dialogResult = window.ShowDialog();
            if (dialogResult.Value != true)
            {
                this.Close();
            }
            else
            {
                //登录成功后，执行MQ同步
                this.UIAsync(win => { MQSync(); });
                ErLoginLog loginLog = new ErLoginLog(APP.StudySession.Account.accountId, APP.StudySession.GardenId, DateTime.Now);
                APP.IDatas.ErLoginLog.saveLoginLog(loginLog);
                this.Loaded += (s, e) =>
                {
                    initBrowser();
                    initWidnowEvents();
                    initEvents();
                    initData();

                    //加密测试
                    //var data = "FC 3F D6 C2 F1 EA 7F A5 FC 18 6C 21 60 46 18 ED 95 2A 5C FE 27 C4 88 3C 75 CE D8 4D 48 FD FE 24".Replace(" ","");
                    //var key = "1368795654521356";
                    ////var crcText = Helpers.CRCHelper.ToCRC16(key);
                    //var text = Helpers.EncryptHelper.DESEncrypt("712F506C1AE9AEE5", key);


                    ////var aa = Helpers.EncryptHelper.DESDecrypst(text, key);
                    //this.TestBox.Text = text;// + aa;
                };
            }
        }

        #region initWidnowEvents
        private void initWidnowEvents()
        {
            this.btnMinimize.Click += (s, e) => { this.WindowState = WindowState.Minimized; };
            this.btnClose.Click += (s, e) => { App.Current.Shutdown(); };
            this.MainNav.MouseLeftButtonDown += (s, e) =>
            {
                this.DragMove();
            };
            this.NavPractice.Click += (s, e) =>
            {
                Practice.Visibility = Visibility.Visible;
                this.NavPractice.IsActive = true;
                Chrome.Visibility = Visibility.Collapsed;
                this.NavTotal.IsActive = false;
            };
            this.NavTotal.Click += (s, e) =>
            {
                Practice.Visibility = Visibility.Collapsed;
                this.NavPractice.IsActive = false;
                Chrome.Visibility = Visibility.Visible;
                this.NavTotal.IsActive = true;
            };
        }
        #endregion

        #region initBrowser
        private void initBrowser()
        {
            Chrome.Address = "~/html/demo.html";
        }
        #endregion

        #region initEvents
        private void initEvents()
        {
        }
        #endregion

        #region initData
        private void initData()
        {
            Practice.ReloadClasses();
        }
        #endregion

        #region MQSync
        private void MQSync()
        {
            var mQ = new Services.MQSynchronousDataService();
            this.UIAsync(win => { mQ.SendErPracticeRecordMsg();
                mQ.SendErPaperPracticeRecordQuestionSealUpMsg();
                mQ.SendErPaperPracticeRecordStudentSealUpMsg();
                mQ.SendErOriginalRecordMsg();
                mQ.SendErSingleStudentQuestionRecordMsg();
                mQ.SendErSingleStudentPracticeRecordMsg();
                mQ.SendErSingleStudentKnowledgeRecordMsg();
                mQ.SendErAllStudentQuestionRecordMsg();
                mQ.SendErAllStudentPracticeRecordMsg();
                mQ.SendErAllStudentKnowledgeRecordMsg();
                //mQ.SendErStudentButtonAnswerOriginalRecordMsg();
                //mQ.SendErStudentHandwriteAnswerOriginalRecordMsg();
            });
        
            //mQ.SendErPracticeRecordMsg();
            //mQ.SendErPaperPracticeRecordQuestionSealUpMsg();
           // mQ.SendErPaperPracticeRecordStudentSealUpMsg();
            //mQ.SendErOriginalRecordMsg();
           // mQ.SendErSingleStudentQuestionRecordMsg();
           // mQ.SendErSingleStudentPracticeRecordMsg();
           // mQ.SendErSingleStudentKnowledgeRecordMsg();
            //mQ.SendErAllStudentQuestionRecordMsg();
            //mQ.SendErAllStudentPracticeRecordMsg();
            //mQ.SendErAllStudentKnowledgeRecordMsg();
            //mQ.SendErStudentButtonAnswerOriginalRecordMsg();
            // mQ.SendErStudentHandwriteAnswerOriginalRecordMsg();
        }
        #endregion

        /// <summary>
        /// 园区切换事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void GardensChange(object sender, SelectionChangedEventArgs e)
        {
            GardensPopup.IsOpen = false;
            switch (GardensListView.SelectedIndex)
            {
                case 0: //切换园区
                    Dialogs.SwitchGardenDialog.OpenDialog(this, id =>
                    {
                        APP.StudySession.GardenId = id;
                        Practice.ReloadClasses();
                    });
                    break;
                case 1://切换账号
                    LoginWindow window = new LoginWindow();
                    bool? dialogResult = window.ShowDialog();
                    if (dialogResult.Value == true)
                    {
                        initData();
                    }
                    break;
                case 2:
                    App.Current.Shutdown();
                    break;
            }
        }
        /// <summary>
        /// 展开更新园区
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ShowGardensListView(object sender, RoutedEventArgs e)
        {
            GardensListView.SelectedIndex = -1;
            GardensPopup.IsOpen = true;
        }
    }
}
