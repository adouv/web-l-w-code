﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen
{
    internal static class TypeHelper
    {
        /// <summary>
        /// Given an object, adds each instance property with a public get method as a key and its
        /// associated value to a dictionary.
        ///
        /// If the object is already an <see cref="IDictionary{string, object}"/> instance, then a copy
        /// is returned.
        /// </summary>
        /// <remarks>
        /// The implementation of PropertyHelper will cache the property accessors per-type. This is
        /// faster when the the same type is used multiple times with ObjectToDictionary.
        /// </remarks>
        public static IDictionary<string, object> ObjectToDictionary(object value)
        {
            var dictionary = value as IDictionary<string, object>;
            if (dictionary != null)
            {
                return new Dictionary<string, object>(dictionary, StringComparer.OrdinalIgnoreCase);
            }

            dictionary = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

            if (value != null)
            {
                foreach (var helper in PropertyHelper.GetProperties(value))
                {
                    dictionary[helper.Name] = helper.GetValue(value);
                }
            }

            return dictionary;
        }
    }
}
