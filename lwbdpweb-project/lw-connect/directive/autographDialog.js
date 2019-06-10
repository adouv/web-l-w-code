import template from '../edit-template/autographDialog.html';
export default function autographDialog() {
    return {
        template: template,
        restrict: 'AE',
        scope: {
            isShow: '=',
            isShowUpload: '='
        },
        link(scope, element, attrs) {
            scope.dialogContent = {
                title: '用户须知',
                text: ['1.该签名将用于您参与的所有的公文审批流程，与您亲自个人签名具有同等的法律效力，请务必谨慎使用；', '2.您将对签名的内容的上传、编辑、删除等所有的管理行为负全部责任；']
            };
            /**
             * 取消关闭弹窗
             */
            scope.closeDialog = () => {
                scope.isShow = false;
            };
            /**
             * 确定执行操作
             */
            scope.confirmHandle = () => {
                    scope.isShow = false;
                    scope.isShowUpload = true;
            }
        }
    }
}
autographDialog.$inject = [];
