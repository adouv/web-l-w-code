export default function OAuth2Interceptor($rootScope,OAuth2Token,$location,$q){
    this.$rootScope = $rootScope;
    this.OAuth2Token = OAuth2Token;
    this.$location = $location;
    this.$q = $q;
    let respException = {
        params:(resp)=>{
            let respData = resp.data;
            switch (resp.data.error) {
                case 'invalid_grant':
                    resp.data.className = 'warning';
                    resp.data.error_description = '用户名或密码错误！';
                    break;
                case 'invalid_client':
                    resp.data.className = 'warning';
                    resp.data.error_description = '当前系统不受信任！';
                    break;
                default:
                    resp.data.className = 'warning';
            }
        },
        token:(resp)=>{
            let respData = resp.data;
            switch (resp.data.error) {
                case 'invalid_token'://token错误
                    resp.data.className = 'warning';
                    resp.data.error_description = '登录异常，请重新登录！';
                    $location.path('/login');
                    break;
                case 'expired_token'://token失效
                    break;
            }
        },
        permission:(resp)=>{
            if(resp.data.error){
                resp.data.className = 'warning';
                resp.data.error_description = '您没有相关权限！';
            }
        }
    };
    
    return{
        request:(config) => {
            if(!/(\.html|\.json|\/oauth\/token)$/.test(config.url)){
                config.headers = config.headers || {};
                let token = this.OAuth2Token.getAccessToken();
                if(token){
                    config.headers.TOKEN = token;
                }else{
                    if(this.$location.$$path.indexOf('/login')<0){
                        this.$rootScope.cacheUrl = this.$location.$$path;
                    }
                    this.$location.path('/login');
                }
            }
            return config;
        },
        responseError:(resp) => {
            switch (resp.status) {
                case 401:
                    respException.token(resp);
                    break;
                case 403:
                    respException.permission(resp);
                    break;
                case 422:
                    respException.params(resp);
                    break;
                case 400:
                    respException.params(resp);
                    break;
                default:
                    resp.data.error_description = '系统异常，请联系管理员！';
            }
            return this.$q.reject(resp);
        },
        response:(response) => {
            return response;
        }
    }
};
OAuth2Interceptor.$inject = ['$rootScope','OAuth2Token','$location','$q']