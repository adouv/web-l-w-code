using MLPen.Packs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MLPen.Controls
{
    /// <summary>
    /// UCTablet.xaml 的交互逻辑
    /// </summary>
    public partial class UCTablet : UserControl
    {
        #region 对外属性
        public static readonly DependencyProperty StudentIdProperty = DependencyProperty.Register("StudentId", typeof(long), typeof(UCTablet), new PropertyMetadata((long)0));
        public static readonly DependencyProperty IsReplayProperty = DependencyProperty.Register("IsReplay", typeof(bool), typeof(UCTablet), new PropertyMetadata(false));
        [Category("外观"), Description("学生ID")]
        public long StudentId
        {
            get { return (long)GetValue(StudentIdProperty); }
            set { SetValue(StudentIdProperty, value); }
        }
        /// <summary>
        /// 是否正在回放
        /// </summary>
        [Category("外观"), Description("是否正在回放")]
        public bool IsReplay
        {
            get { return (bool)GetValue(IsReplayProperty); }
            set { SetValue(IsReplayProperty, value); }
        }
        #endregion

        private DrawingAttributes drawingAttributes;
        private PenDevice mPen;
        private Thread mMainThread;

        public UCTablet()
        {
            InitializeComponent();

            Loaded += (s, e) =>
            {
                drawingAttributes = new DrawingAttributes
                {
                    Color = Colors.Black,
                    Width = 0.9,
                    Height = 0.9,
                    StylusTip = StylusTip.Ellipse,
                    FitToCurve = false,
                    StylusTipTransform = new Matrix(1, 1.5, 2.2, 1.0, 0.0, 0.0),
                    IsHighlighter = false,
                    IgnorePressure = false
                };
                inkPen.DefaultDrawingAttributes = drawingAttributes;

                mPen = PenController.Instance.GetPen(StudentId);
                if (mPen != null)
                {
                    mPen.HandlerWriteing += HandlerWriteing;
                    ShowHandwriting(mPen.GetPoints(), false);

                    mMainThread = new Thread(() =>
                    {
                        while (!App.IsExit)
                        {
                            List<PenPoint> points = new List<PenPoint>();
                            while (mRealtimeStacks.Count > 0)
                            {
                                try
                                {
                                    var point = mRealtimeStacks.Dequeue();
                                    if (point == null) continue;
                                    points.Add(point);
                                }
                                catch
                                {
                                    continue;
                                }

                            }
                            if (points.Count > 0) this.UICall(updateUI, points);
                            Thread.Sleep(1);
                        }
                    });
                    mMainThread.Start();
                }
                else
                {
                    PenLoaded?.Invoke(mPen, new EventArgs());
                }
            };
            Unloaded += (s, e) =>
            {
                Close();
            };
        }

        internal event EventHandler<EventArgs> PenLoaded;

        /// <summary>
        /// 关闭，并释放所有资源
        /// </summary>
        internal void Close()
        {
            try { mMainThread.Abort(); } catch { }
            if (mPen != null)
            {
                mPen.HandlerWriteing -= HandlerWriteing;
            }
            if (IsReplay) StopReplay();

            if (mReplayQueues != null) mReplayQueues.Clear();
            if (mReplayQueues != null) mReplayQueues.Clear();
            inkPen.Strokes.Clear();

            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// 绑定绘制事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void HandlerWriteing(object sender, PenEvents.WriteingEventArgs e)
        {
            foreach (var item in e.PenPoints)
            {
                mRealtimeStacks.Enqueue(item);
            }
        }

        #region 放大与缩小
        public void SetZoom(double scale)
        {
            Transform transform = new ScaleTransform(scale, scale) { CenterX = 0.5, CenterY = 0.5 };
            inkPen.LayoutTransform = transform;
        }
        public void Zoom(double scale)
        {
            if (inkPen.LayoutTransform != null)
            {
                Point resultPoint;
                inkPen.LayoutTransform.TryTransform(new Point(1, 1), out resultPoint);
                double originalScale = resultPoint.X / 1.0;
                inkPen.LayoutTransform = new ScaleTransform(originalScale * scale, originalScale * scale);
            }
            else
            {
                Transform transform = new ScaleTransform(scale, scale) { CenterX = 0.5, CenterY = 0.5 };
                inkPen.LayoutTransform = transform;
            }
        }
        #endregion

        /// <summary>
        /// 笔迹回显
        /// </summary>
        public void PenlineEcho()
        {
            if (IsReplay) return;
            if (mPen != null)
            {
                var points = mPen.GetPoints();
                ShowHandwriting(points, true);
            }
            else if (IsShowHistory)
            {
                ShowHandwriting(HistoryHandwritings, true);
            }
        }
        private bool IsShowHistory = false;
        private List<PenPoint> HistoryHandwritings;
        /// <summary>
        /// 设置历史笔迹
        /// </summary>
        /// <param name="list"></param>
        internal void SetHistoryHandwriting(List<PenPoint> list)
        {
            this.IsShowHistory = true;
            HistoryHandwritings = list;
            ShowHandwriting(HistoryHandwritings, false);
        }

        [DllImport("gdi32.dll")]
        private static extern int GetDeviceCaps(IntPtr hdc, int Index);
        public static double MillimetersToPixelsWidth(double length) //length是毫米，1厘米=10毫米
        {
            var panle = new System.Windows.Forms.Panel();
            System.Drawing.Graphics g = System.Drawing.Graphics.FromHwnd(panle.Handle);
            IntPtr hdc = g.GetHdc();
            int width = GetDeviceCaps(hdc, 4);     // HORZRES 
            int pixels = GetDeviceCaps(hdc, 8);     // BITSPIXEL
            g.ReleaseHdc(hdc);
            return (((double)pixels / (double)width) * (double)length);
        }

        #region 计算绘制坐标点
        private StylusPoint GetStylusPoint(PenPoint point)
        {
            var pressure = (point.Pressure / 255f);
            return new StylusPoint((point.X + 350) / 2, (point.Y - 330) / 2, pressure);
        }
        #endregion

        #region 回显笔迹
        /// <summary>
        /// 回显笔迹
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ShowHandwriting(List<PenPoint> points, bool isAnimation)
        {
            if (isAnimation)
            {
                if (IsReplay) return;
                StartReplay(points);
            }
            else
            {
                this.UIAsync(() =>
                {
                    var strokes = new StrokeCollection();
                    var styles = new StylusPointCollection();
                    foreach (var point in points)
                    {
                        if (point == null) continue;
                        if (point.Pressure == 0x00)
                        {
                            if (styles.Count == 0) continue;
                            styles = new StylusPointCollection();
                        }
                        else
                        {
                            styles.Add(GetStylusPoint(point));
                        }
                        if (styles.Count == 1)
                        {
                            strokes.Add(new Stroke(styles)
                            {
                                DrawingAttributes = drawingAttributes
                            });
                        }
                    }
                    this.UICall(() => { inkPen.Strokes = strokes; });
                });
            }
        }
        #endregion

        #region 回放
        private Queue<PenPoint> mReplayQueues; //回放队列 
        private Thread mReplayThread;//回放启动进程
        private System.Windows.Threading.DispatcherTimer mReplayTime;//回放绘制定时器
        private StylusPointCollection mReplayStylus;

        private void StartReplay(List<PenPoint> points)
        {
            if (points.Count == 0) return;
            inkPen.Strokes.Clear();
            IsReplay = true;
            mReplayQueues = new Queue<PenPoint>();
            mReplayStylus = new StylusPointCollection();
            if (mReplayTime == null)
            {
                mReplayTime = new System.Windows.Threading.DispatcherTimer();
                mReplayTime.Interval = TimeSpan.FromMilliseconds(10);
            }
            mReplayTime.Tick += Replaying;
            mReplayThread = new Thread(state =>
            {
                var list = state as List<PenPoint>;
                foreach (var point in list)
                {
                    mReplayQueues.Enqueue(point);
                }
            });
            mReplayThread.Start(points);
            mReplayTime.Start();
        }
        private void Replaying(object sender, EventArgs e)
        {
            var point = mReplayQueues.Count == 0 ? null : mReplayQueues.Dequeue();
            if (point != null)
            {
                if (point.Pressure == 0x00)
                {
                    if (mReplayStylus.Count == 0) return;
                    mReplayStylus = new StylusPointCollection();
                }
                else
                {
                    mReplayStylus.Add(GetStylusPoint(point));
                }
                if (mReplayStylus.Count == 1)
                {
                    lock (mReplayStylus)
                    {
                        inkPen.Strokes.Add(new Stroke(mReplayStylus)
                        {
                            DrawingAttributes = drawingAttributes
                        });
                    }
                }
            }
            else if (mReplayThread.ThreadState != ThreadState.Running) StopReplay();
        }
        private void StopReplay()
        {
            try { mReplayThread.Abort(); } catch { }

            mReplayTime.Stop();
            mReplayTime.Tick -= Replaying;
            IsReplay = false;
        }
        #endregion

        #region 实时绘制
        private Queue<PenPoint> mRealtimeStacks = new Queue<PenPoint>();
        private StylusPointCollection mRealtimeStylus = new StylusPointCollection();
        private void updateUI(List<PenPoint> points)
        {
            foreach (var point in points)
            {
                if (point.Pressure == 0x00)
                {
                    if (mRealtimeStylus.Count == 0) continue;
                    mRealtimeStylus = new StylusPointCollection();
                }
                else
                {
                    mRealtimeStylus.Add(GetStylusPoint(point));
                }
                if (mRealtimeStylus.Count == 1)
                {
                    inkPen.Strokes.Add(new Stroke(mRealtimeStylus)
                    {
                        DrawingAttributes = drawingAttributes
                    });
                }
            }
        }
        #endregion
    }
}
