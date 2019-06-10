import Vue from 'vue'
import MutationType from "./mutation-type"
/**
 * actions 异步操作、多个commit时
 * 和mutations类似。不过actions支持异步操作。
 * 第一个参数默认是和store具有相同参数属性的对象。外部调用方式：store.dispatch('nameAsyn')。
 */
export default {
    onListAsyn: ({ commit }, item) => {
        commit(MutationType.SET_ON_LIST, item);
    },
    clearOnListAsyn: ({ commit }) => {
        commit(MutationType.SET_CLEAR_ON_LIST);
    },
    deleteOnListAsyn: ({ commit }, item) => {
        commit(MutationType.SET_DELETE_ON_LIST, item);
    },
    personListAsyn: ({ commit }, item) => {
        commit(MutationType.SET_PERSONLIST, item);
    },
    clearPersonListAsyn: ({ commit }) => {
        commit(MutationType.SET_PERSONLIST);
    },
    nameAsyn: ({ commit }, { age, name }) => {
        commit(MutationType.SET_NAME, name)
        commit(MutationType.SET_AGE, age)
    },
    sidebarListAsyn: ({ commit }) => {
        let config = {}

        config.baseURL = ''

        Vue.http.get('/static/data/sidebarList.json', config).then(response => {
            commit(MutationType.SET_SIDEBAR, response)
        })
    },
    winListAsync: ({ commit }, { item }) => {
        commit(MutationType.SET_WINLIST, item);
    }
}