/**
 * Created by lw-yf-025 on 2017/1/3.
 */


window.tpk_activity = angular.module('tpk.activity', []);
tpk_activity.config(function ($stateProvider) {
  $stateProvider
    .state(sys + 'activity', {
      url: '/activity/:gardenId',
      template: require('../index.html'),
      controller: function ($state) {
        if ($state.current.name == sys + 'activity') {
          $state.go(sys + 'activity.index');
        }
      }
    })
    .state(sys + 'activity.index', {
      template: require('../views/list.html'),
      controller: 'activity.list.ctrl'
    })
    .state(sys + 'activity.input', {
      url: '/input',
      template: require('../views/input.html'),
      controller: 'activity.input.ctrl'
    })
    .state(sys + 'activity.edit', {
      url: '/edit/:type/:id',
      template: require('../views/edit.html'),
      controller: 'activity.edit.ctrl'
    })
    .state(sys + 'activity.look', {
      url: '/look/:type/:id',
      template: require('../views/look.html'),
      controller: 'activity.look.ctrl'
  })
    .state(sys+'activity.videouploud',{
      url:'/videouploud',
      template:require('../views/videoUplud.html'),
      controller:'activity.videouploud.ctrl'
    })
});
