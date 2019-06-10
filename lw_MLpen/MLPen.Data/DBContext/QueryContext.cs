using Chloe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    /// <summary>
    /// 数据上下文接口
    /// </summary>
    public class QueryContext : Disposable, IQueryContext
    {
        protected IDbContext DbContext;
        public QueryContext(IDbContext dbContext)
        {
            this.DbContext = dbContext;
        }

        #region 自定义错误消息
        /// <summary>
        /// 自定义错误消息
        /// </summary>
        /// <param name="text"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        protected Exception Error(string text, params object[] format)
        {
            return Helpers.ExceptionHelper.Init(text, format);
        }
        /// <summary>
        /// 自定义错误消息
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        protected Exception Error(Exception ex)
        {
            return Helpers.ExceptionHelper.Init(ex);
        }
        #endregion

        #region Session
        public IDbSession Session => this.DbContext.Session;
        #endregion

        #region Query
        public IQuery<TEntity> Query<TEntity>() where TEntity : IEntity
        {
            return DbContext.Query<TEntity>();
        }
        public IQuery<TEntity> Query<TEntity>(string table) where TEntity : IEntity
        {
            return DbContext.Query<TEntity>(table);
        }
        #endregion

        #region QueryByKey
        public TEntity QueryByKey<TEntity>(object key, bool tracking = false) where TEntity : IEntity
        {
            return DbContext.QueryByKey<TEntity>(key, tracking);
        }
        public TEntity QueryByKey<TEntity>(object key, string table, bool tracking = false) where TEntity : IEntity
        {
            return DbContext.QueryByKey<TEntity>(key, table, tracking);
        }
        #endregion

        #region JoinQuery
        public IJoiningQuery<T1, T2> JoinQuery<T1, T2>(Expression<Func<T1, T2, object[]>> joinInfo)
        {
            return DbContext.JoinQuery<T1, T2>(joinInfo);
        }
        public IJoiningQuery<T1, T2, T3> JoinQuery<T1, T2, T3>(Expression<Func<T1, T2, T3, object[]>> joinInfo)
        {
            return DbContext.JoinQuery<T1, T2, T3>(joinInfo);
        }
        public IJoiningQuery<T1, T2, T3, T4> JoinQuery<T1, T2, T3, T4>(Expression<Func<T1, T2, T3, T4, object[]>> joinInfo)
        {
            return DbContext.JoinQuery<T1, T2, T3, T4>(joinInfo);
        }
        public IJoiningQuery<T1, T2, T3, T4, T5> JoinQuery<T1, T2, T3, T4, T5>(Expression<Func<T1, T2, T3, T4, T5, object[]>> joinInfo)
        {
            return DbContext.JoinQuery<T1, T2, T3, T4, T5>(joinInfo);
        }
        #endregion

        #region SQLQuery
        public ISQLQuery SQLQuery(string sql, object parameter = null)
        {
            return SQLQuery(sql, CommandType.Text, parameter);
        }
        public ISQLQuery SQLQuery(string sql, CommandType cmdType, object parameter = null)
        {
            return new SQLQuery(DbContext, sql, cmdType, parameter);
        }
        #endregion

        #region Where
        public IQuery<TEntity> Where<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : IEntity
        {
            return Query<TEntity>().Where(predicate);
        }
        #endregion

        #region Any
        public bool Any<TEntity>() where TEntity : IEntity
        {
            return Query<TEntity>().Any();
        }
        public bool Any<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : IEntity
        {
            return Query<TEntity>().Any(predicate);
        }
        #endregion

        #region Insert
        public TEntity Insert<TEntity>(TEntity entity) where TEntity : IEntity
        {
            return DbContext.Insert(entity);
        }
        public TEntity Insert<TEntity>(TEntity entity, string table) where TEntity : IEntity
        {
            return DbContext.Insert(entity, table);
        }
        public object Insert<TEntity>(Expression<Func<TEntity>> content) where TEntity : IEntity
        {
            return DbContext.Insert(content);
        }
        public object Insert<TEntity>(Expression<Func<TEntity>> content, string table) where TEntity : IEntity
        {
            return DbContext.Insert(content, table);
        }
        public void InsertRange<TEntity>(List<TEntity> entities, bool keepIdentity = false, string table = null) where TEntity : IEntity
        {
            DbContext.InsertRange(entities, keepIdentity, table);
        }
        #endregion

        #region Update
        public int Update<TEntity>(TEntity entity) where TEntity : IEntity
        {
            return DbContext.Update(entity);
        }

        public int Update<TEntity>(TEntity entity, string table) where TEntity : IEntity
        {
            return DbContext.Update(entity, table);
        }

        public int Update<TEntity>(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content) where TEntity : IEntity
        {
            return DbContext.Update(condition, content);
        }

        public int Update<TEntity>(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content, string table) where TEntity : IEntity
        {
            return DbContext.Update(condition, content, table);
        }
        #endregion

        #region Delete
        public int Delete<TEntity>(TEntity entity) where TEntity : IEntity
        {
            return DbContext.Delete(entity);
        }
        public int Delete<TEntity>(TEntity entity, string table) where TEntity : IEntity
        {
            return DbContext.Delete(entity, table);
        }
        public int Delete<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : IEntity
        {
            return DbContext.Delete(condition);
        }
        public int Delete<TEntity>(Expression<Func<TEntity, bool>> condition, string table) where TEntity : IEntity
        {
            return DbContext.Delete(condition, table);
        }
        public int DeleteByKey<TEntity>(object key) where TEntity : IEntity
        {
            return DbContext.DeleteByKey<TEntity>(key);
        }
        public int DeleteByKey<TEntity>(object key, string table) where TEntity : IEntity
        {
            return DbContext.DeleteByKey<TEntity>(key, table);
        }
        #endregion

        #region TrackEntity
        public void TrackEntity(object entity)
        {
            DbContext.TrackEntity(entity);
        }
        #endregion
    }
}
