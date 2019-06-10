using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    public interface IServiceBase<TEntity> : IRepositoryBase<TEntity> where TEntity : IEntity
    {
    }
}
