/**
 * Created by hejialin on 2016/11/14.
 */
import angular from 'angular';
var run = angular.module('lw.run', []);
run.run(function ($rootScope,$state) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            var gardenId = sessionStorage.getItem('gardenId');
            if(toParams.gardenId==''){
                toParams.gardenId = gardenId;
            }
            $rootScope.gardenId = toParams.gardenId;
        })
});