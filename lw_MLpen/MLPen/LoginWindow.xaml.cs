using MLPen.Services;
using System;
using System.Collections.Generic;
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
    /// frmLogin.xaml 的交互逻辑
    /// </summary>
    public partial class LoginWindow : Window
    {
        private FormValidate form = new FormValidate();
        public LoginWindow()
        {
            InitializeComponent();

            initEvent();
            initForm();

            Loaded += (s, e) =>
            {
                username.Text = "guona";
            };
        }

        #region 初始化表单
        /// <summary>
        /// 初始化表单
        /// </summary>
        private void initForm()
        {
            form.Add(username, m => m.Text, "用户名", new FormValidate.ValidItem() { IsUser = true });
            form.Add(password, m => m.Password, "密码", new FormValidate.ValidItem() { IsPass = true });
            form.OnError += error =>
            {
                lblMsg.Visibility = Visibility.Visible;
                lblMsg.Text = error;
            };
            form.OnSuccess += m =>
            {
                m.Add("grant_type", "password");
                m.Add("client_id", 1);
                m.Add("client_secret", "123");
                m.Add("scope", "read");

                Loading.IsOpen = true;
                this.UIAsync(win =>
                {
                    var api = new Api.ApiClient();
                    var result = api.AuthToken(m); //获取授权
                    if (result.flag)
                    {
                        Api.TokenManage.Instance().Update(result.data);

                        var infoResult = api.AccountAuthInfo();//获取登录用户信息

                        this.UICall(() => { Loading.IsOpen = false; });

                        if (infoResult.flag && infoResult.data != null)
                        {
                            APP.StudySession.Account = infoResult.data;
                            APP.StudySession.GardenId = infoResult.data.gardens.Count > 0 ? infoResult.data.gardens.First().gardenId : 0;

                            this.UICall(() =>
                            {
                                this.DialogResult = true;
                            });
                        }
                        else
                        {
                            this.UICall(() =>
                            {
                                lblMsg.Visibility = Visibility.Visible;
                                lblMsg.Text = "用户名或密码错误.";
                            });
                        }
                    }
                    else
                    {
                        this.UICall(() =>
                        {
                            Loading.IsOpen = false;
                            lblMsg.Visibility = Visibility.Visible;
                            lblMsg.Text = "用户名或密码错误.";
                        });
                    }
                });
            };
        }
        #endregion

        #region 初始化事件
        private void initEvent()
        {
            this.btnMinimize.Click += (s, e) =>
            {
                this.WindowState = WindowState.Minimized;
            };
            this.btnClose.Click += (s, e) =>
            {
                this.Close();
            };
            this.LogoTop.MouseLeftButtonDown += (s, e) =>
            {
                this.DragMove();
            };

            this.btnLogin.Click += (s, e) =>
            {
                lblMsg.Visibility = Visibility.Collapsed;
                form.Validate();
            };

            this.Loading.IsOpenChanged += (s, e) =>
            {
                this.btnLogin.IsEnabled = !this.Loading.IsOpen;
            };
        }
        #endregion

        #region 找回密码
        /// <summary>
        /// 找回密码
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ForgetPasswordClick(object sender, RoutedEventArgs e)
        {
            this.Opacity = 0;
            var chrome = new ChormeWindow();
            chrome.Address = "~/html/findpassword.html";
            chrome.ShowDialog();
            this.Opacity = 1;
        }
        #endregion
    }
}
