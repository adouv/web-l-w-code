import getters from './getter'
import mutations from './mutation'
import actions from './action'
import { getToken } from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: []
    },
    getters: getters,
    mutations: mutations,
    actions: actions
};

export default user;