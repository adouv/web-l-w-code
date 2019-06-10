using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Interfaces;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Services
{
    /// <summary>
    /// 习题练习记录表(接口实现)
    ///</summary>
    internal class ErPaperPracticeRecordService : ServiceBase<ErPaperPracticeRecord>, IErPaperPracticeRecordService
    {
        public ErPaperPracticeRecordService(IUnitOfWorks works) : base(works) { }

        public long count(int? gardenId, int? gradeId, int? type, string keyWord)
        {
            var query = IDatas.ErPracticeRecord.DbSet;
            if (gardenId != null)
            {
                query = query.Where(m => m.garden_id == gardenId);
            }
            if (gradeId != null)
            {
                query = query.Where(m => m.grade_id == gradeId);
            }
            if (type != null)
            {
                query = query.Where(m => m.paper_type == type);
            }
            if (keyWord.IsNotEmtpy())
            {
                query = query.Where(m => m.paper_name.Contains(keyWord));
            }
            return query.Count();
        }

        public ErPaperPracticeRecord GetOne()
        {
            return this.Where(e => e.id != null).OrderBy(e => e.create_time).ToList().Last();
        }

        public List<ErPaperPracticeRecord> list(int? gardenId, int? gradeId, int? type, string keyWord, int? noPage, int? size)
        {
            var query = IDatas.ErPracticeRecord.DbSet;
            if (gardenId != null)
            {
                query = query.Where(m => m.garden_id == gardenId);
            }
            if (gradeId != null)
            {
                query = query.Where(m => m.grade_id == gradeId);
            }
            if (type !=  null)
            {
                query = query.Where(m => m.paper_type == type);
            }
            if (keyWord.IsNotEmtpy())
            {
                query = query.Where(m => m.paper_name.Contains(keyWord));
            }
            if (noPage != null && size != null)
            {
                query = query.TakePage((int)noPage, (int)size);
            }
            return query.ToList();
        }

        public List<ErPaperPracticeRecord> ListByStatus()
        {
            return IDatas.ErPracticeRecord.Where(r => r.synchronous_status == 0).ToList();
        }

        public ErPaperPracticeRecord oneById(string exerciseRecordId)
        {
            return IDatas.ErPracticeRecord.Where(r => r.id == exerciseRecordId).FirstOrDefault();
        }
    }


}