var bdp_projectcapital = angular.module('bdp.projectcapital', ['bdpWeb']);

bdp_projectcapital.config(function ($stateProvider) {
    $stateProvider
        .state('bill.projectcapital', {
            url: '/projectcapital',
            template: require('../index.html'),
            controller: 'projectcapital.ctrl'
        })
        .state('bill.projectcapital.income', {
            url: '/income',
            template: require('../views/projectcapital.income.html'),
            controller: 'projectcapital.income.ctrl'
        })
        .state('bill.projectcapital.index', {
            template: require('../views/projectcapital.list.html'),
            controller: 'projectcapital.list.ctrl'
        })
        .state('bill.projectcapital.payout', {
            url: '/payout',
            template: require('../views/projectcapital.payout.html'),
            controller: 'projectcapital.payout.ctrl'
        })
        .state('bill.projectcapital.recovery', {
            url: '/recovery',
            template: require('../views/projectcapital.recovery.html'),
            controller: 'projectcapital.recovery.ctrl'
        })
        .state('bill.projectcapital.detail', {
            url: '/detail/:type/:batchNo',
            template: require('../views/projectcapital.detail.html'),
            controller: 'projectcapital.detail.ctrl'
        })
        .state('bill.projectcapital.batchInput', {
            url: '/batchInput/:importType/:importName/:importProjectTypeName',
            template: require('../views/batchInput.html'),
            controller: 'batchInput.ctrl'
        })
        .state('bill.projectcapital.detail_back', {
            url: '/detail/recovery/back/:batchNo',
            template: require('../views/projectcapital.detail.back.html'),
            controller: 'projectcapital.detailBack.ctrl'
        })
});
