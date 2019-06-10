module.exports = {
  proxyList: {
    '/lw-authz-server': {
      // 接口的域名
      target: 'http://tpktest.laiweitec.com:8084',
      // 如果是https接口，需要配置这个参数
      secure: false,
      // 如果接口跨域，需要进行这个参数配置
      changeOrigin: true,
      pathRewrite: {
        '^/lw-authz-server': '/'
      }
    }
  }
}

// {
//   "/lw-website-cms": {
//     "target": "http://222.249.224.116:8082",
//     "secure": false,
//     "changeOrigin": true
//   },
//   "/lw-authz-server": {
//     "target": "http://10.0.0.84:8084",
//     "secure": false,
//     "changeOrigin": true
//   },
//   "/lw-garden-server": {
//     "target": "http://10.0.0.84:8083",
//     "secure": false
//   },
//   "/lw-fileserver": {
//     "target": "http://10.0.0.10:96",
//     "secure": false
//   },
//   "/lw-class-interaction": {
//     "target": "http://10.0.0.6:8083",
//     "secure": false,
//     "changeOrigin": true
//   },
//   "/lwtpk-web": {
//     "target": "http://10.0.0.6:8080",
//     "secure": false,
//     "changeOrigin": true
//   }
// }
