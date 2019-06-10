import Vue from 'vue'
import axios from 'axios'

let isTimeout = false
    /**
     * 超时
     */
axios.defaults.timeout = 5000

axios.defaults.baseURL = ''

axios.defaults.retry = 4

axios.defaults.retryDelay = 1000

/**
 * 请求拦截
 */
axios.interceptors.request.use(
        config => {
            if (Vue.local.getItem('tdToken') !== undefined) {
                config.headers.Token = Vue.local.getItem('tdToken')
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
        if (response.config.baseURL && response.config.baseURL !== "") {
            let {
                Data,
                Message,
                StatusCode
            } = response.data;
            if (StatusCode === 200 && Message === null && Data) {
                return response.data;
            } else {
                return null;
            }
        } else {
            if (response.config.url.split('.').includes('weixin')) {
                return response.data;
            } else {
                return null;
            }
        }
    },
    error => {
        if (error.response) {
            let {
                config,
                data,
                headers,
                request,
                status,
                statusText
            } = error.response
            ResponseStatus(status, data.Message)
        }
        return Promise.reject(error)
    }
)

/** 
 * 响应状态拦截
 */
let ResponseStatus = (status, message) => {
    let tdStatus = Vue.local.getItem("tdStatus");
    console.log('tdStatus:', tdStatus);
    switch (status) {
        case 401:
            Vue.cookies.remove("tdCookie");
            Object.keys(window.localStorage).forEach(storage => {
                if (storage !== "tdUser" || storage !== "tdType") {
                    Vue.local.removeItem(storage)
                }
            });
            Vue.toast('登录超时');
            setTimeout(() => {
                window.location.href = '/'
            }, 1000);
            break;
        case 403:
        case 400:
        default:
            Vue.toast(message);
            break;
    }
    Vue.indicator.close();
}

let HttpService = axios

export default HttpService