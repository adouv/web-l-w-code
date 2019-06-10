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
    internal class ErControlWordPanelService : ServiceBase<ErControlWordPanel>, IErControlWordPanelService
    {
        public ErControlWordPanelService(IUnitOfWorks works) : base(works) { }

        public void updateDisplayFlagToShow()
        {
            this.Update(m => m.display_flag == 0, m => new ErControlWordPanel {
                display_flag = 1
            });
        }
    }
}