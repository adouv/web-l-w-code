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
    /// 学生-设备(接口实现)
    ///</summary>
    internal class TStudentDeviceService : ServiceBase<TStudentDevice>, ITStudentDeviceService
    {
        public TStudentDeviceService(IUnitOfWorks works) : base(works) { }

        #region UpdateDevice
        public void UpdateDevice(TStudentDeviceModel.Update model)
        {
            if (this.Any(m => m.id == model.id))
            {
                this.Update(m => m.id == model.id, m => new TStudentDevice
                {
                    deviceid = model.deviceid,
                    deviceip = model.deviceip,
                    update_time = DateTime.Now
                });
            }
            else
            {
                this.Insert(new TStudentDevice
                {
                    id = model.id,
                    deviceid = model.deviceid,
                    deviceip = model.deviceip,
                    update_time = DateTime.Now
                });
            }
        }
        #endregion

        #region ReadDeviceId
        public byte[] ReadDeviceId(long studentId)
        {
            var deviceid = this.Where(m => m.id == studentId).Select(m => m.deviceid).FirstOrDefault();
            if (deviceid.IsEmpty()) return null;
            else return deviceid.Split<byte>();
        }
        #endregion

        #region UpdateIPAddress
        public void UpdateIPAddress(long studentId, string ip)
        {
            this.Update(m => m.id == studentId, m => new TStudentDevice
            {
                deviceip = ip,
                update_time = DateTime.Now
            });
        }
        #endregion
    }
}