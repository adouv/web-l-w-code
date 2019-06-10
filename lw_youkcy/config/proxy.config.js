// module.exports = {
//   proxyList: {
//     '/lw-authz-server': {
//       // 接口的域名
//       target: 'http://tpktest.laiweitec.com:8084',
//       // 如果是https接口，需要配置这个参数
//       secure: false,
//       // 如果接口跨域，需要进行这个参数配置
//       changeOrigin: true,
//       pathRewrite: {
//         '^/lw-authz-server': '/'
//       }
//     }
//   }
// }
module.exports = {
  proxyList: {
      '/lwtpk-web': {
          target: 'http://10.0.0.6:8081',
          changeOrigin: true,
          pathRewrite: {
              '^/lwtpk-web': '/lwtpk-web'
          },
          headers: {
              referer: "http://10.0.0.6:8081"
          }
      },
      '/lw-garden-server': {
          target: 'http://10.0.0.84:8083',
          changeOrigin: true,
          pathRewrite: {
              '^/lw-garden-server': '/lw-garden-server'
          },
          headers: {
              referer: "http://10.0.0.84:8083"
          }
      },
      '/lw-authz-server': {
          target: 'http://10.0.0.84:8084',
          changeOrigin: true,
          pathRewrite: {
              '^/lw-authz-server': '/lw-authz-server'
          },
          headers: {
              referer: "http://10.0.0.84:8084"
          }
      },
      '/lw-class-interaction': {
          target: 'http://10.0.0.6:8083',
          changeOrigin: true,
          pathRewrite: {
              '^/lw-class-interaction': '/lw-class-interaction'
          },
          headers: {
              referer: "http://10.0.0.6:8083"
          }
      }
  }
}


// module.exports = {
//   proxyList: {
//       '/lwtpk-web': {
//           target: 'http://10.0.0.6:8081',
//           changeOrigin: true,
//           pathRewrite: {
//               '^/lwtpk-web': '/lwtpk-web'
//           },
//           headers: {
//               referer: "http://10.0.0.6:8081"
//           }
//       },
//       '/lw-garden-server': {
//           target: 'http://10.0.0.84:8083',
//           changeOrigin: true,
//           pathRewrite: {
//               '^/lw-garden-server': '/lw-garden-server'
//           },
//           headers: {
//               referer: "http://10.0.0.84:8083"
//           }
//       },
//       '/lw-authz-server': {
//           target: 'http://10.0.0.84:8084',
//           changeOrigin: true,
//           pathRewrite: {
//               '^/lw-authz-server': '/lw-authz-server'
//           },
//           headers: {
//               referer: "http://10.0.0.84:8084"
//           }
//       }
//   }
// }

