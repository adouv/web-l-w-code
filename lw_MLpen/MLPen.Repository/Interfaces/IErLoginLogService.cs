
using MLPen.Data;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Interfaces
{
    /// <summary>
    /// 登录日志(接口)
    /// </summary>
    public interface IErLoginLogService : IServiceBase<ErLoginLog>, IAutofac
    {

        void saveLoginLog(ErLoginLog loginLog);
    }
}