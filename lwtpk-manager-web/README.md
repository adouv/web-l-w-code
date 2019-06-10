#项目启动流程
##项目从gitLab拉下来之后需要进行的操作：
1. 查看npm是否安装：`npm -v`（显示版本号即为安装）；
2. 查看cnpm是否安装：`cnpm -v`（显示版本号即为安装）；
3. 查看bower是否安装：`bower -v`（显示版本号即为安装）；
4. 查看gulp是否安装：`gulp -v`（显示版本号即为安装）。

##以上环境检查完之后，在进行以下操作，否则到[wiki](http://10.0.0.2:8011/wiki/pages/viewpage.action?pageId=8814596) 安装环境

1. 在package.json所在的文件夹目录下执行`cnpm install` 命令，安装node的依赖库；
2. 在bower.json所在的文件夹目录下执行`bower install` 命令，安装bower的依赖库；
3. 复制bower_components 目录到 app或src 目录下；
4. 启动项目：`gulp serve`。
