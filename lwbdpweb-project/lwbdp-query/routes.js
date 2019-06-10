export default function routes($stateProvider) {
    $stateProvider
        .state('query', {
            url: '/query',
            template: require('./index.html'),
            controller: 'queryCtrl',
            controllerAs: 'query'
        })
        .state('query.home', {
            url: '/home',
            template: require('./components/query-home.html'),
            controller: 'queryHomeCtrl',
            controllerAs: 'queryHome'
        })
        .state('query.detail', {
            url: '/detail',
            template: require('./components/query-detail.html'),
            controller: 'queryDetailCtrl',
            controllerAs: 'queryDetail',
            params: {
                number: null
            }
        })
}

routes.$inject = ['$stateProvider'];