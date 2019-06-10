using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Interfaces;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Services
{
    /// <summary>
    /// 班级知识点作答分析结果(接口实现)
    ///</summary>
    internal class ErLoginLogService : ServiceBase<ErLoginLog>, IErLoginLogService
    {
        public ErLoginLogService(IUnitOfWorks works) : base(works) { }

        public void saveLoginLog(ErLoginLog loginLog) {
            this.Insert(loginLog);
        }
    }
}