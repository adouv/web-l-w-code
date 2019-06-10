import './select.css';
import select from './select.html';
export default function selectDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: select,
        scope:{
            name:'='
        }
    }
}