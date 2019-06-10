connectRoute.$inject = ['$stateProvider'];

// function authRouter($state, $cookies) {
//     // console.log('start');
//     // console.log($state);
//     // console.log($cookies.get('lwCookie'));
//     // if ($cookies.get('lwCookie') === undefined) {
//     //     $state.go('login');
//     // }
//     // console.log('end');
//     return $cookies.get('lwCookie');
// }

export default function connectRoute($stateProvider) {
    $stateProvider
        .state('connect', {
            url: '/connect',
            template: require('./index.html'),
            controller: 'connectController',
            controllerAs: 'connect',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('userEdit', {
            url: '/userEdit/:id',
            template: require('./userEdit.html'),
            controller: 'connectController',
            controllerAs: 'connect',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('connect.look', {
            url: '/look',
            template: require('./components/look/look-list/looklist.html'),
            controller: 'lookController',
            controllerAs: 'look',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('connect.wisdom', {
            url: '/wisdom',
            template: require('./components/wisdom/wisdomList.html'),
            controller: 'wisdomController',
            controllerAs: 'wisdom',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('connect.link', {
            url: '/link/:type',
            template: require('./components/link/link.html'),
            controller: 'linkController',
            controllerAs: 'link',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('connect.colleague', {
            url: '/colleague/:d_id',
            template: require('./components/colleague/colleagueList.html'),
            controller: 'colleagueController',
            controllerAs: 'colleague',
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
        .state('frame', {
            url: '/frame/:urlCode',
            template: `<link-frame></link-frame>`,
            resolve: {
                cookie: ['$cookies', function($cookies) {
                    return $cookies;
                }]
            }
        })
}