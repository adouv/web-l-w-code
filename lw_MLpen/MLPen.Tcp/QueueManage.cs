using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MLPen
{
    /// <summary>
    /// 笔迹队列管理（分发）
    /// </summary>
    public class QueueManage
    {
        /// <summary>
        /// 全部
        /// </summary>
        private Queue<Packs.Pendot> mALLPendots = new Queue<Packs.Pendot>();
        /// <summary>
        /// 数据库存储使用
        /// </summary>
        private Queue<Packs.Pendot> mDBPendots = new Queue<Packs.Pendot>();
        /// <summary>
        /// 笔迹使用
        /// </summary>
        private Queue<Packs.Pendot> mPendots = new Queue<Packs.Pendot>();
        private bool mIsExit = false;
        private Thread mALLThread;
        private Thread mDBThread;
        private Thread mPenThread;

        private static QueueManage mInstance;
        public static QueueManage Instance
        {
            get
            {
                if (mInstance == null) mInstance = new QueueManage();
                return mInstance;
            }
        }
        private QueueManage()
        {
            mALLThread = new Thread(new ThreadStart(Run));
            mALLThread.IsBackground = true;

            mDBThread = new Thread(new ThreadStart(DBSavePoint));
            mDBThread.IsBackground = true;

            mPenThread = new Thread(new ThreadStart(PenSavePoint));
            mPenThread.IsBackground = true;
        }

        private void Run()
        {
            while (!mIsExit)
            {
                while (mALLPendots.Count > 0)
                {
                    try
                    {
                        var item = mALLPendots.Dequeue();
                        mDBPendots.Enqueue(item);
                        mPendots.Enqueue(item);
                    }
                    catch
                    {
                        continue;
                    }
                    
                }
                Thread.Sleep(1);
            }
        }
        /// <summary>
        /// 上一次坐标点（去重）
        /// </summary>
        private Dictionary<long, PenPoint> mPrevPoints = new Dictionary<long, PenPoint>();
        /// <summary>
        /// 添加笔迹
        /// </summary>
        /// <param name="pendot"></param>
        internal void AddPendot(Packs.Pendot pendot)
        {
            // 过滤重复的点
            if (mPrevPoints.ContainsKey(pendot.penid))
            {
                var point = mPrevPoints[pendot.penid];
                if (point.X == pendot.x && point.Y == pendot.y) return;
                else
                {
                    point.X = pendot.x;
                    point.Y = pendot.y;
                    mPrevPoints[pendot.penid] = point;
                }
            }
            else
            {
                mPrevPoints.Add(pendot.penid, new PenPoint(pendot));
            }
            mALLPendots.Enqueue(pendot);
        }

        /// <summary>
        /// 处理数据库
        /// </summary>
        private void DBSavePoint()
        {
            while (!mIsExit)
            {
                if (mDBPendots.Count > 0)
                {
                    var pendots = new List<Packs.Pendot>();
                    while (mDBPendots.Count > 0 && pendots.Count <= 200)
                    {
                        var item = mDBPendots.Dequeue();
                        pendots.Add(item);
                    }
                    SavePoints(pendots);
                }
                Thread.Sleep(10);
            }
        }
        /// <summary>
        /// 处理笔迹
        /// </summary>
        private void PenSavePoint()
        {
            while (!mIsExit)
            {
                if (mPendots.Count > 0)
                {
                    var pendots = new List<Packs.Pendot>();
                    while (mPendots.Count > 0 && pendots.Count < 80)
                    {
                        var item = mPendots.Dequeue();
                        pendots.Add(item);
                    }
                    PenController.Instance.AddPendots(pendots);
                }
                Thread.Sleep(3);
            }
        }

        /// <summary>
        /// 开始处理笔迹
        /// </summary>
        public void Start()
        {
            mALLThread.Start();
            mDBThread.Start();
            mPenThread.Start();
        }
        /// <summary>
        /// 退出笔迹处理
        /// </summary>
        public void Exit()
        {
            mIsExit = true;
            try { mALLThread.Abort(); } catch { }
            try { mDBThread.Abort(); } catch { }
            try { mPenThread.Abort(); } catch { }
        }

        #region 存入原始笔迹
        /// <summary>
        /// 存入原始笔迹
        /// </summary>
        /// <param name="state"></param>
        private void SavePoints(List<Packs.Pendot> pendots)
        {
            if (APP.StudySession.IsAnswer)
            {
                SaveAnswerOriginal(pendots);
            }
            else if (APP.StudySession.IsSelfJudgment)
            {
                SaveSelfJudgment(pendots);
            }
        }
        #endregion
        #region 存入原始笔迹-答题记录
        /// <summary>
        /// 存入答题记录笔迹原始记录
        /// </summary>
        /// <param name="state"></param>
        private void SaveAnswerOriginal(List<Packs.Pendot> pendots)
        {
            var list = new List<Repository.Entitys.ErStudentHandwriteAnswerOriginalRecord>();
            foreach (var item in pendots)
            {
                var handwrite = Helpers.JsonHelper.ToJSON(item);
                var record = new Repository.Entitys.ErStudentHandwriteAnswerOriginalRecord()
                {
                    id = Guid.NewGuid().ToUUID(),
                    student_id = item.penid,
                    question_id = APP.StudySession.QuestionID,
                    exercise_record_id = APP.StudySession.PracticeRecordId,
                    create_time = DateTime.Now,
                    handwrite = handwrite,
                    //is_submit = false,//暂定不要
                    step_number = APP.StudySession.QuestionStepNumber,
                    synchronous_status = 0
                };
                list.Add(record);
            }
            try
            {
                APP.IDatas.ErStudentHandwriteAnswerOriginalRecord.InsertRange(list);
            }
            catch { }
        }
        #endregion
        #region 存入原始笔迹-自判记录
        /// <summary>
        /// 存入自判记录笔迹原始记录
        /// </summary>
        /// <param name="state"></param>
        private void SaveSelfJudgment(List<Packs.Pendot> pendots)
        {
        }
        #endregion
    }
}
