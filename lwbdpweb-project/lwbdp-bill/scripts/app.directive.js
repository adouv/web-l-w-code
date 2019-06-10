var bdpWeb = angular.module('bdpWeb');
bdpWeb.directive('numberUpDown', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			element.on('keydown',function(e){
				var keycode = window.event?e.keyCode:e.which;
				if(keycode == 38 || keycode==40 || keycode==107 || keycode==109){
					e.preventDefault();
				}
			});
			element.on('mousewheel',function(e){
				e.preventDefault();
				return false;
			})
		}
	};
});
/*字符串转化为数字*/
bdpWeb.directive('stringToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(value) {
				return '' + value;
			});
			ngModel.$formatters.push(function(value) {
				/*var m = Math.pow(10, 6);
				return parseInt(value * m, 10) / m;*/
				return parseFloat(value);
			});
		}
	};
});
bdpWeb.directive('ngCloak', function() {
	return {
		require: 'ngModel',
		compile: function(element, attr) {
			attr.$set('ngCloak', undefined);
			element.removeClass('ng-cloak');
		},
		link: function(scope, element, attrs, ngModel) {

		}
	};
});
