import request from '@/utils/request'


export function getSchoolYear(params) {
    return request({
      url: '/academic/date',
      method: 'get',
      params
    })
  }