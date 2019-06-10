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
using System.Windows.Shapes;

namespace MLPen.Dialogs
{
    /// <summary>
    /// SelfJudgmentModeDialog.xaml 的交互逻辑
    /// </summary>
    public partial class SelfJudgmentModeDialog : MLDialog
    {
        public string SelfJudgmentMode { get; private set; } = "score";
        public int Score { get; private set; } = 100;

        public SelfJudgmentModeDialog()
        {
            InitializeComponent();
        }
        private void ShowMessage(string message)
        {
            lblMsg.Text = message;
            lblMsg.Visibility = Visibility.Visible;
        }
        private void ModeCheckedChange(object sender, RoutedEventArgs e)
        {
            if (ScorePanel == null) return;

            var radio = sender as RadioButton;
            this.SelfJudgmentMode = radio.Tag as string;
            if (this.SelfJudgmentMode == "score")
            {
                ScorePanel.Visibility = Visibility.Visible;
            }
            else
            {
                ScorePanel.Visibility = Visibility.Collapsed;
            }
        }

        private void ConfirmClick(object sender, RoutedEventArgs e)
        {
            lblMsg.Visibility = Visibility.Collapsed;

            if (SelfJudgmentMode == "score")
            {
                if (txtScore.Text.IsEmpty())
                {
                    ShowMessage("请输入分值.");
                    return;
                }
                else if (!Helpers.ValidateHelper.IsIntegerPositive(txtScore.Text))
                {
                    ShowMessage("分数值需为正整数.");
                    return;
                }
                else
                {
                    this.Score = txtScore.Text.TryParse<int>();
                }
            }
            else
            {
                this.Score = 0;
            }

            this.DialogResult = true;
        }
    }
}
