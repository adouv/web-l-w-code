import chooseKindReason from './chooseKindReason.html';
export default function chooseKindReasonDirective() {
    return {
        restrict: "AE",
        replace: true,
        scope: {
            showtitle: '=',
            list: "=",
            echoIds: "=",
            echoNames: "=",
            show: "="
        },
        template: chooseKindReason,
        link(scope) {
            let echoIds = scope.echoIds ? angular.copy(scope.echoIds).split(',') : [];
            scope.clickCheckbox = function($event, id) {
                let checked = $event.target.checked,
                    index = echoIds.indexOf(id);
                if (checked && index < 0) {
                    echoIds.push(id);
                } else if (!checked && index > -1) {
                    echoIds.splice(index, 1);
                }
            };
            scope.cancel = function() {
                scope.show = false;
            };
            scope.sure = function() {
                let echoNames = [];
                for (let data of scope.list) {
                    if (echoIds.indexOf(data.id) > -1) {
                        echoNames.push(data.name);
                    }
                }
                scope.echoIds = echoIds.toString();
                scope.echoNames = echoNames.join(';');
                scope.show = false;
            }
        }
    }
}