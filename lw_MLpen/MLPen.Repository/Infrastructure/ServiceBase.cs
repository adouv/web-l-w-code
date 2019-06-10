using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Repository
{
    internal abstract class ServiceBase<TEntity> : Data.RepositoryBase<TEntity>, Data.IServiceBase<TEntity> where TEntity : Data.IEntity
    {
        protected IAppService IService { get; private set; }
        protected IDataService IDatas { get; private set; }

        public ServiceBase(Data.IUnitOfWorks unitOfWorks) : base(unitOfWorks.DBContext)
        {
            this.IService = unitOfWorks.AppService;
            IDatas = IService.GetService<IDataService>();
        }
    }
}
