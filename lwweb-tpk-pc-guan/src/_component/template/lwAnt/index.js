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
    Switch
} from 'ant-design-vue'
/**
 * ant组件
 */
export const lwAntInstall = (Vue) => {
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
    Vue.use(Switch);
    Vue.use(InputNumber);

    Vue.message = message;
    Vue.prototype.$message = message;
    Vue.notification = notification;
    Vue.prototype.$notification = notification;
}