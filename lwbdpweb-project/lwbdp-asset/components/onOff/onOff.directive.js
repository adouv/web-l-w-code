import './onOff.css';
export default function onOffDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: '<div ng-click="toggleState()" class="on_btn" ng-class="{cur:!isvalid}">' +
            '<div class="white_btn"></div>' +
            '</div>',
        scope: {
            isvalid: "="
        },
        link: function($scope, ele, attrs) {
            $scope.toggleState = function() {
                $scope.isvalid = !$scope.isvalid;
                if ($scope.isvalid) {
                    ele.className = 'on_btn cur';
                } else {
                    ele.className = 'on_btn';
                }
            }
        }
    }
}