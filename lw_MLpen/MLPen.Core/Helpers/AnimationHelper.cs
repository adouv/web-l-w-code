using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media.Animation;

namespace MLPen.Helpers
{
    public class AnimationHelper
    {
        #region 透明度操作
        /// <summary>
        /// 透明度操作
        /// </summary>
        /// <param name="to">改变的结果</param>
        /// <param name="millisconds">多少毫秒</param>
        /// <param name="ele">对象</param>
        /// <param name="action">事件</param>
        public static void Opacity(double to, int millisconds, FrameworkElement ele, Action action = null)
        {
            DoubleAnimationUsingKeyFrames AnimationsOpacity = new DoubleAnimationUsingKeyFrames();
            AnimationsOpacity.KeyFrames.Add(new EasingDoubleKeyFrame()
            {
                Value = to,
                KeyTime = TimeSpan.FromMilliseconds(millisconds)
            });
            Storyboard.SetTarget(AnimationsOpacity, ele);
            Storyboard.SetTargetProperty(AnimationsOpacity, new PropertyPath(FrameworkElement.OpacityProperty));
            Storyboard sbAni = new Storyboard();
            sbAni.Children.Add(AnimationsOpacity);
            sbAni.Completed += (e, ea) =>
            {
                action?.Invoke();
            };
            sbAni.Begin();
        }
        #endregion

        #region 过度动画
        /// <summary>
        /// 过度动画
        /// </summary>
        /// <param name="target">要操作的对象</param>
        /// <param name="PropertyName">要变化的属性名称</param>
        /// <param name="Milliseconds">过度时间（秒）</param>
        /// <param name="from">开始值</param>
        /// <param name="to">结束值</param>
        /// <param name="auto">是否立即播放</param>
        /// <param name="CompletedEvent">播放完后的事件</param>
        /// <returns></returns>
        public static Storyboard EDoubleAnimation(DependencyObject target, String PropertyName, int Milliseconds, double from, double to, bool auto, EventHandler CompletedEvent)
        {
            //实例化Storyboard
            Storyboard storyboard = new Storyboard();
            //实例化X轴动画对象
            DoubleAnimation OpacityAnimation = new DoubleAnimation();
            //设置动画延时时间
            OpacityAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(Milliseconds));
            //设置动画初始值
            OpacityAnimation.From = from;
            //设置动画完成值
            OpacityAnimation.To = to;
            //设置动画操作对象
            Storyboard.SetTarget(OpacityAnimation, target);
            //设置动画操作对象的属性
            Storyboard.SetTargetProperty(OpacityAnimation, new PropertyPath(PropertyName));
            //将动画加载到Storyboard
            storyboard.Children.Add(OpacityAnimation);
            //开始动画
            if (auto)
            {
                storyboard.Begin();
            }
            if (CompletedEvent != null)
                storyboard.Completed += new EventHandler(CompletedEvent);
            return storyboard;
        }
        #endregion
    }
}
