using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MLPen.Models;
using MLPen.Data;
using MLPen.Repository.Entitys;

namespace MLPen.Repository.Interfaces
{
    /// <summary>
    /// 习题练习记录表(接口)
    /// </summary>
    public interface IErPaperPracticeRecordService : IServiceBase<ErPaperPracticeRecord>, IAutofac
    {
        ErPaperPracticeRecord oneById(string exerciseRecordId);

        List<ErPaperPracticeRecord> list(int? gardenId, int? gradeId, int? type, string keyWord, int? noPage, int? size);

        long count(int? gardenId, int? gradeId, int? type, string keyWord);

        List<ErPaperPracticeRecord> ListByStatus();

        ErPaperPracticeRecord GetOne();
    }
}