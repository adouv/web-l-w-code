/**
 * Created by hejialin on 2016/11/14.
 */
var run = angular.module('lw.run', []);
run.run(function ($rootScope,$state) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            var user = sessionStorage.getItem('user');
            if(toParams.gardenId==''){
                toParams.gardenId=eval('('+user+')').gardenId;
            }
            if (!user && toParams.gardenId) {
                var user = JSON.stringify({gardenId: toParams.gardenId});
                sessionStorage.setItem('user', user);
            }
            $rootScope.gardenId = toParams.gardenId;
        });
        /*$rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;
        });
        $rootScope.gobalBack = function() {//实现返回的函数
            $state.go($rootScope.previousState_name,$rootScope.previousState_params);
        };*/
});