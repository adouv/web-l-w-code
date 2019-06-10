/**
 * Created by hejialin on 2017/1/2.
 */
tpk_courseschedule.service('AreaAndCamera',[function () {
    return {
        selected : function ($scope) {
            $scope.searchCamera = function (name) {
                return !$scope.cameraWords || name.indexOf($scope.cameraWords) > -1;
            }
        }
    }
}]);