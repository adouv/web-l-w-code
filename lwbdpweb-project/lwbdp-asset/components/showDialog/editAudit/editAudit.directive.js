import editAudit from './editAudit.html';
export default function editAuditDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: editAudit,
        scope: {
            show: "="
        },
        link($scope, ele) {
            $scope.save = () => {
                $scope.show = false;
            }
            $scope.cancel = () => {
                $scope.show = false;
            }






        }
    }
}
editAuditDirective.$inject = [];