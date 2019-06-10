/**
 * @Author hejialin
 * @Description 记账项目路由
 */
import http from '../common/scripts/services/http.service'
import plugins from '../common/scripts/directives/common.plugins'
import appConfig from '../common/configs/app.config';
import ngDialog from 'ng-dialog';
import permission from '../common/scripts/services/permission.service';
var bdpWeb = angular.module('bdpWeb', [
    permission,
    http,
    plugins,
    ngDialog,
    'bdp.capitalnumber',
    'bdp.projectcapital'
]);
bdpWeb.config(function ($stateProvider,$httpProvider) {
    $stateProvider
        .state('bill', {
            url: '/bill',
            template: require('../index.html'),
            controller: 'billCtrl',
            controllerAs:'bill'
        });
    var encodeUrl = {
        params: function (obj) {
            this.query = '';
            for (var name in obj) {
                this.urlTransCode(obj[name], name);
            }
            return this.query.length ? this.query.substr(1) : this.query;
        },
        urlTransCode: function (value, name) {
            if (value instanceof Array) {
                for (var key = 0; key < value.length; ++key) {
                    this.paramsArray(value, name, key);
                }
            }
            else if (value instanceof Object) {
                for (var key in value) {
                    this.paramsObject(value, name, key);
                }
            }
            else if (value !== undefined && value !== null)
                this.query += '&' + encodeURIComponent(name) + '=' + encodeURIComponent(value);
        },
        paramsObject: function (value, name, key) {
            var fullSubName, subValue, innerObj;
            subValue = value[key];
            fullSubName = name + '.' + key;
            innerObj = {};
            innerObj[fullSubName] = subValue;
            this.query += '&' + this.params(innerObj);
        },
        paramsArray: function (value, name, key) {
            var fullSubName, subValue, innerObj;
            subValue = value[key];
            fullSubName = name + '[' + key + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            this.query += '&' + this.params(innerObj);
        }
    };

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? encodeUrl.params(data) : data;
    }];

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
});
