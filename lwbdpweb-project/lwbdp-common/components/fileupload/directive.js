/**
 * @Author hejialin
 * @Description 描述
 */
import './style.css';

class uploadFileCtrl {
    constructor($timeout, $scope, dialogsManager, $filter, $config) {
        this.$scope = $scope;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.dialogsManager = dialogsManager;
        this.filePath = $config.file.SHOWIMG;
        this.init();
    }

    init() {
        this.watchAttachmentList();
        if (!this.$scope.attachmentList) {
            this.$scope.attachmentList = [];
        }
    }

    watchAttachmentList() {
        this.$scope.$watch('attachmentList', attList => {
            if (attList && attList[0]) {
                this.attachments = this.getTypeFile(attList || []);
                this.fileValid = this.attachments[0];
            }
        });
    }

    /**
     * 获取flow验证的格式
     * @return {{}}
     */
    getFlowVailFormat(format) {
        let validExt = {};
        format.split(',').forEach(ext => {
            validExt[ext] = 1;
        });
        return validExt;
    }

    /**
     * 获取相对类型的文件
     * @param attachmentList
     * @return {Array}
     */
    getTypeFile(attachmentList) {
        let attachments = [];
        if (!angular.isArray(attachmentList)) {
            throw new Error('回显文件的参数必须是一个数组！');
        }
        for (let attachment of attachmentList) {
            if (attachment.type == this.$scope.type) {
                attachments.push(attachment);
            }
        }
        return attachments;
    }

    /**
     * 上传文件验证
     * @param $file ngFlow的文件对象
     * @return {boolean}
     */
    validFile($file) {
        let type = this.getFlowVailFormat(this.$scope.format);
        //上传个人签名不符合要求吐司
        if (this.$scope.isSignature && (!type[$file.getExtension()] || $file.size > this.$scope.size)) {
            this.dialogsManager.showMessage(
                '请上传符合要求的图片！', {
                    className: 'warning'
                });
            return false;
        }
        if (!type[$file.getExtension()]) {
            this.dialogsManager.showMessage(
                '所选附件格式系统不支持上传！', {
                    className: 'warning'
                });
            return false;
        } else if ($file.size > this.$scope.size) {
            let formatSize = this.$filter('formatFileSize')(this.$scope.size);
            formatSize = formatSize.replace('.00', '');
            this.dialogsManager.showMessage(
                '附件大小不允许超过' + formatSize + '！', {
                    className: 'warning'
                });
            return false;
        }
        return true;
    }

    /**
     * 上传文件成功
     * @param message
     * @param file
     */
    uploadAttestFileSuccess(message, file) {
        this.fileValid = true;
        let fileInfo = eval("(" + message + ")");
        this.$scope.attachmentList.push({
            name: fileInfo.name,
            type: this.$scope.type,
            url: fileInfo.path
        });
        file.url = fileInfo.path;
        this.uploadProgress(file);
    }

    /**
     * 进度条控制显示隐藏
     * @param file
     * @return {boolean}
     */
    uploadProgress(file) {
        let imgType = ['jpg', 'jpeg', 'png', 'gif'];
        file.isImg = imgType.indexOf(file.getType()) > -1;
        if (!file.ext && !file.isImg) {
            let names = file.name.split('.');
            file.ext = names[names.length - 1];
        }
        if (file.progress() >= 1) {
            this.$timeout(() => {
                file.hide = true
            }, 500);
        }
        return true;
    }

    /**
     * 删除回显文件列表的文件
     * @param arg
     */
    removeFile(arg) {
        let url = null;
        if (angular.isNumber(arg)) {
            url = this.attachments.splice(arg, 1)[0].url;
        } else if (angular.isObject(arg)) {
            url = arg.url;
        }
        for (let i = 0, len = this.$scope.attachmentList.length; i < len; i++) {
            if (this.$scope.attachmentList[i].url == url) {
                this.$scope.attachmentList.splice(i, 1);
                break;
            }
        }
        this.fileValid = this.getTypeFile(this.$scope.attachmentList)[0];
    }

    deleteFile(data) {
        for (let i = 0, len = this.attachments.length; i < len; i++) {
            if (this.attachments[i].url == data.url) {
                this.attachments.splice(i, 1);
                break;
            }
        }
    }

    /*
     * 删除所有文件
     * */
    removeAllFile($flow) {
        if ($flow) {
            $flow.cancel();
        }
    }
}

uploadFileCtrl.$inject = ['$timeout', '$scope', 'dialogsManager', '$filter', '$config'];

export class fileUploadRemove {
    constructor() {
        this.scope = {
            fileUploadRemove: '&'
        };
    }

    link(scope, elem) {
        elem.on('click', () => {
            // if(scope.fileSure()){
            document.querySelector('#flow-sure-btn').click();
            // }
        });
    }
}

export class bdpUploadFile {
    constructor($compile) {
        this.restrict = 'EA';
        this.$compile = $compile;
        this.scope = {
            attachmentList: '=',
            required: '@',
            w5cRequired: '@',
            title: '@',
            type: '@',
            format: '@',
            size: '@',
            remarkFile: '@',
            remarkTitle: '@',
            message: '@',
            btnName: '@',
            upload: '=',
            servicePath: '@', //指定服务器储存路径
            isSignature: '@'  //用于上传个人签名（单张）
        };
        this.replace = true;
        this.template = '<div class="attach_upload"></div>';
        this.controller = uploadFileCtrl;
        this.controllerAs = 'uploadFile';
    }

