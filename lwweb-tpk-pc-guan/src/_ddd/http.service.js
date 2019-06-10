import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'

let isTimeout = false
    /** 
     * 超时
     */
axios.defaults.timeout = 1000000

axios.defaults.baseURL = ``

axios.defaults.retry = 4

axios.defaults.retryDelay = 1000

/** 
 * 请求拦截
 */
axios.interceptors.request.use(
        config => {
            if (Vue.local.getItem('lwToken') !== undefined) {
                config.headers.Token = `${Vue.local.getItem('lwToken')}`
            }

            if (config.method === 'post' || config.method === 'put') {
                config.transformRequest = [function(data, header) {
                    data = Qs.stringify(data)
                    return data
                }];
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
            switch (error.status) {
                case 401:
                    Vue.$message.error("登录超时");
                    // Vue.local.removeItem('lwToken')
                    // Vue.tip('登陆超时,即将跳转登录页面...', () => {
                    //     window.location.href = '/login'
                    // }, 2500)
                    break;
                case 403:
                case 400:
                default:
                    Vue.$message.error(error.data.Message);
            }
        }
        return Promise.reject(error)
    }
)

let HttpService = axios

export default HttpService