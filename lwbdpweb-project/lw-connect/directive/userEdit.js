import template from '../userEdit.html'
export default function userEditDirective() {
    return {
        template: template,
        restrict: 'AE',
        link(scope, element, attrs) {
            element[0].childNodes[2].childNodes[7].childNodes[1].childNodes[3].childNodes[1].focus()
        }
    }
}
userEditDirective.$inject = [];