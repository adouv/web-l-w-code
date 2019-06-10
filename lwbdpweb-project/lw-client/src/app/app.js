import './styles/iconfont.css';
import './styles/app.css';
import './login/css/login.css'
import '../../../lwbdp-bill/scripts/app.entry';
import common from 'lw-common';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import clientRoute from './router';
import Config from './config';
import AppCtrl from './app.ctrl';
import lwPermissionService from './permission.service';

import clientLoginCtrl from './login/login.ctrl';
import clientEntryCtrl from './login/entry.ctrl'


import directive from './app.directive';
import filter from './app.filter';
import clientService from './services/client.service';
import loginService from './services/login.service';
import clientDirective from './directives/client.directive'

import bdpCommon from '../../../lwbdp-common/index'
import connectModule from '../../../lw-connect/index';
import assetModule from '../../../lwbdp-asset/index';
import repairModule from '../../../lwbdp-repair/index';
import purchaseModule from '../../../lwbdp-purchase/index';
import logisticsModule from '../../../lwbdp-logistics/index';
import queryModule from '../../../lwbdp-query/index';
let app = (clientService, $timeout, $location) => {
    return {
        template: require('./app.html'),
        controller: 'AppCtrl',
        controllerAs: 'app',
        link: (scope, elem) => {
            if (clientService.isClient()) {
                let docHtml = angular.element(document.getElementsByTagName('html'));
                if (clientService.win.isTransparent === false) {
                    clientService.setWindowSize(1000, 600);
                    docHtml.addClass('win7_wrap');
                }
                docHtml.addClass('client_wrap');
            }
        }
    }
};
const MODULE_NAME = 'app';
angular.module(MODULE_NAME, [uirouter, common, directive, connectModule, assetModule, repairModule, 'bdpWeb', 'ngCookies', lwPermissionService, bdpCommon, filter, clientDirective, purchaseModule, logisticsModule, queryModule])
    .config(clientRoute)
    .directive('app', (clientService, $timeout, $location) => new app(clientService, $timeout, $location))
    .service('$config', Config)
    .service('clientService', clientService)
    .service('loginService', loginService)
    .controller('AppCtrl', AppCtrl)
    .controller('clientLoginCtrl', clientLoginCtrl)
    .controller('clientEntryCtrl', clientEntryCtrl);
angular.bootstrap(document, [MODULE_NAME]);
export default MODULE_NAME;