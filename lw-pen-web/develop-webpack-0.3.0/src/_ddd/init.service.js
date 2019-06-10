import ddd from './index'
import {
    filterService
} from '../_filters'
import {
    ComponentService
} from '../components'
import {
    DirectiveService
} from '../_directives/'
import {
    Button,
    Select,
    DatePicker,
    Input,
    Layout,
    Tabs,
    Collapse,
    message,
    notification,
    Spin,
    Radio,
    Pagination,
    Checkbox,
    Tree,
    Tooltip,
    Modal,
    Table,
    InputNumber
} from 'ant-design-vue'
import '../assets/icon-font/iconfont.css'
import '../../node_modules/flex.css/dist/flex.css'
/**
 * 主入口
 * @param {*} Vue 
 */

export const VueInit = (Vue) => {
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(DatePicker);
    Vue.use(Input);
    Vue.use(Layout);
    Vue.use(Tabs);
    Vue.use(Collapse);
    Vue.use(Spin);
    Vue.use(Radio);
    Vue.use(Pagination);
    Vue.use(Checkbox);
    Vue.use(Tree);
    Vue.use(Tooltip);
    Vue.use(Modal);
    Vue.use(Table);
    Vue.use(InputNumber);

    Vue.http = Vue.prototype.http$ = ddd.HttpService;
    Vue.local = Vue.prototype.local$ = ddd.LocalStorageService;
    Vue.udp = Vue.prototype.udp$ = ddd.UdpService;
    Vue.win = Vue.prototype.win$ = ddd.WindowService;
    Vue.utils = Vue.prototype.utils$ = ddd.UtilService;
    Vue.db = Vue.prototype.db$ = ddd.DataSourceservice.nedb;
    // Vue.consumer = Vue.prototype.consumer$ = ddd.DataSourceservice.consumer;
    Vue.mdb = Vue.prototype.mdb$ = ddd.DataSourceservice.mongodb;
    Vue.sql = Vue.prototype.sql$ = ddd.SqlService;
    Vue.msql = Vue.prototype.msql$ = ddd.MsqlService;
    Vue.encrypt = Vue.prototype.encrypt$ = ddd.EncryptService;
    // Vue.kfk = Vue.prototype.kfk$ = ddd.KafkaService;

    Vue.message = message;
    Vue.prototype.$message = message;
    Vue.notification = notification;
    Vue.prototype.$notification = notification;

    //过滤器
    filterService(Vue);
    //组件
    ComponentService(Vue);
    //指令
    DirectiveService(Vue);
}