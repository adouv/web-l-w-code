import angular from 'angular';
export default class Config {
    constructor($config) {
        for(let cfg in $config){
            if(angular.isObject($config[cfg])){
                angular.extend($config[cfg],config[cfg]);
                delete config[cfg];
            }
        }
        angular.extend(this, $config, config)
    }
}
Config.$inject = ['defaultConfig'];
const config = {
    "modules": {
        "IOT": "/lwiot-app",
        "ASSET": "/lwbdp-web",
        "BILL": "/lwbdp-web",
        "REPAIR": "/lwbdp-web",
        "PURCHASE": "/lwbdp-web",
        "LOGISTICS": "/lwbdp-web",
        "BASEINFO": "/lwbdp-web",
        "CONNECTION": "/lw-connect-server",
        "MESSAGE":'/lw-connect-message',
        "ONLINEREPAIR":'/lw-online-repair-web',
        "FILESERVER":"/lw-fileserver"
    },
    "bdp":{
        "isUseExternalForm":false // 是否启用外置表单（默认不启用）
    }
};
