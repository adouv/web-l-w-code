/**
 * @Author hejialin
 * @Description 描述
 */

export default class sidebarService {
    constructor(WorkflowInterface, $sessionStorage, $location, $rootScope,lwPermissionService) {
        this.WorkflowInterface = WorkflowInterface;
        this.$sessionStorage = $sessionStorage;
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.currentFlowCount = 0;
        this.lwPermissionService = lwPermissionService;
    }
    /**
     * 获取当前流程数
     */
    getCurrentFlowCount(data){
        let currentFlows = [];
        this.currentFlowCount = 0;
        data.map((item)=>{
            if(item.id.indexOf('config-')>-1){
                this.currentFlowCount++;
                currentFlows.push(item.id.slice(7));
            };
        });
        this.$rootScope.$emit('currentFlowCount', this.currentFlowCount);
        this.$rootScope.currentFlowCount = this.currentFlowCount;
        this.$rootScope.currentFlows = currentFlows;//当前流程id
    }
    /**
     * 获取侧边栏
     * @param moduleId 模块ID
     * @param callback
     */
    getSidebarList(moduleId, processConfigIds, callback) {
        this.getSidebar(moduleId, processConfigIds, data => {
            this.getCurrentFlowCount(data);
            let sortPId = this.sortSidebarList(data);
            callback && callback(sortPId);
        });
    };
 
    getSidebar(moduleId, processConfigIds, callback) {
        let sidebar = this.$sessionStorage.get('sidebar' + moduleId);
        this.$rootScope.currentModule = moduleId;
        if (sidebar && !processConfigIds) {
            callback && callback(sidebar);
        } else if (moduleId || processConfigIds) {
            this.WorkflowInterface.getSidebarList(moduleId, processConfigIds).then(res => {
                let module = this.$location.path().split('/')[1];
                let assetModule = require('./' + module + '.sidebar.json');
                let filterPermissionSidebar = this.filterPermissionSidebar(res.data.concat(assetModule));
                this.$sessionStorage.set('sidebar' + moduleId, filterPermissionSidebar);
                callback && callback(filterPermissionSidebar);
            });
        }
    }

    filterPermissionSidebar(dataList){
        let filterPermissionSidebar = [];
        dataList = dataList||[];
        dataList.forEach((data)=>{
            console.log(this.lwPermissionService.hasPermission(data.permission));
            if(this.lwPermissionService.hasPermission(data.permission)){
                filterPermissionSidebar.push(data);
            }
        })
        return filterPermissionSidebar;
    }

    /**
     * 对侧边栏进行分类
     * @param barlist
     */
    sortSidebarList(barlist) {
        let sortPId = {},
            sortId = {},
            urls = {},
            processConfigId = null,
            stage = null;
        for (let bar of barlist) {
            sortPId[bar.pId] = sortPId[bar.pId] || [];
            sortPId[bar.pId].push(bar);
            sortId[bar.id] = bar;
            if (bar.url) {
                urls[bar.url] = bar;
                let urlsp = bar.url.split('/');
                stage = stage || urlsp[urlsp.length - 1];
                processConfigId = processConfigId || bar.processConfigId;
            }
        }
        return {
            sortPId: sortPId,
            sortId: sortId,
            urls: urls,
            stage: stage,
            processConfigId: processConfigId
        };
    }

    /**
     * 获取面包屑
     * @param sidebarId 侧边栏ID
     * @param callback
     */
    getCrumbList(moduleId, sidebarId, callback) {
        this.getSidebar(moduleId, null, data => {
            let sortPId = this.sortSidebarList(data);
            let crumbList = this.getParentBar(sidebarId, sortPId.sortId, sortPId.sortPId).reverse();
            if (crumbList.length > 0 && crumbList[0].processConfigId !== undefined) {
                crumbList.shift();
            }
            callback && callback(crumbList);
        });
    }

    /**
     *
     * @param processConfigId
     */
    getFirstCrumb(moduleId, sidebarId, callback) {
        this.getSidebar(moduleId, null, data => {
            let crumb = [];
            let sortPId = this.sortSidebarList(data);
            let processConfigId = 'config-' + sortPId.sortId[sidebarId].processConfigId;
            let stages = sortPId.sortPId[processConfigId];
            if (stages && stages.length > 0) {
                crumb.push(stages[0]);
                let items = sortPId.sortPId[stages[0].id];
                if (items && items.length > 0) {
                    stages[0].url = items[0].url;
                    crumb.push(items[0]);
                }
            }
            callback && callback(crumb);
        });
    }

    /**
     * 获取父级侧边栏
     */
    getParentBar(id, sidebar, sortPId) {
        let crumbList = [];
        if (sidebar[id] && !sidebar[id].url) {
            sidebar[id].url = this.handleSidebarUrl(sidebar[id], sortPId);
        }
        if (sidebar[id]) {
            crumbList.push(sidebar[id]);
            if (sidebar[id].pId) {
                crumbList.push(...this.getParentBar(sidebar[id].pId, sidebar, sortPId));
            }
        }
        return crumbList;
    }

    handleSidebarUrl(sidebar, sortPId) {
        if (!sidebar.url) {
            return this.handleSidebarUrl(sortPId[sidebar.id][0], sortPId);
        } else {
            return sidebar.url;
        }
    }

    getFirstStageId(moduleId, processId, callback) {
        this.getSidebar(moduleId, null, data => {
            let sortPId = this.sortSidebarList(data);
            let firstStage = sortPId.sortPId['config-' + processId][0];
            callback && callback(firstStage.id.split('-')[1]);
        });
    }
}

sidebarService.$inject = ['WorkflowInterface', '$sessionStorage', '$location', '$rootScope','lwPermissionService'];
