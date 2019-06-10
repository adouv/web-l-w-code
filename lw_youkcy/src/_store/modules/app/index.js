import Cookies from 'js-cookie'
import getters from './getter'
import mutations from './mutation'
import actions from './action'

const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    },
    getters: getters,
    mutations: mutations,
    actions: actions
};

export default app;