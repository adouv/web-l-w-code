using System;
using Chloe.Annotations;
using MLPen.Data;

namespace MLPen.Repository.Entitys
{
    /// <summary>
    /// 登录日志
    /// </summary>
    [TableAttribute("er_login_log")]
    public class ErLoginLog : IEntity
    {
        [AutoIncrementAttribute]
        [ColumnAttribute("id", IsPrimaryKey = true, Size = 20)]
        public long id { get; set; }

        
        [ColumnAttribute("account_id", Size = 11)]
        public int account_id { get; set; }


        [ColumnAttribute("garden_id", Size = 11)]
        public int garden_id { get; set; }

        [ColumnAttribute("create_time")]
        public DateTime create_time { get; set; }

        public ErLoginLog()
        {
        }

        public ErLoginLog(int account_id, int garden_id, DateTime create_time)
        {
            this.account_id = account_id;
            this.garden_id = garden_id;
            this.create_time = create_time;
        }
    }
}