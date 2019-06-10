import Type from './mutation-type'

export default {
  [Type.STUDENT_LIST]: (state, response) => {
    state.studentList = response;
  },
  [Type.SET_SHOW]: (state, params) => {
    let i = 0;
    state.studentList.forEach(element => {
      if (element.studentId === params.penid) {
        state.studentList[i].show = params.show;
      }
      i++;
    });
  },
  [Type.SET_STATUS]: (state, params) => {
    let i = 0;
    state.studentList.forEach(element => {
      if (element.studentId === params.penid) {
        state.studentList[i].status = params.status;
      }
      i++;
    });
  },
  [Type.GET_SUBMIT]: (state, params) => {
    state.submitCount = 0;
    state.studentList.forEach(element => {
      if (element.type === 1) {
        state.submitCount++;
      }
    });
  },
  [Type.GET_NO_SUBMIT]: (state, params) => {
    state.noSubmitCount = 0;
    state.studentList.forEach(element => {
      if (element.type === 0) {
        state.noSubmitCount++;
      }
    });
  },
  [Type.GET_OPERATION]: (state, params) => {
    state.operationCount = 0;
    state.studentList.forEach(element => {
      if (element.status === 1) {
        state.operationCount++;
      }
    });
  },
  [Type.SET_TYPE]: (state, response) => {
    let i = 0;
    state.studentList.forEach(element => {
      let find = response.find(i => i.studentId === element.studentId);
      if (find !== undefined) {
        state.studentList[i].type = find.type;
      }
      i++;
    });
  },
  [Type.SET_UDP_LIST]: (state, params) => {
    state.udpList.push(params);
  }
}
