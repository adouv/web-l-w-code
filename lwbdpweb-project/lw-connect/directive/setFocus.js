/**
 * Created by lw-yf-011 on 2017/7/11.
 */
export default function setFocusDirective(){
    return {
        template : `<input type="text" class="input_class" ng-model="connect.userInfo.displayName" maxlength="20" ng-change="connect.limitNameLength(connect.userInfo.displayName)">`,
        restrict : 'AE',
        replace: true,
        link (scope, element, attrs){
            element[0].focus();
        }
    }
}
setFocusDirective.$inject = [];