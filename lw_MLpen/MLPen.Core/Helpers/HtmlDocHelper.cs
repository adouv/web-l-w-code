using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// Html文档帮助类
    /// </summary>
    public class HtmlDocHelper
    {
        /// <summary>
        /// 当前Html文档
        /// </summary>
        public HtmlDocument HtmlDoc { get; private set; }

        /// <summary>
        /// 实例化
        /// </summary>
        /// <param name="html"></param>
        public HtmlDocHelper(string html)
        {
            if (html.IsEmpty()) return;
            HtmlDoc = new HtmlDocument();
            HtmlDoc.LoadHtml(html);
        }
        /// <summary>
        /// 输出HTML内容
        /// </summary>
        public string OuterHtml
        {
            get { return HtmlDoc == null ? null : HtmlDoc.DocumentNode.OuterHtml; }
        }
        /// <summary>
        /// 创建实例
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static HtmlDocHelper Create(string html)
        {
            return new HtmlDocHelper(html);
        }

        /// <summary>
        /// 移出标签
        /// </summary>
        /// <param name="tag">标签</param>
        /// <returns></returns>
        public HtmlDocHelper RemoveNode(string tag)
        {
            if (HtmlDoc == null) return this;

            if (tag.IsEmpty()) throw new Exception("请指定参数.");
            var nodes = HtmlDoc.QuerySelectorAll(tag);
            foreach (var item in nodes)
            {
                item.Remove();
            }
            return this;
        }

        #region 移出指定的标签属性
        /// <summary>
        /// 移出指定的标签的属性
        /// </summary>
        /// <param name="tag">标签名</param>
        /// <param name="attrs">属性</param>
        /// <returns></returns>
        public HtmlDocHelper RemoveAttr(string tag, params string[] attrs)
        {
            if (HtmlDoc == null) return this;

            if (tag.IsEmpty() || attrs.Length == 0) throw new Exception("请指定参数.");
            var nodes = HtmlDoc.QuerySelectorAll(tag);
            foreach (var item in nodes)
            {
                foreach (var attr in attrs)
                {
                    item.Attributes.Remove(attr);
                }
            }
            return this;
        }
        #endregion

        #region 替换指定标签的属性
        /// <summary>
        /// 替换指定标签的属性
        /// </summary>
        /// <param name="tag">标签</param>
        /// <param name="attrOld">原属性</param>
        /// <param name="attrNew">新属性</param>
        /// <returns></returns>
        public HtmlDocHelper ReplaceAttr(string tag, string attrOld, string attrNew)
        {
            if (HtmlDoc == null) return this;

            if (tag.IsEmpty() || attrOld.IsEmpty() || attrNew.IsEmpty()) throw new Exception("请指定参数.");
            var nodes = HtmlDoc.QuerySelectorAll(tag);
            foreach (var item in nodes)
            {
                var attrNode = item.Attributes[attrOld];
                if (attrNode != null)
                {
                    item.Attributes.Add(attrNew, attrNode.Value);
                    item.Attributes.Remove(attrNode);
                }
            }
            return this;
        }
        #endregion

        #region 为指定的标签添加属性
        /// <summary>
        /// 为指定的标签添加属性
        /// </summary>
        /// <param name="tag"></param>
        /// <param name="attr"></param>
        /// <param name="attrValue"></param>
        /// <returns></returns>
        public HtmlDocHelper AddAttr(string tag, string attr, string attrValue)
        {
            if (HtmlDoc == null) return this;

            if (tag.IsEmpty() || attr.IsEmpty()) throw new Exception("请指定参数.");
            var nodes = HtmlDoc.QuerySelectorAll(tag);
            foreach (var item in nodes)
            {
                item.Attributes.Add(attr, attrValue);
            }
            return this;
        }
        #endregion

        #region 格式化习题
        /// <summary>
        /// 格式化习题
        /// </summary>
        /// <param name="selecter"></param>
        /// <returns></returns>
        public void formatQuestion(string color, string title, int index, int size)
        {
            this.RemoveAttr("p", "style", "class");
            this.RemoveAttr("span", "style", "class");

            var body = HtmlDoc.QuerySelector("body");
            if (body == null)
            {
                body = HtmlDoc.CreateElement("body");
                body.InnerHtml = HtmlDoc.DocumentNode.InnerHtml;
                HtmlDoc.DocumentNode.RemoveAll();
                HtmlDoc.DocumentNode.AppendChild(body);
            }

            var css = new StringBuilder();
            css.AppendLine("body {" + $"color:{color};font-size:30px;font-weight:bold;line-height:1.5;font-family:'微软雅黑';" + "}");
            css.AppendLine("p {margin:0 0 20px 0;}");
            css.AppendLine("p:first-child {margin-bottom:50px;}");
            var style = HtmlDoc.CreateElement("style");

            style.InnerHtml = css.ToString();

            var head = HtmlDoc.QuerySelector("head");
            if (head == null)
            {
                head = HtmlDoc.CreateElement("head");
                HtmlDoc.DocumentNode.InsertBefore(head, body);
            }
            head.AppendChild(style);

            body.InnerHtml = $"<p><span style=\"color:#226cfb\">{index}</span>/{size}．{title}</p>" + body.InnerHtml;


        }
        #endregion

        #region 转换成小程序能识别的内容
        /// <summary>
        /// 转换成小程序能识别的内容
        /// </summary>
        /// <param name="host">图片地址增加域名</param>
        /// <returns></returns>
        public List<object> ToWxml(string host)
        {
            List<object> listCnt = new List<object>(); //文章
            if (HtmlDoc == null) return listCnt;

            var p_cnt = HtmlDoc.DocumentNode.SelectNodes("//p");
            foreach (var pItem in p_cnt)
            {
                var node = HtmlNode.CreateNode(pItem.OuterHtml);
                if (node.InnerHtml.Contains("src"))
                {
                    if (node.SelectSingleNode("//img") != null)
                    {
                        string _href = node.SelectSingleNode("//img").Attributes["src"].Value;
                        listCnt.Add(new { type = "image", content = string.Concat(host, _href) });
                    }
                }
                else
                {
                    listCnt.Add(new { type = "content", content = node.InnerText });
                }
            }
            return listCnt;
        }
        #endregion
    }
}
