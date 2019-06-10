import './styles/connect_iconfont.css';
import './styles/common.css';
import './styles/base.css';
import './plug-ins/image-crop/image_crop.css';
import './styles/connect.css';
// 外部依赖
import angular from 'angular';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies'
// import ngWebSocket from './angular-websocketangular-websocket/dist/angular-websocket';
import 'angular-ws';
import connectRoute from './routes';
//插件引入
import './plug-ins/particles';
import './plug-ins/ztree/js/jquery.ztree.all.min';
import './plug-ins/ztree/css/zTreeStyle/zTreeStyle.css';
// import imageCropper from 'angular-image-cropper';
import './plug-ins/image-crop/image-crop';
// 控制器
import connectController from './connect.ctrl';
import lookController from './components/look/look-list/lookList';
import linkController from './components/link/link';
import enterModuleController from './components/link/enterModule'
import colleagueController from './components/colleague/colleague';
import wisdomController from './components/wisdom/wisdom';
// 公用指令
import userEdit from './directive/userEdit';
import autographDialog from './directive/autographDialog';
import autographUpload from './directive/autographUpload';
import selectImage from './directive/selectImage';
import ngRightClick from './directive/rightClick';
import changeBg from './directive/changeBg';
import setFocus from './directive/setFocus'
// 模块指令
import lookContent from './components/look/look-content/lookContent.directive';
import autoList from './components/look/look-list/autoList.directive';
import scrollBottom from './components/look/look-content/scrollBottom.directive';
import cavnasParticle from './components/wisdom/canvasParticle.directive';
import colleagueTree from './components/colleague/colleagueTree.directive';
import linkFrame from './components/frame';
// 指令所使用的模板html
import linkSearchHtml from './components/link/linkSearch.html';
import linkGardenHtml from './components/link/linkGarden.html';
import linkModuleHtml from './components/link/linkModule.html';
import linkSceneHtml from './components/link/linkScene.html';
// 服务
import authService from './service/auth.service'
import connectService from './service/connect.service';
import lookMessageService from './service/look.service';
import linkDataService from './service/link.service';
import colleagueService from './service/colleague.service';

//wuh:暂时放到这里，需要找好的解决办法
let linkSearch = () => {
    return {
        restrict: "E",
        replace: true,
        template: linkSearchHtml
    };
};

let linkGarden = () => {
    return {
        restrict: "E",
        replace: true,
        template: linkGardenHtml
    };
};

let linkModule = () => {
    return {
        restrict: "E",
        replace: true,
        template: linkModuleHtml
    };
};

let linkScene = () => {
    return {
        restrict: "E",
        replace: true,
        template: linkSceneHtml
    };
};

export default angular.module('connectModule', [uirouter, 'ngCookies', 'ws', 'ImageCropper'])
    .config(connectRoute)
    //图片插件裁剪用 https://github.com/bcabanes/angular-image-cropper/issues/54
    .config(($compileProvider) => {
        'ngInject';
        $compileProvider.preAssignBindingsEnabled(true);
    })
    .value('dict', {})
    // 控制器
    .controller('connectController', connectController)
    .controller('lookController', lookController)
    .controller('linkController', linkController)
    .controller('colleagueController', colleagueController)
    .controller('wisdomController', wisdomController)
    .controller('enterModuleController', enterModuleController)
    // 服务
    .service('authService', authService)
    .service('connectService', connectService)
    .service('lookMessageService', lookMessageService)
    .service('linkDataService', linkDataService)
    .service('colleagueService', colleagueService)

// 公共指令
.directive('userEdit', userEdit)
    .directive('autographDialog', autographDialog)
    .directive('autographUpload', autographUpload)
    .directive('selectImage', (dialogsManager) => new selectImage(dialogsManager))
    .directive('changeBg', changeBg)
    .directive('ngRightClick', ngRightClick)
    .directive('setFocus', setFocus)
    .directive('linkSearch', linkSearch)
    .directive('linkGarden', linkGarden)
    .directive('linkScene', linkScene)
    .directive('linkModule', linkModule)
    // 模块指令
    .directive('autoList', autoList)
    .directive('linkFrame', ($stateParams, Base64Service, $sessionStorage) => new linkFrame($stateParams, Base64Service, $sessionStorage))
    .directive('lookContent', lookContent)
    .directive('cavnasParticle', cavnasParticle)
    .directive('scrollBottom', scrollBottom)
    .directive('colleagueTree', colleagueTree)
    .name;