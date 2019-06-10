/**
 * Created by xuhongbo on 2017/5/6
 * 图片预览功能、支持图片预览以及office预览
 */
import picViewHTML from './picView.html';
import './picView.css';

export default function picView($compile, config) {
    return {
        restrict: 'AE',
        replace: true,
        template: picViewHTML,
        scope: {
            filePath: '=', //文件服务器路径
            fileName: '=', //文件名称
            sp: '=', //是否小图预览{不传值或者传false是有小图预览}{传sp='true'没有小图预览}
            edit: '=', //传入true会进行删除操作
            delFile: '&', //对外接口进行删除操作
            hideFile: '@',
            hideName: '@'
        },
        link: function($scope, element, attr) {
            if ($scope.edit === undefined) $scope.edit = attr.edit && attr.edit === 'true'
            if (!$scope.sp) {
                $scope.divStyle = 'ib'
            }
            let imgType = ['gif', 'jpg', 'jpeg', 'png'];
            $scope.$watch('fileName', val => {
                let names = $scope.fileName.split('.');
                $scope.ext = names[names.length - 1];
                $scope.img = imgType.indexOf($scope.ext) > -1;
                $scope.fileName = val;
            });

            let getFilePath = () => {
                let [path, fileName, fileType, fileserver] = [$scope.filePath, $scope.filePath.substring($scope.filePath.length - 3, $scope.filePath.length).toLowerCase(), 'img', '/lw-fileserver/fs/file/showPic?fileName=']
                fileName === 'peg' || fileName === 'png' || fileName === 'jpg' || fileName === 'gif' ? fileType = 'img' : fileType = 'office';
                //当文件为图片时 执行此函数体
                if (fileType === 'img') {
                    $scope.img = true;
                    $scope.fileSrc = config.file.SHOWIMG + $scope.filePath;
                    $scope.classValue = '';
                } else {
                    $scope.office = true;
                    if (fileName === 'doc' || fileName === 'xls' || fileName === 'pdf') {
                        $scope.classValue = 'office';
                        if (fileName === 'doc') {
                            $scope.classValue2 = 'word'
                        }
                        if (fileName === 'xls') {
                            $scope.classValue2 = 'excel'
                        }
                        if (fileName === 'pdf') {
                            $scope.classValue2 = 'pdf'
                        }
                    } else if (path.substring($scope.filePath.length - 4, $scope.filePath.length).toLowerCase() === 'docx' || path.substring($scope.filePath.length - 4, $scope.filePath.length).toLowerCase() === 'xlsx') {
                        $scope.classValue = 'office';
                        if (path.substring($scope.filePath.length - 4, $scope.filePath.length).toLowerCase() === 'docx') {
                            $scope.classValue2 = 'word'
                        } else {
                            $scope.classValue2 = 'excel'
                        }
                    } else if (fileName === 'dwg' || fileName === 'rar') {
                        $scope.other = true;
                        $scope.classValue = 'office';
                        $scope.noPreview = true;
                        if (fileName === 'dwg') {
                            $scope.classValue2 = 'dwg'
                        } else {
                            $scope.classValue2 = 'rar'
                        }
                    }
                }
            }

            $scope.$watch('filePath', url => {
                if (url) {
                    getFilePath();
                }
            });

            //图片预览
            //获取页面中图片预览dom
            let filePreview = angular.element(document.querySelector("#filePreview"));

            //是否打开预览插件
            $scope.isOpen = false;
            $scope.isFullPage = false;
            //打开文件预览
            $scope.showFileView = () => {
                    $scope.isOpen = true;
                    if (!$scope.img) return false;
                    var img = new Image();
                    img.src = $scope.fileSrc;
                    img.onload = () => {
                        var width = img.width,
                            height = img.height;
                        if (width < 787) {
                            $scope.minWidthHeightPic = "minHeightPic"
                        }
                        if (height < 564) {
                            $scope.minWidthHeightPic = "minWidthPic"
                        }
                        if (width < 787 && height < 564) {
                            $scope.minWidthHeightPic = "minWidthHeightPic"
                        }
                        if (width < 787 && height > 564) {
                            $scope.minWidthHeightPic = "minWidthMaxHeightPic"
                        }
                        if (width > 787 && height < 564) {
                            $scope.minWidthHeightPic = "maxWidthminHeightPic"
                        }
                        if (height > 136 && height > width) {
                            $scope.picViewImgStyle = true;
                        } else {
                            $scope.picViewImgStyle = false;
                        }
                        $scope.$apply()
                    }
                }
                //键盘按下ESC
            document.onkeydown = function(event) {
                if (event.keyCode == 27) {
                    filePreview.removeClass("fullpage")
                }
            }
            $scope.deleteFile = (e) => {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    $scope.delFile();
                }
                //开启全屏
            $scope.showFullScreen = () => {
                    $scope.isFullPage = true;
                    var de = document.documentElement;
                    if (de.requestFullscreen) {
                        de.requestFullscreen();
                    } else if (de.mozRequestFullScreen) {
                        de.mozRequestFullScreen();
                    } else if (de.webkitRequestFullScreen) {
                        de.webkitRequestFullScreen();
                    }
                    //这里判断是否已经打开了全屏
                    if (filePreview.hasClass('fullpage')) {
                        $scope.closeFileView('exit')
                    } else {
                        filePreview.addClass("fullpage");
                    }
                }
                //关闭页面 并且把视口设置为常规
            $scope.closeFileView = (param) => {
                $scope.isFullPage = false;
                filePreview.removeClass("fullpage")
                if (param !== 'exit') {
                    $scope.isOpen = false;
                }
                var de = document;
                if (de.exitFullscreen) {
                    de.exitFullscreen();
                } else if (de.mozCancelFullScreen) {
                    de.mozCancelFullScreen();
                } else if (de.webkitCancelFullScreen) {
                    de.webkitCancelFullScreen();
                }
            }
        }
    }
}
picView.$inject = ['$compile', '$config']