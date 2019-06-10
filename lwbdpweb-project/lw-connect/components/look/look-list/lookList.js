import './look.css'
export default class lookController {
    constructor($state, lookMessageService, $config, $sessionStorage, $location, clientService, Base64Service, authService, cookie) {
        this.$state = $state;
        this.$config = $config;
        this.Base64Service = Base64Service;
        this.clientService = clientService;
        this.$location = $location;
        this.lookMessageService = lookMessageService;
        this.authService = authService;
        this.$sessionStorage = $sessionStorage;
        this.authService.authCookie(this.$state);
        this.init();
    }
    init() {
            this.offset = 0;
            this.timer = null;
            this.getRealTimeData();
            this.getLookList(() => {
                let data = this.list[0];
                if (data) {
                    this.swicthMessageList(0, data.categoryId, data.categoryType);
                }
            });
            this.rightIndex = null;
            this.filePath = this.$config.file.SHOWIMG;
            this.scenesCategoryNum = 5;
            this.modulesCategoryNum = 5;
            this.gardensCategoryNum = 5;
            this.messageList = null;
            this.showResault = true;
            this.showNoMore = '';
        }
        /**
         * 获取实时推送数据
         */
    getRealTimeData() {
            let id = this.$sessionStorage.get('account').accountId;
            this.lookMessageService.realTimePush('index:' + id, (data) => {
                let newItem = data;
                newItem.textLength = this.realLength(newItem.timeView);
                let sameIdx = null,
                    lastTop = null;
                for (let key in this.list) {
                    let item = this.list[key];
                    if (item.categoryId == newItem.categoryId) {
                        sameIdx = Number(key);
                    }
                    if (item.onTop) {
                        lastTop = Number(key);
                    }
                }
                if (sameIdx || sameIdx === 0) {
                    this.list[sameIdx].number += 1;
                    /*if(this.list[sameIdx].active){
                        this.list[sameIdx].number = 0;
                    }*/
                    this.list[sameIdx].messageTitle = newItem.messageTitle;
                    this.list[sameIdx].timeView = newItem.timeView;
                } else {
                    if (newItem.onTop || !lastTop && lastTop !== 0) {
                        this.list.unshift(newItem);
                        return false;
                    }
                    if (lastTop) {
                        let currentIdx = parseInt(lastTop) + 1
                        this.list.splice(currentIdx, 0, newItem);
                    }
                }
            });
        }
        /**
         * 切换消息列表
         * @param {*} index  选中项索引
         * @param {*} id  选中项id
         * @param {*} type 选中项type
         */
    swicthMessageList(index, id, type) {
            for (let items of this.list) {
                items.active = false;
            }
            this.offset = 0;
            this.messageList = null;
            this.searchKeywords = null;
            let item = this.list[index];
            item.active = true;
            // item.number = 0;
            this.enter = false;
            this.messageItem = item;
            this.getMessageList();
            this.getModuleUrl(id, type);
            //消息列表实时推送
            let accountId = this.$sessionStorage.get('account').accountId;
            this.lookMessageService.realTimeMeaasges(
                'unread:' + accountId + ':' + type + ':' + id, data => {
                    if (!this.isSearch && !this.searchKeywords) {
                        this.messageList.push(data);
                    }
                });
        }
        /**
         * 获取模块链接(点击进去用)
         * @param {*} id 
         * @param {*} type 
         */
    getModuleUrl(id, type) {
            this.lookMessageService.getModuleUrl(type, id).then(res => {
                this.messageItem.connectDetailUrl = res.data.connectDetailUrl;
            })
        }
        /**
         * 获取具体消息列表
         */
    getMessageList(num) {
            if (this.messageList && this.messageList.length < 10) {
                return false;
            }
            this.isSearch = this.searchKeywords && this.searchKeywords !== '' ? true : null;
            let id = this.messageItem.categoryId,
                type = this.messageItem.categoryType;
            this.offset = this.messageList ? this.messageList.length : 0;
            this.lookMessageService.getMessageList({
                offset: this.offset,
                size: 10,
                categoryId: id,
                categoryType: type,
                keywords: this.searchKeywords
            }).then(res => {
                this.messageList = this.messageList ? this.messageList.concat(res.data) : res.data;
                this.enter = true;
            })
        }
        /**
         * 获取左侧有未读消息项列表
         */
    getLookList(callback) {
            this.lookMessageService.getLookList().then(res => {
                let list = res.data;
                for (let key in list) {
                    let item = list[key];
                    item.textLength = this.realLength(item.timeView);
                }
                this.list = list;
            }).then(callback)
        }
        /**
         * 添加到左侧未读项列表中(点搜索出的已连接并未在列表中的模块时用)
         * @param {*} item 选中的左侧搜索结果
         */
    addToMessageList(item) {
            // 选中项目后,调取接口更新数据
            let param = {
                categoryId: item.categoryId,
                categoryType: item.categoryType,
                isShow: true
            };
            this.lookMessageService.markOperate(param).then(res => {});
            let selectIdx = null,
                lastTop = null,
                currentIdx = null;
            this.cleanAll();
            for (let key in this.list) {
                let data = this.list[key];
                if (data.categoryId === item.categoryId) {
                    selectIdx = key;
                }
                if (data.onTop) {
                    lastTop = key;
                }
            }
            if (this.list[selectIdx] && this.list[selectIdx].active) {
                return false;
            }
            if (selectIdx && !lastTop) {
                let originItem = this.list[selectIdx];
                this.list.splice(selectIdx, 1);
                this.list.splice(0, 0, originItem);
                currentIdx = 0;
            }
            if (selectIdx && lastTop && selectIdx !== lastTop) {
                let originItem = this.list[selectIdx];
                this.list.splice(selectIdx, 1);
                currentIdx = parseInt(lastTop) + 1;
                this.list.splice(currentIdx, 0, originItem);
            }
            if (!selectIdx && !lastTop) {
                if (item.timeView) {
                    item.textLength = this.realLength(item.timeView);
                }
                this.list.unshift(item);
            }
            if (!selectIdx && lastTop) {
                if (item.timeView) {
                    item.textLength = this.realLength(item.timeView);
                }
                currentIdx = parseInt(lastTop) + 1;
                this.list.splice(currentIdx, 0, item);
            }
            let index = currentIdx ? currentIdx : 0;
            this.swicthMessageList(index, item.categoryId, item.categoryType);
        }
        /**
         * 记录右键选中项
         * @param {*} item 
         * @param {*} index 
         */
    rightClick(item, index) {
            this.showMask = true;
            this.rightIndex = index;
            this.selectItem = item;
        }
        /**
         * 标记为已读
         * @param {*} id 
         * @param {*} type 
         * @param {*} index 
         */
    markAsRead(id, type, index) {
            this.rightIndex = null;
            this.showMask = false;
            this.lookMessageService.markAsRead({
                categoryId: this.selectItem.categoryId,
                categoryType: this.selectItem.categoryType
            }).then(res => {
                // 操作完毕后,更新列表
                this.getLookList();
                this.list[this.rightIndex].number = 0;
            }, res => {

            })
        }
        /**
         * 点击右侧消息列表中任意一项,将其置为已读并进入详情
         * @param {*} item 
         */
    readItem(item) {
            if (!item.isRead) {
                this.lookMessageService.readOneMessage(item.messageGuid).then(res => {
                    item.isRead = true;
                    this.getLookList();
                });
            }
            this.toModule(item.detailUrl);
        }
        /**
         * 标记操作(静音/移除静音/移除)
         * @param {*} operate  操作名
         * @param {*} flag true/false
         */
    markOperate(operate, flag) {
            // 获取右键记录的索引值
            let rightIndex = this.rightIndex;
            this.showMask = false;
            let param = {
                categoryId: this.selectItem.categoryId,
                categoryType: this.selectItem.categoryType
            };
            param[operate] = flag;
            this.lookMessageService.markOperate(param).then(res => {
                if (operate === 'isMute') {
                    this.list[rightIndex].isMute = flag;
                }
                // 操作完毕后,更新列表
                this.getLookList();
            })
        }
        /**
         * 左侧搜索
         */
    stopPropagation($event) {
        $event.stopPropagation();
        if (document.querySelector('.operation')) {
            document.querySelector('.operation').style.display = "none";
        }
        if (document.querySelector('.show-exit')) {
            document.querySelector('.show-exit').style.display = "none";
        }
    }
    searchAll() {
        this.searchData = null;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        let _this = this;
        this.timer = setTimeout(function() {
            if (!_this.keywords || _this.keywords === '') {
                return false;
            }
            _this.lookMessageService.getItemByKeyWord({ keywords: _this.keywords }).then(
                res => {
                    _this.searchData = res.data;
                }
            )
        }, 500)
    }
    searchKeyUp($event) {

    }

