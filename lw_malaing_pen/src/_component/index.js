import { LwSelectNameInstall } from './lwSelectName';
import { LwModalInstall } from './lwModal/index.js'
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
    InputNumber,
    Form
} from 'ant-design-vue'
/**
 * 组件总入口
 * @param {*} Vue 实例
 */
export const ComponentInit = (Vue) => {
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
    // Vue.use(Form)

    Vue.message = message
    Vue.prototype.$message = message
    Vue.notification = notification
    Vue.prototype.$notification = notification
    Vue.prototype.$form = Form

    LwSelectNameInstall(Vue);
    LwModalInstall(Vue);
}