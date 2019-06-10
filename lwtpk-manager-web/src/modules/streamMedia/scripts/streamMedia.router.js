window.tpk_streamMedia = angular.module('tpk.streamMedia',[]);
tpk_streamMedia.config(function ($stateProvider) {

    $stateProvider
        .state(sys+'streamMedia',{
            url:'/streamMedia/:gardenId',
            template:require('../index.html'),
            controller:function ($state,$stateParams) {
                if($state.current.name==sys+'streamMedia'){
                    $state.go(sys+'streamMedia.index');
                }
            }
        })
        .state(sys+'streamMedia.index',{
            template:require('../views/list.html'),
            controller:'streamMedia.ctrl'
        })
        .state(sys+'streamMedia.input',{
            url:'/input/:id',
            template:require('../views/input.html'),
            controller:'streamMediaMessage.ctrl'
        })
        .state(sys+'streamMedia.info',{
            url:'/info/:id',
            template:require('../views/info.html'),
            controller:'streamMediaMessage.ctrl'
        })

});