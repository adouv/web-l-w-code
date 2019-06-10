export default ['$rootScope', function($rootScope) {

    return function($scope, $element, $attributes) {

        $rootScope[$attributes['getDom']] = $element[0];

    }
}]