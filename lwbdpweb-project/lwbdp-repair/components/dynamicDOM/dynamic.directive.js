import dynamic from './dynamic.html';
import './dynamic.css';
import dy from './dy.json'
export default function dynamicDirective($http) {
    return {
        restrict: 'AE',
        replace: true,
        template: dynamic,
        scope: {},
        link(scope, ele, att) {
            console.log(dy.form)
            scope.dy=dy.form;
        }
    }
}
dynamicDirective.$inject=['$http']