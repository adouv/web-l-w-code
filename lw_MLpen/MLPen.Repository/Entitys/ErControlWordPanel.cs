using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 控制word面板显示隐藏实体类
    /// </summary>
    [TableAttribute("er_control_word_panel")]
    public class ErControlWordPanel : IEntity
    {
        [AutoIncrementAttribute]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 20)]
        public long id { get; set; }

        //显示标识0隐藏1显示
        [ColumnAttribute("display_flag", Size = 1)]
        public int display_flag { get; set; }


    }
}