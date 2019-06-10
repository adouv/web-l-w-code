using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    internal static class TypeExtensions
    {
        public static bool IsValueType([NotNull] this Type type)
        {
            return type.GetTypeInfo().IsValueType;
        }
        public static bool IsStringType([NotNull] this Type type)
        {
            return typeof(string).Equals(type);
        }
    }
}
