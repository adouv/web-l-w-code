export default class OAuth2TokenFactory{
    constructor($sessionStorage){
        this.$sessionStorage = $sessionStorage;
    }

    setToken(data) {
        sessionStorage.setItem('TOKEN',data.access_token);
        sessionStorage.setItem('token',JSON.stringify(data));
    }

    getAccessToken() {
        return sessionStorage.getItem('TOKEN')||'';
    }

    getRefreshToken() {
        const token = sessionStorage.getItem('token')||'';
        return JSON.parse(token).refresh_token;
    }

    removeAccessToken() {
        sessionStorage.removeItem('token');
    }
}
OAuth2TokenFactory.$inject = ['$sessionStorage'];