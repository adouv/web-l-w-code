using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Controls;
using MLPen.ModernUI.Windows.UI;

namespace MLPen
{
    internal class FormValidate
    {
        const string m_pattern_user = @"^[a-zA-Z]+[\w-]{2,20}";
        const string m_pattern_password = @"^[\w@$*#_]{6,20}$";
        const string m_pattern_folder = @"[a-zA-Z]\:[\\a-zA-Z0-9_\\]+[\.]?[a-zA-Z0-9_]+";
        Dictionary<string, object> datas = new Dictionary<string, object>();
        private class Item
        {
            public Func<object> Value { get; set; }
            public Action<object> Success { get; set; }
            public Action<string> Error { get; set; }
            public ValidItem Valid { get; set; }

        }
        private List<Item> list = new List<Item>();

        /// <summary>
        /// 验证类型
        /// </summary>
        internal class ValidItem
        {
            /// <summary>
            /// 验证用户名
            /// </summary>
            public bool IsUser { get; set; }
            /// <summary>
            /// 验证密码
            /// </summary>
            public bool IsPass { get; set; }
            /// <summary>
            /// 是否必填
            /// </summary>
            public bool IsRequired { get; set; } = true;
            /// <summary>
            /// 验证邮件
            /// </summary>
            public bool IsEMail { get; set; }
            /// <summary>
            /// 是否是目录
            /// </summary>
            public bool IsFolder { get; set; }
            /// <summary>
            /// 是否是整数
            /// </summary>
            public bool IsInteger { get; set; }
        }
        internal Action<string> OnError;
        internal Action<Dictionary<string, object>> OnSuccess;

        internal void Add<T, P>(T control, Expression<Func<T, P>> expression, string title, ValidItem valid) where T : Control
        {
            var name = control.Name;
            list.Add(new Item()
            {
                Value = () =>
                {
                    return expression.Compile()(control);
                },
                Valid = valid,
                Success = value =>
                {
                    datas.Add(name, value);
                },
                Error = error =>
                {
                    OnError?.Invoke(error.Formats(title));
                    control.Focus();
                }
            });
        }

        private string CheckForm(Item item, object formValue)
        {
            var value = Convert.ToString(formValue);
            if (item.Valid.IsRequired && value.IsEmpty())
            {
                return "{0}不能为空";
            }
            if (item.Valid.IsUser)
            {
                if (value.Length < 3) return "{0}长度不能小于3位.";
                else if (value.Length > 20) return "{0}长度不能大于20位.";
                else if (!Regex.IsMatch(value, m_pattern_user)) return "{0}格式不正确.";
            }
            if (item.Valid.IsPass)
            {
                if (value.Length < 6) return "{0}长度不能小于6位.";
                else if (value.Length > 20) return "{0}长度不能大于20位.";
                else if (!Regex.IsMatch(value, m_pattern_password)) return "{0}格式不正确.";
            }
            if (item.Valid.IsEMail)
            {
                if (!Helpers.ValidateHelper.IsEmail(value)) return "{0}格式不正确.";
            }
            if (item.Valid.IsFolder)
            {
                if (!Regex.IsMatch(value, m_pattern_folder)) return "{0}不是有效的目录路径.";
            }
            if (item.Valid.IsInteger)
            {
                if (!Helpers.ValidateHelper.IsInteger(value)) return "{0}应该为正整数.";
            }
            return null;
        }

        /// <summary>
        /// 开始验证表单
        /// </summary>
        internal void Validate()
        {
            datas.Clear();
            var success = true;
            foreach (var item in list)
            {
                var value = item.Value();
                var message = CheckForm(item, value);
                if (message.IsEmpty())
                {
                    item.Success(value);
                }
                else
                {
                    success = false;
                    item.Error(message);
                    break;
                }
            }
            if (success)
            {
                OnSuccess?.Invoke(datas);
            }
        }
    }
}
