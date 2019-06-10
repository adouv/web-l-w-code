/**
 * Created by lw-yf-015 on 2016/12/3.
 */
window.tpk_classroomManage = angular.module('tpk.classroomManage',[]);
tpk_classroomManage.config(function ($stateProvider) {
    $stateProvider
        .state(sys+'classroomManage',{
            url:'/classroomManage/:gardenId',
            template:require('../index.html'),
            controller:function ($state) {
                if($state.current.name==sys+'classroomManage'){
                    $state.go(sys+'classroomManage.index');
                }
            }
        })
        .state(sys+'classroomManage.index',{
            template:require('../views/list.html'),
            controller:'classroomManage.list.ctrl'
        })

});