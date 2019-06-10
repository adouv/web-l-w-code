using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Entitys;
using System.Net;

namespace MLPen.Repository.Interfaces
{
    /// <summary>
    /// 学生-设备(接口)
    /// </summary>
    public interface ITStudentDeviceService : IServiceBase<TStudentDevice>, IAutofac
    {
        /// <summary>
        /// 更新学生设备
        /// </summary>
        /// <param name="model">参数</param>
        void UpdateDevice(TStudentDeviceModel.Update model);
        /// <summary>
        /// 获取设备ID
        /// </summary>
        /// <param name="studentId">学生ID</param>
        /// <returns></returns>
        byte[] ReadDeviceId(long studentId);
        /// <summary>
        /// 更新设备IP地址
        /// </summary>
        /// <param name="studentId">学生ID</param>
        /// <param name="ip">IP地址</param>
        void UpdateIPAddress(long studentId, string ip);
    }
}