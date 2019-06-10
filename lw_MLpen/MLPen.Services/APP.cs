using Autofac;
using MLPen.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    public static class APP
    {
        /// <summary> 
        /// 数据库操作接口
        /// </summary>
        public static IDataService IDatas => GetService<IDataService>();
        /// <summary>
        /// 原生SQL数据接口
        /// </summary>
        public static ISQLService ISQLs => GetService<ISQLService>();
        /// <summary>
        /// 当前学习参数
        /// </summary>
        public static MSStudySession StudySession = new MSStudySession();
        /// <summary>
        /// 当前容器
        /// </summary>
        private static IContainer container;

        #region 启动
        public static void Run()
        {
            SetAutofacContainer();
        }
        #endregion
        #region 停止
        public static void Stop()
        {
            container.Dispose();
        }
        #endregion

        #region 自动注入
        static void SetAutofacContainer()
        {
            var dllList = Helpers.FileHelper.FindFiles(@"~/", "MLPen.*.dll", System.IO.SearchOption.TopDirectoryOnly);
            var assemblys = new List<Assembly>();
            foreach (var file in dllList)
            {
                var assembly = Assembly.LoadFile(file);
                assemblys.Add(assembly);
            }
            var builder = new ContainerBuilder();
            builder.RegisterTypes<IAutofac>(assemblys); //服务（数据层、业务逻辑）
            container = builder.Build();
        }
        static void RegisterTypes<T>(this ContainerBuilder builder, List<Assembly> assemblys)
        {
            builder.RegisterTypes(typeof(T), assemblys);
        }
        static void RegisterTypes(this ContainerBuilder builder, Type baseType, List<Assembly> assemblys)
        {
            var list = assemblys.ToArray();
            builder.RegisterAssemblyTypes(list).Where(t => baseType.IsAssignableFrom(t) && t != baseType).AsImplementedInterfaces().InstancePerDependency();
        }
        #endregion

        #region 获取服务
        /// <summary>
        /// 获取服务
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T GetService<T>()
        {
            return container.Resolve<T>();
        }
        #endregion
    }
}
