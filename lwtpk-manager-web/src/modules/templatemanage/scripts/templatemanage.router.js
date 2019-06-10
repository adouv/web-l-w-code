window.tpk_templatemanage = angular.module('tpk.templatemanage', []);
tpk_dailyschedule.config(function ($stateProvider) {
    $stateProvider
        .state(sys + 'templatemanage', {
            url: '/templatemanage/:gardenId',
            template: require('../index.html'),
            controller: function ($state, $stateParams, Base64Service, $config) {
                var gardenId = $stateParams.gardenId;
                var account = sessionStorage.getItem('account');
                var token = sessionStorage.getItem('token');
                var frame = document.getElementById('iframeWindow');
                token = Base64Service.encode(token);
                account = Base64Service.encode(account);
                frame.src = $config.FRAME_HOST + '/template?gardenId=' + gardenId + '&account=' + account + '&token=' + token;
                if ($state.current.name == sys + 'templatemanage') {
                    $state.go(sys + 'templatemanage.index');
                }
            }
        })
        .state(sys + 'templatemanage.index', {})
});