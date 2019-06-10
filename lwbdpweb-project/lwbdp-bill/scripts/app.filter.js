/**
 * Created by lizp on 2017/2/13.
 */
var bdpWeb = angular.module('bdpWeb');
bdpWeb.filter('trust2Html', ['$sce',function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}])
