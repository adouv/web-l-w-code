import angular from 'angular';
export default class Config {
    constructor($config) {
        this.$config = $config;
        this.paramsInit();
    }
    
    paramsInit(){
        for(let cfg in this.$config){
            if(angular.isObject(this.$config[cfg])){
                angular.extend(this.$config[cfg],config[cfg]);
                delete config[cfg];
            }
        }
        angular.extend(this, this.$config, config)
        
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
        "GARDEN": "/lw-garden-server",
        "ONLINEREPAIR":'/lw-online-repair-web',
        "CONNECTION": "/lw-connect-server"
    },
    "bdp":{
        "isUseExternalForm":false // 是否启用外置表单（默认不启用）
    }
};
