'use strict'
/**
 * @Author hejialin
 * @Description 使用浏览器 sessionStorage和localStorage 进行缓存操作
 */
import Base64Service from './base64.service';

class $sessionStorage{
    constructor($window,Base64Service){
        this.session = $window.sessionStorage;
        this.Base64 = Base64Service;
    }
    
    set(key,data){
        if(key){
            // key = this.Base64.encode(key);
            // data = data?this.Base64.encode(JSON.stringify(data)):data;
            sessionStorage.setItem(key,data);
        }
    }
    
    get(key){
        // key = this.Base64.encode(key);
        let data = sessionStorage.getItem(key);
        // data = data?this.Base64.decode(data):data;
        return JSON.parse(data);
    }
    
    remove(key){
        // let base64key = this.Base64.encode(key);
        sessionStorage.removeItem(key);
    }

    clear(){
        this.session.clear();
    }
}

$sessionStorage.$inject = ['$window','Base64Service'];

class $localStorage{
    constructor($window,Base64Service){
        this.local = $window.localStorage;
        this.Base64 = Base64Service;
    }

    set(key,data){
        if(key){
            key = this.Base64.encode(key);
            data = data?this.Base64.encode(data):'';
            this.local.setItem(key,data);
        }
    }

    get(key){
        key = this.Base64.encode(key);
        let data = this.local.getItem(key);
        return data?this.Base64.decode(data):data;
    }

    remove(key){
        let base64key = this.Base64.encode(key);
        this.local.removeItem(base64key);
    }

    clear(){
        this.local.clear();
    }
}

$localStorage.$inject = ['$window','Base64Service'];

export default angular.module('lw.cache',[])
    .service('Base64Service',Base64Service)
    .service('$sessionStorage',$sessionStorage)
    .service('$localStorage',$localStorage)
    .name;