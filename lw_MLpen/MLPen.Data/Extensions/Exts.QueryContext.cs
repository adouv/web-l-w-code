using Chloe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Data
{
    public static partial class Exts
    {
        #region 分页扩展
        /// <summary>
        /// 分页扩展
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="query"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        public static CoreModels.BootTableModel.Result<TEntity> ToPage<TEntity>(this IQuery<TEntity> query, CoreModels.BootTableModel.Search model)
        {
            return query.ToPage(new CoreModels.PageModel
            {
                index = model.offset / model.limit,
                size = model.limit,
                order = model.order,
                sort = model.sort
            });
        }

        public static CoreModels.BootTableModel.Result<TEntity> ToPage<TEntity>(this IQuery<TEntity> query, CoreModels.PageModel model)
        {
            List<TEntity> rows = ((IQuery<TEntity>)query.OrderBy(model.sort + " " + model.order)).TakePage(model.index + 1, model.size).ToList();
            int num = query.Count();
            int count = (int)Math.Floor(((double)num * 1.0 + (double)model.size * 1.0 - 1.0) / (double)model.size);
            return new CoreModels.BootTableModel.Result<TEntity>
            {
                count = count,
                total = num,
                rows = rows
            };
        }
        /// <summary>
		/// 分页扩展
		/// </summary>
		/// <typeparam name="TEntity"></typeparam>
		/// <typeparam name="TResult"></typeparam>
		/// <param name="query"></param>
		/// <param name="model"></param>
		/// <param name="selector"></param>
		/// <returns></returns>
		public static CoreModels.BootTableModel.Result<TResult> ToPage<TEntity, TResult>(this IQuery<TEntity> query, CoreModels.BootTableModel.Search model, Func<TEntity, TResult> selector)
        {
            return query.ToPage(new CoreModels.PageModel
            {
                index = model.offset / model.limit,
                size = model.limit,
                order = model.order,
                sort = model.sort
            }, selector);
        }

        /// <summary>
        /// 分页扩展
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TResult"></typeparam>
        /// <param name="query"></param>
        /// <param name="model"></param>
        /// <param name="selector"></param>
        /// <returns></returns>
        public static CoreModels.BootTableModel.Result<TResult> ToPage<TEntity, TResult>(this IQuery<TEntity> query, CoreModels.PageModel model, Func<TEntity, TResult> selector)
        {
            List<TEntity> source = ((IQuery<TEntity>)query.OrderBy(model.sort + " " + model.order)).TakePage(model.index + 1, model.size).ToList();
            int num = query.Count();
            int count = (int)Math.Floor(((double)num * 1.0 + (double)model.size * 1.0 - 1.0) / (double)model.size);
            List<TResult> rows = source.Select(selector).ToList();
            return new CoreModels.BootTableModel.Result<TResult>
            {
                count = count,
                total = num,
                rows = rows
            };
        }
        #endregion

        #region 倒序扩展
        /// <summary>
        /// 倒序扩展
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="query"></param>
        /// <param name="keySelector"></param>
        /// <returns></returns>
        public static IOrderedQuery<TEntity> OrderByDescending<TEntity, TKey>(this IQuery<TEntity> query, Expression<Func<TEntity, TKey>> keySelector)
        {
            return query.OrderByDesc(keySelector);
        }
        #endregion
    }
}
