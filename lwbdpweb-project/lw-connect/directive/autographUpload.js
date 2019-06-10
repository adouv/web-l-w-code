import template from '../edit-template/autographUpload.html';
export default function autographDialog(dialogsManager) {
    return {
        template: template,
        restrict: 'AE',
        scope: {
            isShowUpload: '=',
            attachment: '=',
            uploadedUrl: '='
        },
        controller($scope) {
            $scope.attachment = $scope.attachment.slice(-1);
            $scope.servicePath = "dbp/signature";
            $scope.singleFile = true;
            $scope.dialogContent = {
                title: '上传个人签名',
                text: ['上传须知：',
                    ' 1、系统将通过图像识别技术，自动识别您的个人手写签名；',
                    '2、您需要在白色纸张上用黑色签字笔签上您的真实本人签名，用手机或其他拍照设备将其转化成图片；',
                    '3、图片格式：JPG、JPEG、PNG、BMP，图片大小：0~3M。'
                ]
            };
        },
        link(scope, element, attrs) {
            /**
             * 取消关闭弹窗
             */
            scope.closeDialog = () => {
                scope.tempUrl = scope.uploadedUrl; //保存显示的个人签名地址
                scope.isShowUpload = false;
                scope.uploadedUrl = scope.tempUrl;
                let len = scope.attachment.length;
                if(scope.tempUrl){
                    scope.attachment[len - 1] = {
                        url: scope.tempUrl
                    };
                }else{
                    scope.attachment = [];
                }       
                scope.errorStyle = false;
            };
            /**
             * 确定执行操作
             */
            scope.confirmHandle = () => {
                if (!scope.attachment.length) {
                    scope.errorStyle = true;
                    dialogsManager.showMessage('请上传您的手写签名照片！', {
                        className: 'warning'
                    });
                    return;
                }
                scope.tempUrl = scope.uploadedUrl; //保存显示的个人签名地址
                scope.isShowUpload = false;
                let len = scope.attachment.length;
                scope.errorStyle = false;
                scope.uploadedUrl = scope.attachment[len - 1].url; //上传签名的url
                scope.errorStyle = false;
            }
        }
    }
}
autographDialog.$inject = ['dialogsManager'];