    link(scope, elem, attrs) {
        scope.servicePath = scope.servicePath ? scope.servicePath : 'dbp';
        scope.isSignature = scope.isSignature ? true : false;
        let uploadElem = this.$compile(this.getTemplate(scope.type, scope.servicePath, scope.isSignature))(scope);
        elem.removeAttr('title');
        elem.append(uploadElem);
    }
    getTemplate(type, servicePath, isSingle) {
        if (!isSingle) {
            return `
            <div flow-init="{query:{folder:'${servicePath}'}}" flow-files-submitted="$flow.upload()"
                 flow-file-added="uploadFile.validFile($file)"
                 flow-file-success="uploadFile.uploadAttestFileSuccess($message,$file)">
                <div class="head_wrapper clearfix">
                    <span class="lf_name w250 word_center fl"><span>{{title}}：</span><i class="remark-title" ng-if="remarkTitle">{{remarkTitle}}</i></span>
                    <div class="title_wrapper fl" ng-if="upload!==false">
                        <flow-btn class="btn_bd fl text_right_upload">{{btnName?btnName:'上传'}}</flow-btn>
                        <!--<p class="desc fl">{{remarkFile}}</p>-->
                        <div class="float-massage">{{message||remarkFile}}</div>
                    </div>
                </div>
                <span class="mgl144">
                        <input class="uploadAttachmentValid" w5c-dynamic-element="" ng-if="w5cRequired=='true'" type="text" ng-model="uploadFile.fileValid" required name="uploadAttachmentValid${type}">
                        <input class="uploadAttachmentValid" ng-if="required=='true'" type="text" ng-model="uploadFile.fileValid" required name="uploadAttachmentValid${type}">
                        <span class="red_color uploadFileMessage" ng-show="!uploadFile.fileValid">此项不能为空</span>
                </span>
                <div class="mar_left160 distance_num" ng-class="{'mag_top':upload===false}" ng-if="$flow.files.length>0 || uploadFile.attachments.length>0">
                    <span class="word_center w250"></span>
                    
                    <div class="add_img_box" >
                        <div class="img_box file_wrapper uploading" ng-class="{'uploaded':file.hide}" ng-repeat="file in $flow.files.slice().reverse()">
                            <!--<img ng-show="file.hide" ng-if="file.isImg" class="smallHeight fileSuccess" flow-img="file">-->
                            <!--<div ng-if="!file.isImg" class="file_type {{file.ext?'file-'+file.ext:''}}"></div>-->
                            <!--<p ng-show="file.hide" class="filename" title="{{file.name}}">{{file.name|processFileName:9}}</p>-->
                            <pic-view class="echo-file" ng-if="file.url" del-file="file.cancel();uploadFile.removeFile(file)" file-name="file.name" file-path="file.url"></pic-view>
                            <span  ng-show="file.hide" ng-class="{'top':file.hide}" class="remove" ng-click="file.cancel();uploadFile.removeFile(file,$flow.files)"></span>
                            <p class="process" style="top:0;" ng-show="!file.hide">
                                <em>{{file.progress() |flowPercentage}}</em>
                                <span ng-class="{'top':file.hide}" class="remove opacity" ng-if="!file.url" ng-click="file.cancel();uploadFile.removeFile(file)"></span>
                                <span id="flow-sure-btn" ng-click="uploadFile.removeAllFile($flow)"></span>
                                <span class="bg_purple" ng-style="{width: (file.progress() * 100) + '%'}"></span>
                            </p>
                        </div>
                        <pic-view class="echo-file" edit="true" del-file="uploadFile.removeFile($index)" name="{{file.url}}" ng-repeat="file in uploadFile.attachments track by file.url" file-name="file.name" file-path="file.url"></pic-view>
                    </div>
                </div>
            </div>
    `;
        } else {
            return `
            <div flow-init="{query:{folder:'${servicePath}',isSignature:true},singleFile:${isSingle}}" flow-files-submitted="$flow.upload()"
                 flow-file-added="uploadFile.validFile($file)"
                 flow-file-success="uploadFile.uploadAttestFileSuccess($message,$file)">
                <div class="head_wrapper clearfix">
                    <span class="lf_name w250 word_center fl"><span>{{title}}：</span><i class="remark-title" ng-if="remarkTitle">{{remarkTitle}}</i></span>
                    <div class="title_wrapper fl" ng-if="upload!==false">
                        <flow-btn class="btn_bd fl text_right_upload">{{btnName?btnName:'上传'}}</flow-btn>
                        <!--<p class="desc fl">{{remarkFile}}</p>-->
                        <div class="float-massage">{{message||remarkFile}}</div>
                    </div>
                </div>
                <span class="mgl144">
                        <input class="uploadAttachmentValid" w5c-dynamic-element="" ng-if="w5cRequired=='true'" type="text" ng-model="uploadFile.fileValid" required name="uploadAttachmentValid${type}">
                        <input class="uploadAttachmentValid" ng-if="required=='true'" type="text" ng-model="uploadFile.fileValid" required name="uploadAttachmentValid${type}">
                        <span class="red_color uploadFileMessage" ng-show="!uploadFile.fileValid">此项不能为空</span>
                </span> 
                <div class='single-img-wrapper' ng-if="attachmentList.length>0">
                     <img ng-src={{uploadFile.filePath+attachmentList.slice(-1)[0].url}}>
                </div>
            </div>
    `;
        }

    }
}
