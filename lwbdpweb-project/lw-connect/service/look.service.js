export default class lookMessageService {
    constructor(DaoService, $config, ws, $location) {
        this.DaoService = DaoService;
        this.$location = $location;
        this.modules = $config.modules;
        this.HOST = $config.HOST;
        this.ws = ws;
    }

    /**
     * websocket 实时推送
     */
    realTimePush(json, callback) {
        if(this.wsrs){
            this.wsrs = null;
            this.ws.close();
        }
        let host = this.$location.host(), port = this.$location.port();
        this.wsrs = this.ws.connect({
            url: 'ws://' + (this.HOST || (host + ':' + port)) + this.modules.MESSAGE + '/message'
        }).then(res => {
        });
        this.ws.send(json);
        this.ws.on('message', function (message) {
            callback(JSON.parse(message.data))
        });
    }

    realTimeMeaasges(json, callback) {
        let host = this.$location.host(), port = this.$location.port();
        this.wsrs = this.ws.connect({
            url: 'ws://' + (this.HOST || (host + ':' + port)) + this.modules.MESSAGE + '/message'
        }).then(res => {
        });
        this.ws.send(json);
        this.ws.on('message', function (message) {
            callback(JSON.parse(message.data))
        });
    }

    /**
     * 获取看消息列表
     */
    getLookList() {
        return this.DaoService.get(this.modules.CONNECTION, '/categoryAccount/index')
    }

    /**
     * 模块消息集体标记为已读
     */
    markAsRead(param) {
        return this.DaoService.delete(this.modules.CONNECTION, '/messageAccount', param)
    }

    /**
     * 单条消息标记为已读
     */
    readOneMessage(messageGuid) {
        return this.DaoService.delete(this.modules.CONNECTION, '/messageAccount/' + messageGuid);
    }

    /**
     * 静音,删除
     */
    markOperate(param) {
        return this.DaoService.put(this.modules.CONNECTION, '/categoryAccount', param)
    }

    /**
     * 获取未读消息列表
     *
     */
    getMessageList(param) {
        return this.DaoService.get(this.modules.CONNECTION, '/messageAccount', param)
    }

    /**
     * 根据关键字查询已连接
     */
    getItemByKeyWord(param) {
        return this.DaoService.get(this.modules.CONNECTION, '/categoryAccount', param)
    }

    /**
     * 获取模块链接
     */
    getModuleUrl(type, id) {
        return this.DaoService.get(this.modules.CONNECTION, '/category/' + type + '/' + id)
    }
}
lookMessageService.$inject = ['DaoService', '$config', 'ws', '$location'];