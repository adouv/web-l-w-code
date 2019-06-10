import angular from 'angular';
import OAuth2Factory from './oauth2.service';
import OAuth2Interceptor from './oauth2.interceptor';
import OAuth2TokenFactory from './oauth2Token.service';
import Config from '../config/app.config';
console.log(Config)

export default angular.module('lw.oauth2', [Config])
    .service('OAuth2Token',OAuth2TokenFactory)
    .service('OAuth2',OAuth2Factory)
    .factory('OAuth2Interceptor',OAuth2Interceptor)
    .config($httpProvider => {
        $httpProvider.interceptors.push('OAuth2Interceptor');
    }).name;