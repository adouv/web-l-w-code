/**
 * Created by lw-yf-015 on 2016/12/3.
 */
window.tpk_courseschedule = angular.module('tpk.courseschedule',[]);
tpk_courseschedule.config(function ($stateProvider) {
    $stateProvider
        .state(sys+'courseschedule',{
            url:'/courseschedule/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'courseschedule'){
                    $state.go(sys+'courseschedule.index');
                }
            }
        })
        .state(sys+'courseschedule.index',{
            template:require('../views/list.html'),
            controller:'courseschedule.list.ctrl'
        })

});