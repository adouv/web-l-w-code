import addConfig from './addAssetConfig.html';
export default function addConfigDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: addConfig,
        scope: {
            limit: "=",
            closeClick: "&",
            return : "=",
            put : "&"
        },
        link($scope) {
            $scope.clickEvent = function() {
                $scope.closeClick()
            }
            $scope.sure = function(){
                $scope.put();
            }

            $scope.numFlite = function(){
                $scope.return.minLifecycle = parseInt($scope.return.minLifecycle);
            }
        }
    }
}