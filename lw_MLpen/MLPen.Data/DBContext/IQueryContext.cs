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
    public interface IQueryContext : IDisposable
    {
        #region Session
        /// <summary>
        /// 获取关联的会话，通过该对象可以执行基本的 ado.net 操作（包括事务）
        /// </summary>
        IDbSession Session { get; }
        #endregion

        #region Query
        /// <summary>
        /// 获取 IQuery 对象。主要数据查询的入口
        /// </summary>
        /// <returns></returns>
        IQuery<TEntity> Query<TEntity>() where TEntity : IEntity;
        /// <summary>
        /// 获取 IQuery 对象。主要数据查询的入口
        /// </summary>
        /// <param name="table"></param>
        /// <returns></returns>
        IQuery<TEntity> Query<TEntity>(string table) where TEntity : IEntity;
        #endregion

        #region QueryByKey
        /// <summary>
        /// 根据主键查询数据
        /// 如果实体是单一主键，可以传入的 key 与主键属性类型相同的值，亦可以传一个包含了与实体主键类型相同的属性的对象，如：new { Id = 1 }
        /// 如果实体是多主键，则传入的 key 须是包含了与实体主键类型相同的属性的对象，如：new { Key1 = "1", Key2 = "2" }
        /// </summary>
        /// <param name="key"></param>
        /// <param name="tracking"></param>
        /// <returns></returns>
        TEntity QueryByKey<TEntity>(object key, bool tracking = false) where TEntity : IEntity;
        /// <summary>
        /// 根据主键查询数据
        /// 如果实体是单一主键，可以传入的 key 与主键属性类型相同的值，亦可以传一个包含了与实体主键类型相同的属性的对象，如：new { Id = 1 }
        /// 如果实体是多主键，则传入的 key 须是包含了与实体主键类型相同的属性的对象，如：new { Key1 = "1", Key2 = "2" }        /// </summary>
        /// <param name="key"></param>
        /// <param name="table"></param>
        /// <param name="tracking"></param>
        /// <returns></returns>
        TEntity QueryByKey<TEntity>(object key, string table, bool tracking = false) where TEntity : IEntity;
        #endregion

        #region JoinQuery
        /// <summary>
        /// 快捷多表连接
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <param name="joinInfo"></param>
        /// <returns></returns>
        IJoiningQuery<T1, T2> JoinQuery<T1, T2>(Expression<Func<T1, T2, object[]>> joinInfo);
        /// <summary>
        /// 快捷多表连接
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <typeparam name="T3"></typeparam>
        /// <param name="joinInfo"></param>
        /// <returns></returns>
        IJoiningQuery<T1, T2, T3> JoinQuery<T1, T2, T3>(Expression<Func<T1, T2, T3, object[]>> joinInfo);
        /// <summary>
        /// 快捷多表连接
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <typeparam name="T3"></typeparam>
        /// <typeparam name="T4"></typeparam>
        /// <param name="joinInfo"></param>
        /// <returns></returns>
        IJoiningQuery<T1, T2, T3, T4> JoinQuery<T1, T2, T3, T4>(Expression<Func<T1, T2, T3, T4, object[]>> joinInfo);
        /// <summary>
        /// 快捷多表连接
        /// </summary>
        /// <typeparam name="T1"></typeparam>
        /// <typeparam name="T2"></typeparam>
        /// <typeparam name="T3"></typeparam>
        /// <typeparam name="T4"></typeparam>
        /// <typeparam name="T5"></typeparam>
        /// <param name="joinInfo"></param>
        /// <returns></returns>
        IJoiningQuery<T1, T2, T3, T4, T5> JoinQuery<T1, T2, T3, T4, T5>(Expression<Func<T1, T2, T3, T4, T5, object[]>> joinInfo);
        #endregion

        #region SQLQuery
        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sql">SQL语名</param>
        /// <param name="parameter">参数</param>
        /// <returns></returns>
        ISQLQuery SQLQuery(string sql, object parameter = null);
        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sql">SQL语名</param>
        /// <param name="cmdType">执行</param>
        /// <param name="parameter">参数</param>
        /// <returns></returns>
        ISQLQuery SQLQuery(string sql, CommandType cmdType, object parameter = null);
        #endregion

        #region Where
        /// <summary>
        /// 查询实体
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate">条件</param>
        /// <returns></returns>
        IQuery<TEntity> Where<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : IEntity;
        #endregion

        #region Any
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <returns></returns>
        bool Any<TEntity>() where TEntity : IEntity;
        /// <summary>
        /// 是否存在记录
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="predicate">条件</param>
        /// <returns></returns>
        bool Any<TEntity>(Expression<Func<TEntity, bool>> predicate) where TEntity : IEntity;
        #endregion

        #region Insert
        /// <summary>
        /// 传入一个实体对象，插入数据。返回传入的实体对象（如果实体拥有自增列，会自动将自增值设置到实体相应的属性上）
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        TEntity Insert<TEntity>(TEntity entity) where TEntity : IEntity;
        /// <summary>
        /// 传入一个实体对象，插入数据。返回传入的实体对象（如果实体拥有自增列，会自动将自增值设置到实体相应的属性上）
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        TEntity Insert<TEntity>(TEntity entity, string table) where TEntity : IEntity;
        /// <summary>
        /// 传入一个 lambda 表达式树，向表插入指定的字段数据，返回主键值（如果主键是自增，则返回的就是自增值）
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        object Insert<TEntity>(Expression<Func<TEntity>> content) where TEntity : IEntity;
        /// <summary>
        /// 传入一个 lambda 表达式树，向表插入指定的字段数据，返回主键值（如果主键是自增，则返回的就是自增值）
        /// </summary>
        /// <param name="content"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        object Insert<TEntity>(Expression<Func<TEntity>> content, string table) where TEntity : IEntity;
        /// <summary>
        /// 将一个实体集合插入数据库（批量处理）
        /// </summary>
        /// <param name="entities"></param>
        /// <param name="keepIdentity"></param>
        /// <param name="table"></param>
        void InsertRange<TEntity>(List<TEntity> entities, bool keepIdentity = false, string table = null) where TEntity : IEntity;
        #endregion

        #region Update
        /// <summary>
        /// 传入一个实体，更新单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        int Update<TEntity>(TEntity entity) where TEntity : IEntity;
        /// <summary>
        /// 传入一个实体，更新单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        int Update<TEntity>(TEntity entity, string table) where TEntity : IEntity;
        /// <summary>
        /// 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        int Update<TEntity>(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content) where TEntity : IEntity;
        /// <summary>
        /// 传入 condition 条件和 body 表达式树，更新满足 condition 条件的指定的字段。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="content"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        int Update<TEntity>(Expression<Func<TEntity, bool>> condition, Expression<Func<TEntity, TEntity>> content, string table) where TEntity : IEntity;
        #endregion

        #region Delete
        /// <summary>
        /// 传入一个实体，删除单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        int Delete<TEntity>(TEntity entity) where TEntity : IEntity;
        /// <summary>
        /// 传入一个实体，删除单条数据。返回受影响的行数
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        int Delete<TEntity>(TEntity entity, string table) where TEntity : IEntity;
        /// <summary>
        /// 传入 condition 条件表达式树，删除满足 condition 条件的数据。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        int Delete<TEntity>(Expression<Func<TEntity, bool>> condition) where TEntity : IEntity;
        /// <summary>
        /// 传入 condition 条件表达式树，删除满足 condition 条件的数据。返回受影响的行数
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        int Delete<TEntity>(Expression<Func<TEntity, bool>> condition, string table) where TEntity : IEntity;
        /// <summary>
        /// 根据主键删除数据
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        int DeleteByKey<TEntity>(object key) where TEntity : IEntity;
        /// <summary>
        /// 根据主键删除数据
        /// </summary>
        /// <param name="key"></param>
        /// <param name="table"></param>
        /// <returns></returns>
        int DeleteByKey<TEntity>(object key, string table) where TEntity : IEntity;
        #endregion

        #region TrackEntity
        /// <summary>
        /// 传入一个实体，让当前上下文跟踪该实体的属性变化。调用 'int Update<TEntity>(TEntity entity)' 方法更新数据时，只会更新实体被修改过的属性。
        /// </summary>
        /// <param name="entity"></param>
        void TrackEntity(object entity);
        #endregion
    }
}
