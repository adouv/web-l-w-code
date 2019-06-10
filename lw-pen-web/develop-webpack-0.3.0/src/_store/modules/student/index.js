import getters from './getter'
import mutations from './mutation'
import actions from './action'

const studentModule = {
  state: {
    udpList: [],
    studentList: [],
    submitCount: 0,
    noSubmitCount: 0,
    operationCount: 0
  },
  getters: getters,
  mutations: mutations,
  actions: actions
};

export default studentModule;
