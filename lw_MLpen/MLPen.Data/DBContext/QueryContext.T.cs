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
    /// <typeparam name="TEntity"></typeparam>
    public abstract class QueryContext<TEntity> : Disposable, IQueryContext<TEntity> where TEntity : IEntity
    {
        protected IDbContext DbContext;
        protected QueryContext(IDbContext dbContext)
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

        #region DbSet
        public IQuery<TEntity> DbSet { get { return this.Query(); } }
        #endregion

        #region Session
        public IDbSession Session => this.DbContext.Session;
        #endregion

        #region Query
        public IQuery<TEntity> Query() { return DbContext.Query<TEntity>(); }
        public IQuery<TEntity> Query(string table) { return DbContext.Query<TEntity>(table); }
        #endregion

        #region Query.T
        public IQuery<T> Query<T>() { return DbContext.Query<T>(); }
        public IQuery<T> Query<T>(string table) { return DbContext.Query<T>(table); }
        #endregion

        #region QueryByKey
        public TEntity QueryByKey(object key, bool tracking = false)
        {
            return DbContext.QueryByKey<TEntity>(key, tracking);
        }
        public TEntity QueryByKey(object key, string table, bool tracking = false)
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
        public IQuery<TEntity> Where(Expression<Func<TEntity, bool>> predicate)
        {
            return Query().Where(predicate);
        }
        #endregion

        #region Where.T
        public IQuery<T> Where<T>(Expression<Func<T, bool>> predicate) where T : IEntity
        {
            return Query<T>().Where(predicate);
        }
        #endregion

        #region Any
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public bool Any() { return Query().Any(); }
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate">条件</param>
        /// <returns></returns>
        public bool Any(Expression<Func<TEntity, bool>> predicate) { return Query().Any(predicate); }
        #endregion

        #region Any.T
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        public bool Any<T>() where T : IEntity
        {
            return Query<T>().Any();
        }
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate">条件</param>
        /// <returns></returns>
        public bool Any<T>(Expression<Func<T, bool>> predicate) where T : IEntity
        {
            return Query<T>().Any(predicate);
        }
        #endregion

        #region Count
        /// <summary>
        /// 返回记录总数
        /// </summary>
        /// <returns></returns>
        public int Count() { return Query().Count(); }
        /// <summary>
        /// 返回记录总数
        /// </summary>
        /// <param name="predicate">查询条件</param>
        /// <returns></returns>
        public int Count(Expression<Func<TEntity, bool>> predicate) { return Query().Where(predicate).Count(); }
        #endregion

        #region Insert
        public TEntity Insert(TEntity entity)
        {
            return DbContext.Insert(entity);
        }
        public TEntity Insert(TEntity entity, string table)
        {
            return DbContext.Insert(entity, table);
        }
        public object Insert(Expression<Func<TEntity>> content)
        {
            return DbContext.Insert(content);
        }
        public object Insert(Expression<Func<TEntity>> content, string table)
        {
            return DbContext.Insert(content, table);
        }
        public void InsertRange(List<TEntity> entities, bool keepIdentity = false, string table = null)
        {
            DbContext.InsertRange(entities, keepIdentity, table);
        }
        #endregion

        #region Insert.T
        public T Insert<T>(T entity)
        {
            return DbContext.Insert(entity);
        }
        public T Insert<T>(T entity, string table)
        {
            return DbContext.Insert(entity, table);
        }
        public object Insert<T>(Expression<Func<T>> content)
        {
            return DbContext.Insert(content);
        }
        public object Insert<T>(Expression<Func<T>> content, string table)
        {
            return DbContext.Insert(content, table);
        }
        public void InsertRange<T>(List<T> entities, bool keepIdentity = false, string table = null)
        {
            DbContext.InsertRange(entities, keepIdentity, table);
        }
        #endregion

        #region Update
        public int Update(TEntity entity)
        {
            return DbContext.Update(entity);
        }

        public int Update(TEntity entity, string table)
        {
            return DbContext.Update(entity, table);
        }

        public int Update(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content)
        {
            return DbContext.Update(condition, content);
        }

        public int Update(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content, string table)
        {
            return DbContext.Update(condition, content, table);
        }
        #endregion

        #region Update.T
        /// <summary>
        /// 传入一个实体，更新单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public int Update<T>(T entity) where T : IEntity
        {
            return DbContext.Update(entity);
        }
        /// <summary>
        /// 传入一个实体，更新单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        public int Update<T>(T entity, string table) where T : IEntity
        {
            return DbContext.Update(entity, table);
        }
        /// <summary>
        /// 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public int Update<T>(Expression<Func<T, bool>> condition, Expression<Func<T, T>> content) where T : IEntity
        {
            return DbContext.Update(condition, content);
        }
        /// <summary>
        /// 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="content"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        public int Update<T>(Expression<Func<T, bool>> condition, Expression<Func<T, T>> content, string table) where T : IEntity
        {
            return DbContext.Update(condition, content, table);
        }
        #endregion

        #region Delete
        public int Delete(TEntity entity) { return DbContext.Delete(entity); }
        public int Delete(TEntity entity, string table) { return DbContext.Delete(entity, table); }
        public int Delete(Expression<Func<TEntity, bool>> condition) { return DbContext.Delete(condition); }
        public int Delete(Expression<Func<TEntity, bool>> condition, string table) { return DbContext.Delete(condition, table); }
        public int DeleteByKey(object key) { return DbContext.DeleteByKey<TEntity>(key); }
        public int DeleteByKey(object key, string table) { return DbContext.DeleteByKey<TEntity>(key, table); }
        #endregion

        #region Delete.T
        public int Delete<T>(T entity) { return DbContext.Delete<T>(entity); }
        public int Delete<T>(T entity, string table) { return DbContext.Delete<T>(entity, table); }
        public int Delete<T>(Expression<Func<T, bool>> condition) { return DbContext.Delete(condition); }
        public int Delete<T>(Expression<Func<T, bool>> condition, string table) { return DbContext.Delete(condition, table); }
        public int DeleteByKey<T>(object key) { return DbContext.DeleteByKey<T>(key); }
        public int DeleteByKey<T>(object key, string table) { return DbContext.DeleteByKey<T>(key, table); }
        #endregion

        #region TrackEntity
        public void TrackEntity(object entity)
        {
            DbContext.TrackEntity(entity);
        }
        #endregion
    }
}
