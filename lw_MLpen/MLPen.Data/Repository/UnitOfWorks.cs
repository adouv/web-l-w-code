using Chloe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    public interface IUnitOfWorks : IDisposable, IAutofac
    {
        /// <summary>
        /// 数据源（实例化的地方）
        /// </summary>
        IDbContext DBContext { get; }
        /// <summary>
        /// 获取服务
        /// </summary>
        IAppService AppService { get; }
    }

    public class UnitOfWorks : Disposable, IUnitOfWorks
    {
        /// <summary>
        /// 数据源（实例化的地方）
        /// </summary>
        public IDbContext DBContext { get; private set; }
        /// <summary>
        /// APP服务获取器
        /// </summary>
        public IAppService AppService { get; private set; }

        public UnitOfWorks(IAppService service)
        {
            AppService = service;
            DBContext = DbContextFactory.CreateContext();
        }

        protected override void DisposeCore()
        {
            if (DBContext != null) DBContext.Dispose();
            base.DisposeCore();
        }
    }
}
