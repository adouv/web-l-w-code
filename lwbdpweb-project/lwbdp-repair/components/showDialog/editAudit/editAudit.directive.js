import editAudit from './editAudit.html';
export default function editAuditDirective(session) {
    return {
        restrict: "AE",
        replace: true,
        template: editAudit,
        scope: {
            show: "=",
            data:"="
        },
        link($scope, ele) {
            $scope.$watch('data',function (val) {
                if(val&&val!==''){
                    $scope.repairDisposal.appData = val
                }
            })
            $scope.repairDisposal={};
            $scope.repairDisposal.account = session.get('account');
            $scope.repairDisposal.garden = session.get('currentGarden');
            $scope.save = () => {
                $scope.show = false;
            }
            $scope.cancel = () => {
                $scope.show = false;
            }
            $scope.approved = (a) => {
                console.log(a)
            }


            // $scope.appData = $scope.show;
            // $scope.repairDisposal.appData={};
            // $scope.repairDisposal.appData.show = false;








            //审核流程页面
            // 获取通知方式
            $scope.getAllNotice = (param) => {
                let isHave = false,
                    index = 0;
                $scope.appData.noticeTypeList.map((v, idx) => {
                    if (param === v) {
                        isHave = true;
                        index = idx;
                    }
                })
                if (isHave) {
                    $scope.appData.noticeTypeList.splice(index, 1);
                } else {
                    $scope.appData.noticeTypeList.push(param);
                }
            }
        }
    }
}
editAuditDirective.$inject = ['$sessionStorage'];