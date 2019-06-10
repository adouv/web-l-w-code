/**
 * Created by lw-yf-015 on 2016/12/3.
 */
window.tpk_dailyschedule = angular.module('tpk.dailyschedule',[]);
tpk_dailyschedule.config(function ($stateProvider) {
    $stateProvider
        .state(sys+'dailyschedule',{
            url:'/dailyschedule/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'dailyschedule'){
                    $state.go(sys+'dailyschedule.index');
                }
            }
        })
        .state(sys+'dailyschedule.index',{
            template:require('../views/list.html'),
            controller:'dailyschedule.list.ctrl'
        })
        .state(sys+'dailyschedule.input',{
            url:'/input/:gardenId/:id',
            template:require('../views/input.html'),
            controller:'dailyschedule.input.ctrl'
        })
        .state(sys+'dailyschedule.detail',{
            url:'/detail/:id',
            template:require('../views/detail.html'),
            controller:'dailyschedule.detail.ctrl'
        })

});
