using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false)]
    internal sealed class NotNullAttribute : Attribute
    {
    }
}
