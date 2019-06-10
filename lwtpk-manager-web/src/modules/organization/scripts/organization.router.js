/**
 * Created by lw-yf-015 on 2016/12/3.
 */
window.tpk_organization = angular.module('tpk.organization',[]);
tpk_organization.config(function ($stateProvider) {
    $stateProvider
        .state(sys+'organization',{
            url:'/organization/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'organization'){
                    $state.go(sys+'organization.index');
                }
            }
        })
        .state(sys+'organization.index',{
            template:require('../views/area.html'),
            controller:'organization.area.ctrl'
        })

});