import Vue from 'vue'
import Vuex from "vuex"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

import createLogger from "vuex/dist/logger"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        logo: 'adou'
    },
    getters,
    mutations,
    actions,
    modules: {

    },
    plugins: debug ? [createLogger()] : []
});