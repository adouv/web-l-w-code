import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'

/** 
 * 超时
 */
axios.defaults.timeout = 5000

axios.defaults.baseURL = ''

axios.defaults.retry = 4

axios.defaults.retryDelay = 1000

axios.interceptors.request.use(
        config => {
            let token = Vue.local.getItem('LWToken');

            if (token !== undefined && token !== null && token) {
                config.headers['TOKEN'] = Vue.local.getItem('LWToken')
            }

            if (!config.uploader) {
                if (config.method === 'post' || config.method === 'put') {
                    config.transformRequest = [function(data, header) {
                        data = Qs.stringify(data)
                        return data
                    }];
                }
            }

            return config
        },
        error => {
            return Promise.reject(error)
        }
    )
    /** 
     * 响应拦截
     */
axios.interceptors.response.use(
    response => {
        if (response.headers['x-record-count'] !== undefined) {
            response.data['xRecordCount'] = response.headers['x-record-count']
        }
        return response.data
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    //token失效验证
                    console.error('token失效了')
                    Vue.local.clearLocal()
                    Vue.win.send('login', false);
                    break
            }
        }
        console.log(error)
        return Promise.reject(error)
    }
)

let HttpService = axios


export default HttpService