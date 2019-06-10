import './sidebar.css';

export default function slideBarDirective($location, $rootScope, $compile, sidebarService, $state, $sessionStorage, ngDialog, ProjectInterface) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            whiteList: '=',
            data: '=',
            noSidebar: '@'
        },
        template: require('./index.html'),
        link($scope, element, attrs) {
            /* 
             *监测当前流程数量
             */
            $scope.currentFlowCount = $rootScope.currentFlowCount;
            $rootScope.$on('currentFlowCount', (evt, msg) => {
                $scope.currentFlowCount = sidebarService.currentFlowCount;

            })

            /**
             * 获取当前所有待办任务数
             */
            let currentModule = $rootScope.currentModule || 'bill';
            ProjectInterface.getAllTodoTaskCount(currentModule).then(res => {
                $scope.totalItems = res.data;
            })
            /*
             * 监听数据 存在时则初始化侧边栏
             * */
            if (!$scope.noSidebar) {
                $scope.$watch('data', () => {
                    initSidebar(element.children().eq(1).children().eq(0).children().eq(0));
                });
            }
            /**
             * 初始化侧边栏
             * @param elem
             */
            let initSidebar = (elem) => {
                $scope.stage = null;
                $scope.activePIds = ['0'];
                $scope.processConfigId = null;
                if ($scope.data) {
                    let html = buildSidebar(0, $scope.data);
                    elem.children().eq(1).append($compile(html)($scope));
                    // 移除当前侧边栏
                    if (elem.children().children().length != 2) {
                        elem.children()[1].removeChild(elem.children().children()[1])
                    }
                    controlSidebar($scope.data.urls, $scope.data);
                    toggleEvent(elem, $scope.data);
                }
            };

            /**
             * 构建侧边栏
             * @param id
             * @param sidebar
             * @return {string}
             */
            let buildSidebar = (id, data) => {
                let sidebar = data.sortPId;
                let html = '<ul class="side-wrap" ng-class="{\'none\':activePIds.indexOf(\'' + id + '\')<0}">';
                let url = $location.path();
                if (url.split('/').length === 2) {
                    if (data.processConfigId) {
                        url = url + '/apply/' + data.processConfigId + '/' + data.stage;
                    } else {
                        url = url + '/all';
                    }
                }
                if(sidebar[id]){
                    for (let bar of sidebar[id]) {
                        let isActive = bar.url && url.indexOf(bar.url) > -1;
                        if (isActive) {
                            $scope.sidebarId = bar.id;
                            $scope.isActiveId = bar.id;
                            getActivePIds(bar.id, data.sortId);
                        }
                        bar.url = bar.url ? bar.url.replace(/:processConfigId/, data.processConfigId) : '';
                        html += `<li><a class="atitle" has-permission="${bar.permission}" ng-class="{'cur':isActiveId=='${bar.id}'}" ng-click="goPath('${bar.url}')" href="javascript:void(0);" data-sid="${bar.id}" data-has-page="${!!bar.hasPage}" title="${bar.name}">`;
                        html += `<i class="iconfont icon-bar" ng-class="{'rotate':activePIds.indexOf('${bar.id}')>-1}">${bar.icon || '&#xe822;'}</i>`;
                        html += `<span class="sidebar-name">${bar.name}</span></a>`;
                        if (sidebar[bar.id]) {
                            html += buildSidebar(bar.id, data);
                        }
                        html += '</li>';
                    }
                }
                html += '</ul>';
                return html;
            };

            /**
             * 获取选中栏的父ID
             * @param id
             * @param sortId
             */
            let getActivePIds = (id, sortId) => {
                if (sortId[id] && sortId[id].pId) {
                    $scope.activePIds.push(sortId[id].pId);
                    getActivePIds(sortId[id].pId, sortId);
                }
            };

            $scope.goPath = (url) => {
                if (url) {
                    if (url != $location.path()) {
                        $location.path(url);
                    } else {
                        // $state.reload();
                        $state.go($state.current, $state.params, {
                            reload: true
                        });
                    }
                }
            };

            $scope.goModule = (name) => {
                if ($scope.currentTab != name) {
                    $state.go(name);
                }
            }

            /**
             * 侧边栏显示隐藏切换事件
             * @param elem
             */
            let toggleEvent = (elem, data) => {
                elem.on('click', (e) => {
                    e = e || window.event;
                    let target = e.target || e.srcElement;
                    let atitles = angular.element(document.querySelectorAll('.atitle'));
                    if (target.nodeName == 'A') {
                        controlStyle(target, data);
                    } else if (target.parentElement.nodeName == 'A') {
                        let parent = target.parentElement;
                        controlStyle(parent, data);
                    }
                });
            };

            /**
             * 控制样式
             * @param atitle
             * @param data
             */
            let controlStyle = (atitle, data) => {
                if (atitle.dataset.hasPage == 'false') {
                    $scope.activePIds = [];
                    getActivePIds(atitle.dataset.sid, data.sortId);
                    if (atitle.firstElementChild.className.indexOf('rotate') < 0) {
                        $scope.activePIds.push(atitle.dataset.sid);
                    }
                } else if (atitle.dataset.hasPage == 'true') {
                    $scope.isActiveId = atitle.dataset.sid;
                }
                $scope.$apply();
            };

            /**
             * 控制侧边栏和顶部导航显示隐藏
             */
            let controlSidebar = (urls, data) => {
                setSidebarData(urls, data);
                let url = $location.path();
                if (url.split('/').length === 2) {
                    if (data.processConfigId) {
                        if(data.sortPId["config-"+data.processConfigId] && data.sortPId["config-"+data.processConfigId][0] && data.sortPId["config-"+data.processConfigId][0].url){
                            $location.path(data.sortPId["config-"+data.processConfigId][0].url);
                        }else if(data.sortPId["config-"+data.processConfigId] && data.sortPId["config-"+data.processConfigId][0].id && data.sortPId["config-"+data.processConfigId][0].id.indexOf('stage') > -1){
                            $location.path(data.sortPId[data.sortPId["config-"+data.processConfigId][0].id][0].url);
                        }
                        // $location.path('/' + url.split('/')[1] + '/apply/' + data.processConfigId + '/' + data.stage);
                    } //TODO 打开后勤运维时,默认打开我的预警列表页
                    // else if (url.indexOf('logistics') === 1) {
                    //     if(data.sortPId &&data.sortPId[0] && data.sortPId[0][0] ){
                    //         if(data.sortPId[0][0].url){
                    //             $location.path(data.sortPId[0][0].url);
                    //         }else{
                    //             $location.path(data.sortPId[data.sortPId[0][0].id][0].url);
                    //         }
                    //
                    //     }
                    //     // $location.path(url + '/warn/list/receive')
                    // }
                    else {
                        // $location.path('/' + url.split('/')[1] + '/all');
                        if(data.sortPId &&data.sortPId[0] && data.sortPId[0][0] ){
                            if(data.sortPId[0][0].url){
                                $location.path(data.sortPId[0][0].url);
                            }else{
                                $location.path(data.sortPId[data.sortPId[0][0].id][0].url);
                            }

                        }
                    }
                    $rootScope.isHideNavBar = false;
                    $scope.hidebar = false;
                }
            };

            let handleState = () => {
                $scope.currentTab = $location.path().split('/')[1];
                let flag = $location.url().indexOf('isAll=false') > -1;
                $scope.isShowBanner = !flag&&$location.url().indexOf('isAll=true') > -1;
                if ($scope.isShowBanner) {
                    $sessionStorage.set('isShowBanner', $scope.isShowBanner);
                } else if(flag){
                    $sessionStorage.remove('isShowBanner');
                }else {
                    $scope.isShowBanner = $sessionStorage.get('isShowBanner');
                }
                $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                    if (!$scope.noSidebar) {
                        $scope.currentTab = $location.path().split('/')[1];
                        if (toState.name.split('.').length !== 1) {
                            setSidebarData($scope.data.urls, $scope.data);
                        }
                    }
                    $scope.isShowBanner = $sessionStorage.get('isShowBanner');
                });
            }

            /**
             * 设置侧边栏相关参数
             * @param urls
             */
            let setSidebarData = (urls, data) => {
                let url = $location.path();
                let sidebar = urls[url];
                if (sidebar) {
                    $rootScope.sidebar = sidebar;
                    $scope.isActiveId = sidebar.id;
                    $scope.activePIds = [];
                    getActivePIds(sidebar.id, data.sortId);
                    $sessionStorage.set('sidebarId', sidebar.id);
                } else {
                    let index = url.lastIndexOf('/');
                    url = url.substring(0, index);
                    sidebar = urls[url];
                    $rootScope.sidebar = sidebar;
                    if (sidebar) $sessionStorage.set('sidebarId', sidebar.id);
                }
                let isWhiteList = sanitizeWhiteList(data);
                $rootScope.isHideNavBar = isWhiteList && !sidebar;
                $scope.hidebar = isWhiteList && !sidebar;
            };

            /**
             * 处理白名单对应的侧边栏选中效果
             * @param data
             * @return {boolean}
             */
            let sanitizeWhiteList = (data) => {
                let url = $location.path();
                let isWhiteList = $scope.whiteList.indexOf(url) < 0;
                let stateUrl = $state.current.url;
                if (isWhiteList && stateUrl) {
                    isWhiteList = $scope.whiteList.indexOf(stateUrl) < 0;
                    stateUrl = stateUrl.split('/');
                    let index = stateUrl.indexOf(':sidebarId');
                    if (!isWhiteList && index > -1) {
                        getActivePIds($state.params.sidebarId, data.sortId);
                        $scope.isActiveId = $state.params.sidebarId;
                    }
                }
                return isWhiteList;
            };

            handleState();

            /**
             * 当前流程
             */
            $scope.currentShowPopup = () => {
                ngDialog.open({
                    closeByDocument: false,
                    className: 'bdp layer_fixed_small current-flow-dialog',
                    template: require('../workflow/flowDialog/currentFlowDialog.html'),
                    plain: true,
                    controller: 'currentFlow',
                    controllerAs: 'currentFlow',
                    // scope:scope
                    // onOpenCallback: () => {}
                })
            }

            /**
             * 切换审批流程
             */
            $scope.switchFlowDialog = () => {
                ngDialog.open({
                    closeByDocument: false,
                    className: 'bdp layer_fixed flow-dialog',
                    template: require('../workflow/flowDialog/switchFlowDialog.html'),
                    plain: true,
                    controller: 'switchFlow',
                    controllerAs: 'switchFlowDialog',
                    // scope:scope
                    // onOpenCallback: () => {}
                })
            }
            /**
             * 模块所有待办任务
             */
            $scope.todoTaskDialog = () => {
                ngDialog.open({
                    closeByDocument: false,
                    className: 'bdp layer_fixed flow-dialog',
                    template: require('../todoTask/todoTaskDialog.html'),
                    plain: true,
                    controller: 'todoTaskListCtrl',
                    controllerAs: 'todoTaskList',
                    // scope:scope
                    // onOpenCallback: () => {}
                })
            }
        }
    }
}

slideBarDirective.$inject = ['$location', '$rootScope', '$compile', 'sidebarService', '$state', '$sessionStorage', 'ngDialog', 'ProjectInterface'];
