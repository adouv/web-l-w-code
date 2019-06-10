module.exports = {
    proxyList: {
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
        '/lw-class-interaction': {
            target: 'http://10.0.0.84:8090',
            changeOrigin: true,
            pathRewrite: {
                '^/lw-class-interaction': '/lw-class-interaction'
            },
            headers: {
                referer: "http://10.0.0.84:8090"
            }
        }

    }
}