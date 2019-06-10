using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class ImageHelper
    {
        #region 缩放缩略图类型
        /// <summary>
        /// 缩放缩略图类型
        /// </summary>
        public enum ThumbsType
        {
            /// <summary>
            /// 强制设为指定的高、宽
            /// </summary>
            Default = 0,
            /// <summary>
            /// 压缩填充至指定区域
            /// </summary>
            Fill = 1,
            /// <summary>
            /// 指定高宽缩放（可能变形）
            /// </summary>
            HeightAndWidth = 2,
            /// <summary>
            /// 指定宽，高按比例
            /// </summary>
            Width = 3,
            /// <summary>
            /// 指定高，宽按比例
            /// </summary>
            Height = 4,
            /// <summary>
            /// 指定高宽裁减（不变形）(适配，以最小的一边来最准，将最大的边截点，并居中最大边，将整个图片放大到指定大小)
            /// </summary>
            Cut = 5
        }
        #endregion

        #region 获取图片的CODE
        /// <summary>
        /// 获取图片的CODE
        /// </summary>
        /// <param name="mimeType">指定的文件类型</param>
        /// <returns></returns>
        private static ImageCodecInfo GetCodecInfo(string mimeType)
        {
            ImageCodecInfo[] imageEncoders = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo imageCodecInfo in imageEncoders)
            {
                if (imageCodecInfo.MimeType == mimeType)
                {
                    return imageCodecInfo;
                }
            }
            return null;
        }

        /// <summary>
        /// 获取图片的CODE
        /// </summary>
        /// <param name="guid">文件GUID</param>
        /// <returns></returns>
        private static ImageCodecInfo GetCodecInfo(Guid guid)
        {
            ImageCodecInfo[] imageEncoders = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo imageCodecInfo in imageEncoders)
            {
                if (imageCodecInfo.FormatID == guid)
                {
                    return imageCodecInfo;
                }
            }
            return null;
        }
        #endregion

        #region 获得图片的类型
        /// <summary>
        /// 获得图片的类型
        /// </summary>
        /// <param name="path">路径</param>
        /// <returns></returns>
        private static ImageFormat ImgFormat(string path)
        {
            switch (FileHelper.GetFileExtName(path).Substring(1))
            {
                case "png":
                    return ImageFormat.Png;
                case "gif":
                    return ImageFormat.Gif;
                case "bmp":
                    return ImageFormat.Bmp;
                case "emf":
                    return ImageFormat.Emf;
                case "exif":
                    return ImageFormat.Exif;
                case "ico":
                    return ImageFormat.Icon;
                case "tiff":
                    return ImageFormat.Tiff;
                case "wmf":
                    return ImageFormat.Wmf;
                default:
                    return ImageFormat.Jpeg;
            }
        }
        #endregion

        #region 正弦曲线Wave扭曲图片
        /// <summary>
        /// 正弦曲线Wave扭曲图片
        /// </summary>
        /// <param name="srcBmp">图片路径</param>
        /// <param name="bXDir">如果扭曲则选择为True</param>
        /// <param name="nMultValue">波形的幅度倍数，越大扭曲的程度越高,一般为3</param>
        /// <param name="dPhase">波形的起始相位,取值区间[0-2*PI)</param>
        public static System.Drawing.Bitmap TwistImage(Bitmap srcBmp, bool bXDir, double dMultValue, double dPhase)
        {
            double PI = 6.283185307179586476925286766559;
            Bitmap destBmp = new Bitmap(srcBmp.Width, srcBmp.Height);
            Graphics graph = Graphics.FromImage(destBmp);
            graph.FillRectangle(new SolidBrush(Color.White), 0, 0, destBmp.Width, destBmp.Height);
            graph.Dispose();
            double dBaseAxisLen = bXDir ? (double)destBmp.Height : (double)destBmp.Width;
            for (int i = 0; i < destBmp.Width; i++)
            {
                for (int j = 0; j < destBmp.Height; j++)
                {
                    double dx = 0;
                    dx = bXDir ? (PI * (double)j) / dBaseAxisLen : (PI * (double)i) / dBaseAxisLen;
                    dx += dPhase;
                    double dy = Math.Sin(dx);
                    int nOldX = 0, nOldY = 0;
                    nOldX = bXDir ? i + (int)(dy * dMultValue) : i;
                    nOldY = bXDir ? j : j + (int)(dy * dMultValue);

                    Color color = srcBmp.GetPixel(i, j);
                    if (nOldX >= 0 && nOldX < destBmp.Width
                     && nOldY >= 0 && nOldY < destBmp.Height)
                    {
                        destBmp.SetPixel(nOldX, nOldY, color);
                    }
                }
            }
            srcBmp.Dispose();
            return destBmp;
        }
        #endregion

        #region 获取缩略图地址
        /// <summary>
        /// 获取缩略图地址
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        internal static string GetThumbnailName(string file)
        {
            string fileExtName = FileHelper.GetFileExtName(file);
            return file.Substring(0, file.Length - fileExtName.Length) + "_s" + fileExtName;
        }
        #endregion

        #region 获取图片的大小
        /// <summary>
        /// 获取图片的大小
        /// </summary>
        /// <param name="filepath">文件地址</param>
        /// <returns>Size</returns>
        public static Size GetSize(string filepath)
        {
            try
            {
                Bitmap bitmap = GetBitmap(filepath);
                Size result = new Size(bitmap.Width, bitmap.Height);
                bitmap.Dispose();
                return result;
            }
            catch
            {
                return Size.Empty;
            }
        }
        #endregion

        #region 获取图片流
        /// <summary>
        /// 获取图片流
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns></returns>
        public static MemoryStream GetBitmapStream(string filePath)
        {
            using (FileStream fileStream = new FileStream(FileHelper.GetTruePath(filePath), FileMode.Open))
            {
                byte[] array = new byte[fileStream.Length];
                fileStream.Read(array, 0, array.Length);
                return new MemoryStream(array);
            }
        }
        #endregion

        #region 获取图片位图
        /// <summary>
        /// 获取图片位图
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns></returns>
        public static Bitmap GetBitmap(string filePath)
        {
            MemoryStream bitmapStream = GetBitmapStream(filePath);
            Bitmap result = new Bitmap(bitmapStream);
            bitmapStream.Dispose();
            bitmapStream.Close();
            return result;
        }
        #endregion

        #region 无损压缩图片
        /// <summary>
        /// 无损压缩图片
        /// </summary>
        /// <param name="originalPath">源文件地址</param>
        /// <param name="compressPath">保存后地址</param>
        /// <param name="flag">压缩质量（数字越小压缩率越高）1-100</param>
        /// <param name="size">最大充值的文件大小 0-不限制</param>
        /// <returns></returns>
        public static bool CompressImage(string originalPath, string compressPath, int flag = 90, int size = 0)
        {
            return CompressImage(GetBitmap(originalPath), compressPath, flag, size);
        }
        /// <summary>
        /// 无损压缩图片
        /// </summary>
        /// <param name="originalImage">原图</param>
        /// <param name="compressPath">保存文件地址</param>
        /// <param name="flag">压缩质量（数字越小压缩率越高）1-100</param>
        /// <param name="size">最大充值的文件大小 0-不限制</param>
        /// <returns></returns>
        public static bool CompressImage(Image originalImage, string compressPath, int flag = 90, int size = 0)
        {
            ImageFormat tFormat = originalImage.RawFormat;
            int dHeight = originalImage.Height / 2;
            int dWidth = originalImage.Width / 2;
            int sW = 0, sH = 0;
            //按比例缩放
            Size tem_size = new Size(originalImage.Width, originalImage.Height);
            if (tem_size.Width > dHeight || tem_size.Width > dWidth)
            {
                if ((tem_size.Width * dHeight) > (tem_size.Width * dWidth))
                {
                    sW = dWidth;
                    sH = (dWidth * tem_size.Height) / tem_size.Width;
                }
                else
                {
                    sH = dHeight;
                    sW = (tem_size.Width * dHeight) / tem_size.Height;
                }
            }
            else
            {
                sW = tem_size.Width;
                sH = tem_size.Height;
            }

            Bitmap ob = new Bitmap(dWidth, dHeight);
            Graphics g = Graphics.FromImage(ob);

            g.Clear(Color.WhiteSmoke);
            g.CompositingQuality = CompositingQuality.HighQuality;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;

            g.DrawImage(originalImage, new Rectangle((dWidth - sW) / 2, (dHeight - sH) / 2, sW, sH), 0, 0, originalImage.Width, originalImage.Height, GraphicsUnit.Pixel);

            g.Dispose();

            //以下代码为保存图片时，设置压缩质量
            EncoderParameters ep = new EncoderParameters();
            long[] qy = new long[1];
            qy[0] = flag;//设置压缩的比例1-100
            EncoderParameter eParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, qy);
            ep.Param[0] = eParam;

            try
            {
                ImageCodecInfo[] arrayICI = ImageCodecInfo.GetImageEncoders();
                ImageCodecInfo jpegICIinfo = null;
                for (int x = 0; x < arrayICI.Length; x++)
                {
                    if (arrayICI[x].FormatDescription.Equals("JPEG"))
                    {
                        jpegICIinfo = arrayICI[x];
                        break;
                    }
                }
                if (jpegICIinfo != null)
                {
                    ob.Save(compressPath, jpegICIinfo, ep);//dFile是压缩后的新路径
                    if (size > 0)
                    {
                        FileInfo fi = new FileInfo(compressPath);
                        if (fi.Length > 1024 * size)
                        {
                            flag = flag - 10;
                            CompressImage(originalImage, compressPath, flag, size);
                        }
                    }
                }
                else
                {
                    ob.Save(compressPath, tFormat);
                }
                return true;
            }
            catch
            {
                return false;
            }
            finally
            {
                originalImage.Dispose();
                ob.Dispose();
            }
        }
        #endregion

        #region 缩小到指定宽度
        /// <summary>
        /// 缩小到指定宽度
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="width">宽度</param>
        public static bool ResizeToWidth(string filePath, int width)
        {
            return ThumbsImage(GetBitmap(filePath), FileHelper.GetTruePath(filePath), width, 0, ThumbsType.Width);
        }
        #endregion

        #region 缩小到指定高度
        /// <summary>
        /// 缩小到指定高度
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="height">高度</param>
        public static bool ResizeToHeight(string filePath, int height)
        {
            return ThumbsImage(GetBitmap(filePath), FileHelper.GetTruePath(filePath), 0, height, ThumbsType.Height);
        }
        #endregion

        #region 缩小图片
        /// <summary>
        /// 缩小图片
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <param name="width">缩略图宽</param>
        /// <param name="height">缩略图高</param>
        /// <param name="type">缩放方式</param>
        /// <returns></returns>
        public static bool Resize(string filePath, int width, int height, ThumbsType type)
        {
            return ThumbsImage(GetBitmap(filePath), FileHelper.GetTruePath(filePath), width, height, type);
        }
        #endregion

        #region 生成缩略图
        /// <summary>
        /// 生成缩略图
        /// </summary>
        /// <param name="originalPath">源图路径</param>
        /// <param name="thumbnailPath">生成后缩略图路径</param>
        /// <param name="toWidth">目标宽度</param>
        /// <param name="toHeight">目标高度</param>
        /// <param name="thumbsType">生成类型</param>
        /// <returns></returns>
        public static bool ThumbsImage(string originalPath, string thumbnailPath, int toWidth, int toHeight, ThumbsType thumbsType)
        {
            return ThumbsImage(GetBitmap(originalPath), thumbnailPath, toWidth, toHeight, thumbsType);
        }
        /// <summary>
        /// 生成缩略图
        /// </summary>
        /// <param name="originalImage">源图</param>
        /// <param name="thumbnailPath">缩略图路径（物理路径）</param>
        /// <param name="toWidth">最终缩略图宽度</param>
        /// <param name="toHeight">最终缩略图高度</param>
        /// <param name="thumbsType">生成缩略图的方式</param> 
        public static bool ThumbsImage(Image originalImage, string thumbnailPath, int toWidth, int toHeight, ThumbsType thumbsType)
        {
            int num = toWidth;
            int num2 = toHeight;
            int num3 = toWidth;
            int num4 = toHeight;
            int x = 0;
            int y = 0;
            int num5 = originalImage.Width;
            int num6 = originalImage.Height;
            int x2 = 0;
            int y2 = 0;
            switch (thumbsType)
            {
                case ThumbsType.Fill:
                    num4 = toHeight;
                    num3 = num4 * num5 / num6;
                    if (num3 > toWidth)
                    {
                        num4 = num4 * toWidth / num3;
                        num3 = toWidth;
                    }
                    x2 = (toWidth - num3) / 2;
                    y2 = (toHeight - num4) / 2;
                    break;
                case ThumbsType.HeightAndWidth:
                    num4 = (num2 = originalImage.Height * toWidth / originalImage.Width);
                    num3 = (num = originalImage.Width * toHeight / originalImage.Height);
                    break;
                case ThumbsType.Width:
                    num4 = (num2 = originalImage.Height * toWidth / originalImage.Width);
                    break;
                case ThumbsType.Height:
                    num3 = (num = originalImage.Width * toHeight / originalImage.Height);
                    break;
                case ThumbsType.Cut:
                    if ((double)originalImage.Width / (double)originalImage.Height > (double)num / (double)num2)
                    {
                        num6 = originalImage.Height;
                        num5 = originalImage.Height * num / num2;
                        y = 0;
                        x = (originalImage.Width - num5) / 2;
                    }
                    else
                    {
                        num5 = originalImage.Width;
                        num6 = originalImage.Width * toHeight / num;
                        x = 0;
                        y = (originalImage.Height - num6) / 2;
                    }
                    break;
            }
            Bitmap bitmap = new Bitmap(num, num2);
            Graphics graphics = Graphics.FromImage(bitmap);
            graphics.InterpolationMode = InterpolationMode.High;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.High;
            if (thumbnailPath.EndsWith(".png", true, CultureInfo.CurrentCulture))
            {
                graphics.Clear(Color.Transparent);
            }
            else
            {
                graphics.Clear(Color.White);
            }
            graphics.Clear(Color.White);
            graphics.DrawImage(originalImage, new Rectangle(x2, y2, num3, num4), new Rectangle(x, y, num5, num6), GraphicsUnit.Pixel);
            try
            {
                return CompressImage(bitmap, thumbnailPath);
            }
            catch
            {
                return false;
            }
            finally
            {
                bitmap.Dispose();
                graphics.Dispose();
            }
        }
        #endregion
    }
}