    /**
     * 左侧清空
     */
    cleanResaults() {
        this.scenesCategoryNum = 5;
        this.modulesCategoryNum = 5;
        this.gardensCategoryNum = 5;
        this.searchData = null;
    }
    cleanAll() {
            this.keywords = null;
            this.cleanResaults();
        }
        /**
         * 搜索结果显示更多
         * @param {*} name 类型名称 (场景/园区/模块)
         * @param {*} isDown true显示更多,false收起
         */
    showMore($event, name, isDown) {
            let dataList = angular.copy(this.searchData);
            this.searchData = null;
            this[name + 'Num'] = isDown ? dataList[name].length : 5;
            this.searchData = dataList;
        }
        /**
         * 右侧消息列表搜搜
         */
    searchMessageList() {
            this.messageList = null;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            let _this = this;
            this.timer = setTimeout(function() {
                _this.offset = 0;
                _this.getMessageList(true);
            }, 200)
        }
        /**
         * 清空右侧搜索关键字与结果
         */
    cleanAllKeywords() {
            this.searchKeywords = null;
            this.messageList = null;
            this.getMessageList();
        }
        /**
         * 进入具体模块
         * @param {*} url 模块链接
         */
    toModule(url, isModule) {
            let allPath = this.$location.absUrl(),
                path = this.$location.path();
            let toPath = url.indexOf('http') > -1 ? url : allPath.replace(path, '') + url;
            if (url.startsWith('http')) {
                let urlCode = this.Base64Service.encode(url);
                window.openWindow(allPath.replace(path, '') + '/frame/' + urlCode)
            } else if (isModule) {
                window.openWindow(toPath)
            } else {
                window.openWindow(toPath + '?isDetails=1');
            }
        }
        /**在当前页面加载内容  TODO
         * @param {*} state 
         * @param {*} id 
         */
    loadModule(state, id) {
        this.$state.go("bill.projectcapital.detail", { type: 1, batchNo: '20170606152247473807403034904615' })
    }
    realLength(str) {
        if (str) {
            let timeLength = str.replace(/[^\x00-\xff]/g, "**").length * 6;
            let textLength = 175 - 10 - timeLength;
            return textLength;
        }
    }
}
lookController.$inject = ['$state', 'lookMessageService', '$config', '$sessionStorage', '$location', 'clientService', 'Base64Service', 'authService', 'cookie']