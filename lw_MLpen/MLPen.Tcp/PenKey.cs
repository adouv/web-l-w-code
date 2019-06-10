using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    public class PenKey
    {
        /// <summary>
        /// 学生ID
        /// </summary>
        public long StudentId { get; set; }
        /// <summary>
        /// 原始按键值
        /// </summary>
        public byte Prob { get; private set; }
        /// <summary>
        /// 按键
        /// </summary>
        public string Key { get; private set; }
        /// <summary>
        /// 是否是Ok按键
        /// </summary>
        public bool IsOK { get; private set; }
        /// <summary>
        /// 是否是Del按键
        /// </summary>
        public bool IsDel { get; private set; }
        /// <summary>
        /// 是否是笔迹
        /// </summary>
        public bool IsHandwriting { get; private set; }

        /// <summary>
        /// 实例化按键
        /// </summary>
        /// <param name="problem"></param>
        public PenKey(Packs.Problem problem)
        {
            this.Prob = problem.prob;
            this.StudentId = problem.penid;
            this.Key = ToLetter();
            this.IsOK = this.Key == "OK";
            this.IsDel = this.Key == "DEL";
            this.IsHandwriting = false;
        }
        /// <summary>
        /// 实例化笔迹
        /// </summary>
        /// <param name="studentId"></param>
        public PenKey(long studentId)
        {
            this.StudentId = studentId;
            this.IsHandwriting = true;
            this.Prob = 0x00;
            this.Key = null;
            this.IsOK = false;
            this.IsDel = false;
        }

        /// <summary>
        /// 将KEY转换成字母
        /// </summary>
        private string ToLetter()
        {
            var key = this.Prob.ToPenAscii();
            switch (key)
            {
                case "1": return "A"; ;
                case "2": return "B";
                case "3": return "C";
                case "4": return "D";
                case "5": return "E";
                case "6": return "F";
                case "7": return "G";
                case "8": return "DOWN";
                case "9": return "NO";
                case "0": return "YES";
                default: return key;
            }
        }

        /// <summary>
        /// 转换成数字
        /// </summary>
        public void ConvertToNumber()
        {
            this.Key = this.Prob.ToPenAscii();
        }
    }
}
