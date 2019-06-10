var bdp_capitalnumber = angular.module('bdp.capitalnumber', ['bdpWeb']);
bdp_capitalnumber.config(function ($stateProvider) {
    $stateProvider
        .state('bill.capitalnumber', {
            url: '/capitalnumber',
            template: require('../index.html'),
            controller: function ($state) {
                if ($state.current.name == 'bill.capitalnumber') {
                    $state.go('bill.capitalnumber.index');
                }
            }
        })
        .state('bill.capitalnumber.input', {
            url: '/input/:id',
            template: require('../views/capitalnumber.input.html'),
            controller: 'capitalnumber.input.ctrl'
        })
        .state('bill.capitalnumber.index', {
            template: require('../views/capitalnumber.list.html'),
            controller: 'capitalnumber.list.ctrl'
        })
        .state('bill.capitalnumber.detail', {
            url: '/detail/:id',
            template: require('../views/capitalnumber.detail.html'),
            controller: 'capitalnumber.detail.ctrl'
        })
        .state('bill.capitalnumber.batchInput', {
            url: '/batchInput/:importType/:importName/:importProjectTypeName',
            template: require('../views/batchInput.html'),
            controller: 'batchInput.ctrl'
        })
});
