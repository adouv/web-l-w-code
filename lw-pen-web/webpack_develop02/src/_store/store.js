import Vue from 'vue'
import Vuex from "vuex"
import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"
import studentModule from './modules/student';
import createLogger from "vuex/dist/logger"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    student: studentModule
  }
  //plugins: debug ? [createLogger()] : []
})
