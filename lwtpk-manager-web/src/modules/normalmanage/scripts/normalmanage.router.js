/**
 * Created by cuishiyong on 2018/1/9.
 */
window.tpk_normalmanage = angular.module('tpk.normalmanage',[]);
tpk_dailyschedule.config(function ($stateProvider) {
    $stateProvider
        .state(sys+'normalmanage',{
            url:'/normalmanage/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'normalmanage'){
                    $state.go(sys+'normalmanage.index');
                }
            }
        })
        .state(sys+'normalmanage.index',{
            template:require('../views/normal.html'),
            controller:'normalmanage.normal.ctrl'
        })

});