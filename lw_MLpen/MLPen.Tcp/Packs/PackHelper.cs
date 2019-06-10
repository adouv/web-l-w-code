using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Packs
{
    public class PackHelper
    {
        private byte[] srcData;
        public PacketHeader header;
        private int headerSize;

        private PackHelper(byte[] datas)
        {
            if (datas != null)
            {
                var hexString = datas.ToHexString();
                var data = Helpers.EncryptHelper.DESDecrypst(hexString);
                if (data.IsEmpty()) return;
                var bytes = data.ToHexBytes();

                this.srcData = bytes;
                this.header = this.srcData.ToStruct<PacketHeader>();
            }
            else
            {
                this.header = new PacketHeader()
                {
                    tag = 0xAA,
                    deviceid = new byte[6],
                    req_ack = 0x00
                };
            }
            this.headerSize = Marshal.SizeOf<PacketHeader>();
        }
        /// <summary>
        /// 创建解析包
        /// </summary>
        /// <param name="datas"></param>
        /// <returns></returns>
        public static PackHelper Create(byte[] datas)
        {
            return new PackHelper(datas);
        }
        /// <summary>
        /// 创建发送包
        /// </summary>
        /// <returns></returns>
        public static PackHelper CreateSend(byte[] deviceId)
        {
            var helper = new PackHelper(null);
            helper.header = helper.cloneHeader();
            helper.header.deviceid = deviceId;
            return helper;
        }

        /// <summary>
        /// 获取数据校验码
        /// </summary>
        /// <param name="bytes"></param>
        /// <returns></returns>
        private ushort crc16(byte[] bytes)
        {
            var crc16 = Helpers.CRCHelper.ToModbusCRC16(bytes);
            var crc16_bytes = Helpers.CRCHelper.StringToHexByte(crc16);
            return crc16_bytes.ToUInt16();
        }
        /// <summary>
        /// 校验头部是否合法
        /// </summary>
        /// <returns></returns>
        private bool IsValidHeader()
        {
            if (this.headerSize == 0) return false;

            var newArray = srcData.GetRange(3, this.headerSize - 3);
            var success = header.pcrc16 == crc16(newArray);
            return success;
        }
        /// <summary>
        /// 校验数据是否合法
        /// </summary>
        private bool IsValidData()
        {
            if (this.headerSize == 0) return false;

            var newArray = srcData.GetRange(this.headerSize, header.cmd_len);
            var success = header.cmd_dcrc16 == crc16(newArray);
            return success;
        }

        /// <summary>
        /// 校验是否通过
        /// </summary>
        public bool IsValidSuccess
        {
            get
            {
                return IsValidHeader() && IsValidData();
            }
        }

        /// <summary>
        /// 克隆头部
        /// </summary>
        /// <returns></returns>
        private PacketHeader cloneHeader()
        {
            return new PacketHeader()
            {
                tag = header.tag,
                pcrc16 = header.pcrc16,
                packet_type = header.packet_type,
                deviceid = header.deviceid,
                sn = header.sn,
                req_ack = header.req_ack,
                cmd = header.cmd,
                cmd_dcrc16 = header.cmd_dcrc16,
                cmd_len = header.cmd_len
            };
        }

        private byte[] BuildBytes(PacketHeader _header, byte[] _datas, bool isTcp)
        {
            _header.cmd_dcrc16 = crc16(_datas);
            _header.cmd_len = (ushort)_datas.Length;

            var headerBytes = Helpers.StructHelper.StructToBytes(_header);
            var headerBytesNew = headerBytes.GetRange(3, this.headerSize - 3);
            _header.pcrc16 = crc16(headerBytesNew);


            headerBytes = Helpers.StructHelper.StructToBytes(_header);
            _datas = _datas.MergeStart(headerBytes);
            if (isTcp)
            {
                var hexString = _datas.ToHexString();
                var data = Helpers.EncryptHelper.DESEncrypt(hexString);
                return data.ToHexBytes();
            }
            else
            {
                return _datas;
            }
        }

        internal byte[] OpenUser(Packs.BaseInfo info, byte kh_sta)
        {
            var _header = cloneHeader();
            _header.packet_type = 0x01;
            _header.req_ack = 0x00;
            _header.cmd = 0x04;
            _header.sn = (ushort)(_header.sn + 1);
            info.KH_Sta = kh_sta;
            return BuildBytes(_header, info, true);
        }

        private byte[] BuildBytes<T>(PacketHeader _header, T _data, bool isTcp) where T : struct
        {
            var dataBytes = Helpers.StructHelper.StructToBytes(_data);
            return BuildBytes(_header, dataBytes, isTcp);
        }

        #region 获取数据对象
        /// <summary>
        /// 获取数据对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T GetPack<T>() where T : struct
        {
            var bytes = this.srcData.GetRange(this.headerSize, this.header.cmd_len);
            return Helpers.StructHelper.BytesToStruct<T>(bytes);
        }
        #endregion

        #region 发送
        /// <summary>
        /// 获取退出TCP包
        /// </summary>
        public byte[] SendExitPack()
        {
            var info = new ACKInf() { cmd_sta = 1 };
            var _header = cloneHeader();
            _header.req_ack = 0x00;
            _header.cmd = 0x0A;
            _header.packet_type = 0x01;
            _header.sn = (ushort)(_header.sn + 1);

            return BuildBytes(_header, info, true);
        }
        /// <summary>
        /// 发送字母（测试）
        /// </summary>
        /// <returns></returns>
        public byte[] SendCode()
        {
            var info = new ACKInf() { cmd_sta = 0x42 };
            var _header = cloneHeader();
            _header.req_ack = 0x00;
            _header.cmd = 0x01;
            _header.packet_type = 0x01;
            _header.sn = (ushort)(_header.sn + 1);

            return BuildBytes(_header, info, true);
        }
        #endregion

        #region 应答
        /// <summary>
        /// 应答数据上报
        /// </summary>
        internal byte[] ReplyInformationReporting()
        {
            var _header = cloneHeader();
            _header.req_ack = 1;

            var info = new ACKInf() { cmd_sta = 0x01 };

            return BuildBytes(_header, info, true);
        }
        #endregion

        #region 生成消息发送包
        /// <summary>
        /// 生成消息发送包
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        internal byte[] SendTextPack(string text, bool isTcp)
        {
            var datas = Encoding.GetEncoding("GB2312").GetBytes(text);

            var _header = cloneHeader();
            _header.req_ack = 0x00;
            _header.cmd = 0x01;
            _header.packet_type = 0x01;
            _header.sn = (ushort)(_header.sn + 1);

            return BuildBytes(_header, datas, isTcp);
        }
        #endregion
    }
}
