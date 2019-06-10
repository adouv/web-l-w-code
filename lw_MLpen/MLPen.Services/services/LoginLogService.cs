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
    public class LoginLogService : IAutofac
    {

        public void saveLoginLog(ErLoginLog loginLog) {
            APP.IDatas.ErLoginLog.saveLoginLog(loginLog);
        }
    }
}
