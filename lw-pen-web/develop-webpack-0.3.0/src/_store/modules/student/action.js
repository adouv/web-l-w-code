import Vue from 'vue'
import Type from './mutation-type'
import ddd from '../../../_ddd/utils.service'

export default {
  getList({ commit }, { params }) {
    let list = [];
    let config = {};
    config.params = params;

    Vue.http.get(`${process.env.lwClassInteraction}/lw-class-interaction/exercise/answer-record/status`, config).then(response => {
      response.forEach(element => {
        let item = {
          answer: element.answer,
          exerciseRecordId: element.exerciseRecordId,
          gardenId: element.gardenId,
          gender: element.gender,
          id: element.id,
          imgUrl: element.imgUrl,
          isRight: element.isRight,
          questionId: element.questionId,
          score: element.score,
          studentId: element.studentId,
          studentName: element.studentName,
          type: element.type,
          useTime: element.useTime,
          status: 0,
          show: false
        };

        if (item.gender === null) {
          item.gender = 0;
        }
        if(item.imgUrl){
          item.imgUrl = ddd.showImg(item.imgUrl);
        }
        if (item.imgUrl === null) {
          switch (item.gender) {
            case 0:
              item.imgUrl = require('../../../assets/images/nv.png');
              break;
            case 1:
              item.imgUrl = require('../../../assets/images/na.png');
              break;
          }
        }
        list.push(item);
      });
      commit(Type.STUDENT_LIST, list);
    });
  },
  setShow({ commit }, { params }) {
    commit(Type.SET_SHOW, params);
  },
  setStatus({ commit }, { params }) {
    commit(Type.SET_STATUS, params);
  },
  getSubmit({ commit }, { params }) {
    commit(Type.GET_SUBMIT, params);
  },
  getNoSubmit({ commit }, { params }) {
    commit(Type.GET_NO_SUBMIT, params);
  },
  getOperation({ commit }, { params }) {
    commit(Type.GET_OPERATION, params);
  },
  setType({ commit }, { params }) {
    let config = {};
    config.params = params;
    Vue.http.get(`${process.env.lwClassInteraction}/lw-class-interaction/exercise/answer-record/status`, config).then(response => {
      commit(Type.SET_TYPE, response);
    });
  },
  setUdpList({commit},{params}){
    commit(Type.SET_UDP_LIST,params);
  }
}
