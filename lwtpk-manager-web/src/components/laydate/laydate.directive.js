/**
 * 使用示例 ( 必须要传ID )
 * <input lw-laydate='yyyy-MM-dd HH:mm:ss' type="text" id="id1" ng-model="startTime"  max-date="{{model.max}}" min-date="{{model.min}}"/>
 */
var lwlaydate = angular.module('lw.date',[]);
lwlaydate.directive('lwLaydate', ['$filter','$timeout','$parse',function ($filter,$timeout,$parse) {
    return {
        require: '?ngModel',
        link: function (scope, element, attr, ngModel) {
            var _date = null, _config = {},nowDate;
            var format = attr.lwLaydate? attr.lwLaydate : 'yyyy-MM-dd';
            // 渲染模板完成后执行
            $timeout(function () {
                // 初始化参数
                var initDate = $filter('date')(element.val(),format);
                var maxDate = attr.maxDate ? attr.maxDate : '';
                var minDate = attr.minDate ? attr.minDate : '';
                maxDate = $filter('date')(maxDate,format);
                minDate = $filter('date')(minDate,format);
                _config = {
                    elem: '#' + attr.id,
                    format: format,
                    max: maxDate,
                    min: minDate,
                    istime: true,
                    start:initDate,
                    istoday: false,
                    choose: function (data) {
                        scope.$apply(setViewValue);
                    },
                    clear: function () {
                        ngModel.$setViewValue(null);
                    }
                };

                // 初始化
                _date = laydate(_config);

                // 监听日期最大值
                if (attr.hasOwnProperty('maxDate')) {
                    attr.$observe('maxDate', function (val) {
                        maxDate = $filter('date')(val,format);
                        _config.max = $filter('date')(val,format);
                    })
                }
                // 监听日期最小值
                if (attr.hasOwnProperty('minDate')) {
                    attr.$observe('minDate', function (val) {
                        minDate = $filter('date')(val,format);
                        _config.min = $filter('date')(val,format);
                    })
                }

                // 模型值同步到视图上
                ngModel.$render = function () {
                    element.val(ngModel.$viewValue || '');
                };

                // 监听元素上的事件
                element.on('blur keyup change', function () {
                    scope.$apply(setViewValue);
                });
                scope.$watch(attr.ngModel,function (data) {
                  if(data){
                    data = $filter('date')(data,format);
                    $parse(attr.ngModel).assign(scope,data);
                  }
                });
               /* ngModel.$formatters.push(function (data) {
                      console.log(data+'----')

                    return data;
                });*/
                setViewValue();
                // 更新模型上的视图值
                function setViewValue() {
                    var val = element.val();
                    ngModel.$setViewValue(val);
                }
            }, 100);
        }
    };
}]);
