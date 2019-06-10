import './styles/iconfont.css';
import './styles/app.css';
import './login/css/login.css'
import '../../../lwbdp-bill/scripts/app.entry';
import common from 'lw-common';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import routing from './router';
import AppService from './app.service';
import AppCtrl from './app.ctrl';
import rootCtrl from './root.ctrl';
import loginCtrl from './login/login.ctrl';
import entryCtrl from './login/entry.ctrl'
import Config from './config';
import assetModule from '../../../lwbdp-asset/index';
import msg from './services/dialogsManager';
import loginService from './services/login.service';
import directive from './app.directive';
import filter from './app.filter';

import repairModule from '../../../lwbdp-repair/index'
import bdpCommon from '../../../lwbdp-common/index'
import purchaseModule from '../../../lwbdp-purchase/index'
import logisticsModule from '../../../lwbdp-logistics/index'

let app = () => {
    return {
        template: require('./app.html'),
        controller: 'AppCtrl',
        controllerAs: 'app'
    }
};
const MODULE_NAME = 'app';
angular.module(MODULE_NAME, [uirouter, repairModule, assetModule,purchaseModule,logisticsModule, common,bdpCommon, 'bdpWeb', msg,directive,ngAnimate,filter])
    .config(routing)
    .directive('app', app)
    .controller('AppCtrl', AppCtrl)
    .controller('rootCtrl', rootCtrl)
    .controller('loginCtrl', loginCtrl)
    .controller('entryCtrl', entryCtrl)
    .service('appService', AppService)
    .service('loginService', loginService)
    .service('$config', Config);
export default MODULE_NAME;