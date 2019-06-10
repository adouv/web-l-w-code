/**
 * Created by lw-yf-015 on 2016/12/5.
 */
window.tpk_camera = angular.module('tpk.camera',[]);
tpk_camera.config(function ($stateProvider) {
    console.log(sys)
    $stateProvider
        .state(sys+'camera',{
            url:'/camera/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'camera'){
                    $state.go(sys+'camera.index');
                }
            }
        })
        .state(sys+'camera.index',{
            template:require('../views/assign.html'),
            controller:'camera.assign.ctrl'
        })
        .state(sys+'camera.camera',{
            url:'/camera',
            template:require('../views/camera.list.html'),
            controller:'camera.camera.ctrl'
        })
        .state(sys+'camera.area',{
            url:'/area',
            template:require('../views/area.list.html'),
            controller:'camera.area.ctrl'
        })
});