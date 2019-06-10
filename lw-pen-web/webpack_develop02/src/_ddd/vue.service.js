import ddd from './index'
import components from '../components'
import directives from '../_directives/'
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
import moment from 'moment'


export default {
  init(Vue) {
    Vue.http = Vue.prototype.http$ = ddd.HttpService
    Vue.local = Vue.prototype.local$ = ddd.LocalStorageService
    Vue.udp = Vue.prototype.udp$ = ddd.UdpService
    Vue.win = Vue.prototype.win$ = ddd.WindowService
    Vue.utils = Vue.prototype.utils$ = ddd.UtilService
    Vue.sql = Vue.prototype.sql$ = ddd.SqlService
    Vue.encrypt = Vue.prototype.encrypt$ = ddd.EncryptService

    Vue.message = message;
    Vue.prototype.$message = message
    Vue.notification = notification
    Vue.prototype.$notification = notification


    Vue.filter('dateformats', function (dataStr, pattern = 'YYYY/MM/DD HH:mm:ss') {
      return moment(dataStr).format(pattern)
    })

    Vue.filter('exerciseTime', function (value) {
      return (value + "").length < 2 ? "0" + value : value;
    })

    Vue.filter('formatSeconds', function (data) {
      return ddd.UtilService.fromatDate(data);
    })
    Vue.filter('toPrecision', function (data) {
      return parseFloat((data * 100).toPrecision(12)) + "%";
    })
    Vue.filter('toRightAnswer', function (data) {
      return ddd.UtilService.toRightAnswer(data);
    })

    Vue.use(Button)
    Vue.use(Select)
    Vue.use(DatePicker)
    Vue.use(Input)
    Vue.use(Layout)
    Vue.use(Tabs)
    Vue.use(Collapse)
    Vue.use(Spin)
    Vue.use(Radio)
    Vue.use(Pagination)
    Vue.use(Checkbox)
    Vue.use(Tree)
    Vue.use(Tooltip)
    Vue.use(Modal)
    Vue.use(Table)
    Vue.use(InputNumber)
    //自定义公共组件
    components.init(Vue)
    directives.LoadDirectives();
  }
}
