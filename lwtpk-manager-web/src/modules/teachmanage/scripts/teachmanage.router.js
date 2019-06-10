window.tpk_templatemanage = angular.module('tpk.teachmanage', []);
tpk_dailyschedule.config(function ($stateProvider) {
    $stateProvider
        .state(sys + 'teachmanage', {
            url: '/teachmanage/:gardenId',
            template: require('../index.html'),
            controller: function ($state, $stateParams, Base64Service, $config) {
                var gardenId = $stateParams.gardenId;
                var token = sessionStorage.getItem('token');
                var frame = document.getElementById('iframeWindow');
                token = Base64Service.encode(token);
                frame.src = $config.FRAME_HOST + '/teaching?gardenId=' + gardenId + '&token=' + token;
                if ($state.current.name == sys + 'teachmanage') {
                    $state.go(sys + 'teachmanage.index');
                }
            }
        })
        .state(sys + 'teachmanage.index', {})
});