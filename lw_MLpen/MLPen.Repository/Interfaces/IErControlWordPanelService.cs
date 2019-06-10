using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Interfaces
{
    /// <summary>
    /// 班级知识点作答分析结果(接口)
    /// </summary>
    public interface IErControlWordPanelService : IServiceBase<ErControlWordPanel>, IAutofac
    {
        void updateDisplayFlagToShow();
    }
}