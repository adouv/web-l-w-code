import './styles/base.css';
import './styles/common.css';
import './styles/iconfont.css';
import './styles/query.css';


// 路由
import queryRouter from './routes';

//控制器
import queryHomeCtrl from './components/query-home';
import queryDetailCtrl from './components/query-detail';


class queryCtrl {
    constructor() {}
}
queryCtrl.$inject = ['sidebarService', '$scope', '$state'];

export default angular.module('queryModule',[require('angular-sanitize')])
    .config(queryRouter)
    .controller('queryCtrl', queryCtrl)
    .controller('queryHomeCtrl', queryHomeCtrl)
    .controller('queryDetailCtrl', queryDetailCtrl)
    .name