using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    /// <summary>
    /// 文件操作
    /// </summary>
    public class FileHelper
    {
        #region 获取文件/目录的真实路径，不管是不是虚拟路径
        /// <summary>
        /// 获取文件/目录的真实路径，不管是不是虚拟路径
        /// </summary>
        /// <param name="path">文件路径</param>
        /// <returns></returns>
        public static string GetTruePath(string path)
        {
            return GetTruePath(path, false);
        }
        /// <summary>
		/// 获取文件/目录的真实路径，不管是不是虚拟路径
		/// </summary>
		/// <param name="path">文件路径</param>
		/// <param name="isCreateFolder">如果目录不存在则创建 true-创建 false-不创建</param>
		/// <returns></returns>
		public static string GetTruePath(string path, bool isCreateFolder)
        {
            if (isCreateFolder)
            {
                string folder = IsFilePath(path) ? GetFolderName(path) : path;
                if (!IsFolderExists(folder))
                {
                    CreateFolder(folder);
                }
            }
            return MSUtils.GetMapPath(path);
        }
        #endregion

        #region 判断路径是否是文件路径
        /// <summary>
        /// 判断路径是否是文件路径
        /// </summary>
        /// <param name="path">路径</param>
        /// <returns></returns>
        public static bool IsFilePath(string path)
        {
            return GetFileName(path).IsNotEmtpy();
        }
        #endregion

        #region 创建目录
        /// <summary>
        /// 创建目录（如果已经存在，则忽略）
        /// </summary>
        /// <param name="folder">真实路径或虚拟路径</param>
        /// <returns></returns>
        public static bool CreateFolder(string folder)
        {
            folder = GetTruePath(folder);
            if (IsFolderExists(folder))
            {
                return true;
            }
            return MakeSureDirectoryPathExists(GetTruePath(folder));
        }
        /// <summary>
		/// 创建目录
		/// </summary>
		/// <param name="name">名称</param>
		/// <returns>创建是否成功</returns>
		[DllImport("dbgHelp", SetLastError = true)]
        private static extern bool MakeSureDirectoryPathExists(string name);
        #endregion

        #region 移动目录
        /// <summary>
        /// 移动目录
        /// </summary>
        /// <param name="sourceFolder">源目录</param>
        /// <param name="targetFolder">目标目录</param>
        /// <returns></returns>
        public static void MoveFolder(string sourceFolder, string targetFolder)
        {
            if (CopyFolder(sourceFolder, targetFolder))
            {
                DeleteFolder(sourceFolder);
            }
        }
        #endregion

        #region 复制目录
        /// <summary>
        /// 复制目录
        /// </summary>
        /// <param name="sourceFolder">原目录（支持虚拟路径）</param>
        /// <param name="targetFolder">目标目录（支持虚拟路径）</param>
        /// <param name="overWrite">如果存在，是否复盖（默认复盖）</param>
        public static bool CopyFolder(string sourceFolder, string targetFolder, bool overWrite = true)
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(GetTruePath(sourceFolder));
            DirectoryInfo directoryInfo2 = new DirectoryInfo(GetTruePath(targetFolder));
            if (!directoryInfo.Exists)
            {
                return false;
            }
            if (!directoryInfo2.Exists)
            {
                directoryInfo2.Create();
            }
            try
            {
                FileInfo[] files = directoryInfo.GetFiles();
                for (int i = 0; i < files.Length; i++)
                {
                    File.Copy(files[i].FullName, directoryInfo2.FullName + "\\" + files[i].Name, overWrite);
                }
                DirectoryInfo[] directories = directoryInfo.GetDirectories();
                for (int j = 0; j < directories.Length; j++)
                {
                    CopyFolder(directories[j].FullName, directoryInfo2.FullName + "\\" + directories[j].Name);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region 删除目录（递归）
        /// <summary>
        /// 删除目录（递归）
        /// </summary>
        /// <param name="fullpath">真实路径或虚拟路径</param>
        /// <returns></returns>
        public static void DeleteFolder(string fullpath)
        {
            fullpath = GetTruePath(fullpath);

            new DirectoryInfo(fullpath).Attributes = (FileAttributes)0;
            File.SetAttributes(fullpath, FileAttributes.Normal);
            if (Directory.Exists(fullpath))
            {
                string[] fileSystemEntries = Directory.GetFileSystemEntries(fullpath);
                foreach (string text in fileSystemEntries)
                {
                    if (File.Exists(text))
                    {
                        File.Delete(text);
                    }
                    else
                    {
                        DeleteFolder(text);
                    }
                }
                Directory.Delete(fullpath);
            }
        }
        #endregion

        #region 获得目录名称
        /// <summary>
        /// 获得目录名称
        /// </summary>
        /// <param name="path">路径</param>
        public static string GetFolderName(string path)
        {
            return GetFolderName(path, false);
        }
        /// <summary>
		/// 获得目录部分
		/// </summary>
		/// <param name="path">路径</param>
		/// <param name="isTruePath">是否返回真实路径</param>
		public static string GetFolderName(string path, bool isTruePath)
        {
            path = path.Substring(0, path.LastIndexOf("\\") + 1);
            if (isTruePath)
            {
                path = GetTruePath(path);
            }
            return path;
        }
        #endregion

        #region 目录是否存在
        /// <summary>
        /// 目录是否存在
        /// </summary>
        public static bool IsFolderExists(string folder)
        {
            return Directory.Exists(GetTruePath(folder));
        }
        #endregion


        #region 获得文件的名称
        /// <summary>
        /// 获得文件的名称
        /// </summary>
        /// <param name="filePath">文件</param>
        /// <returns></returns>
        public static string GetFileName(string filePath)
        {
            if (!filePath.IsEmpty() && filePath.Contains("."))
            {
                filePath = filePath.Trim();
                return filePath.Substring(filePath.LastIndexOf("\\") + 1);
            }
            return string.Empty;
        }
        #endregion

        #region 读取指定文件的文本内容
        /// <summary>
        /// 读取指定文件的文本内容
        /// </summary>
        /// <param name="filename">文件路径（真实路径/虚拟路径）</param>
        /// <param name="encoding">指定编码，默认为utf-8</param>
        /// <returns></returns>
        public static string Read(string filename, Encoding encoding = null)
        {
            var path = GetTruePath(filename);
            if (encoding == null) encoding = Encoding.UTF8;
            if (File.Exists(path)) return File.ReadAllText(path);
            else return string.Empty;
        }
        #endregion

        #region 写入文件内容
        /// <summary>
        /// 写入文件内容
        /// </summary>
        /// <param name="file">文件路径（真实路径/虚拟路径）</param>
        /// <param name="content">内容</param>
        /// <param name="encoding">指定编码，默认为utf-8</param>
        public static void White(string file, string content, Encoding encoding = null)
        {
            var path = GetTruePath(file);
            if (encoding == null) encoding = Encoding.UTF8;
            File.WriteAllText(path, content, encoding);
        }
        #endregion

        #region 文件是否存在
        /// <summary>
        /// 文件是否存在
        /// </summary>
        public static bool IsFileExists(string file)
        {
            return File.Exists(GetTruePath(file));
        }
        #endregion

        #region 获取指定文件的扩展名
        /// <summary>
        /// 获取指定文件的扩展名(带.号)
        /// </summary>
        /// <param name="fileName">指定文件名</param>
        /// <returns>扩展名</returns>
        public static string GetFileExtName(string fileName)
        {
            if (!fileName.IsEmpty() && fileName.Contains("."))
            {
                fileName = fileName.ToLower().Trim();
                return fileName.Substring(fileName.LastIndexOf('.'));
            }
            return string.Empty;
        }
        #endregion

        #region 删除指定文件
        /// <summary>
        /// 批量删除文件
        /// </summary>
        /// <param name="files"></param>
        public static void DeleteFile(IEnumerable<string> files)
        {
            foreach (var item in files)
            {
                DeleteFile(item);
            }
        }
        /// <summary>
        /// 删除指定文件
        /// </summary>
        /// <param name="file">要删除的文件</param>
        public static bool DeleteFile(string file)
        {
            try
            {
                if (file.IsEmpty()) return true;
                file = GetTruePath(file);
                if (File.Exists(file))
                {
                    File.Delete(file);
                    string smallName = ImageHelper.GetThumbnailName(file);
                    if (File.Exists(smallName))
                    {
                        File.Delete(smallName);
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region 移动文件
        /// <summary>
        /// 移动文件
        /// </summary>
        /// <param name="sourcePath">源文件地址（支持虚拟、真实地址）</param>
        /// <param name="targetPath">目标地址（支持虚拟、真实地址）</param>
        public static void MoveFile(string sourcePath, string targetPath)
        {
            var source = GetTruePath(sourcePath);
            if (IsFileExists(source))
            {
                var target = GetTruePath(targetPath, true);
                if (IsFileExists(target)) DeleteFile(target);
                File.Move(source, target);

                string thumbnai = ImageHelper.GetThumbnailName(source);
                if (IsFileExists(thumbnai))
                {
                    var targetThumbnai = ImageHelper.GetThumbnailName(target);
                    if (IsFileExists(targetThumbnai)) DeleteFile(targetThumbnai);
                    File.Move(thumbnai, targetThumbnai);
                }
            }
        }
        #endregion

        #region 复制文件
        /// <summary>
        /// 复制文件
        /// </summary>
        /// <param name="sourceFile">源文件名</param>
        /// <param name="toFile">目标文件名</param>
        /// <param name="overwrite">当目标文件存在时是否覆盖 true-默认覆盖</param>
        /// <returns>操作是否成功</returns>
        public static bool CopyFile(string sourceFile, string toFile, bool overwrite = true)
        {
            if (!IsFileExists(sourceFile)) return false;
            if (!overwrite && IsFileExists(toFile)) return false;
            try
            {
                File.Copy(sourceFile, toFile, true);
                return true;
            }
            catch
            {
                return false;
            }
        }
        #endregion

        #region 查找文件
        /// <summary>
        /// 查找文件
        /// </summary>
        /// <param name="path">目录路径</param>
        /// <param name="searchPattern">查询条件如：*.jpg</param>
        /// <param name="searchOption">查找选项</param>
        /// <returns></returns>
        public static string[] FindFiles(string path, string searchPattern, SearchOption searchOption)
        {
            return Directory.GetFiles(GetTruePath(path), searchPattern, SearchOption.AllDirectories);
        }

        /// <summary>
        /// 查找文件（包含所有子目录下的文件）
        /// </summary>
        /// <param name="path">目录路径</param>
        /// <param name="searchPattern">查询条件，如：*.jpg</param>
        /// <returns></returns>
        public static string[] FindFiles(string path, string searchPattern)
        {
            return FindFiles(path, searchPattern, SearchOption.AllDirectories);
        }
        #endregion

        #region 获取文件版本
        /// <summary>
        /// 获取文件版本
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns>版本号</returns>
        public static string FileVersion(string filePath)
        {
            return FileInfo(filePath).FileVersion;
        }
        #endregion

        #region 获取文件详细信息
        /// <summary>
        /// 获取文件详细信息
        /// </summary>
        /// <param name="filePath">文件路径</param>
        /// <returns></returns>
        public static FileVersionInfo FileInfo(string filePath)
        {
            return FileVersionInfo.GetVersionInfo(GetTruePath(filePath));
        }
        #endregion

        #region 获取指定文件在大小
        /// <summary>
        /// 获取指定文件在大小
        /// </summary>
        /// <param name="filePath">文件（支持虚拟路径）</param>
        /// <returns></returns>
        public static double GetFileSize(string filePath)
        {
            if (!filePath.IsEmpty() && filePath.Contains("."))
            {
                filePath = filePath.Trim();
                return (double)new FileInfo(GetTruePath(filePath)).Length;
            }
            return 0.0;
        }
        #endregion
    }
}
