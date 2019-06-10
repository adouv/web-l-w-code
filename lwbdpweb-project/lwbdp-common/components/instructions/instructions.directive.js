/*
 * @Author: liuby 
 * @Date: 2018-02-07 13:28:40 
 * @Last Modified by: 323
 * @Last Modified time: 2018-02-08 10:17:24
 */
import './instructions.css';
import instructionsHtml from './instructions.html';

export default function instructions($compile, $config, ngDialog, ProjectInterface, $state, $sessionStorage, $rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        template: instructionsHtml,
        scope: {
            moduleCode: '@'
        },
        link: function ($scope, ele, attr) {
            ele.on('click', function () {
                console.log($scope);
                ngDialog.open({
                    closeByDocument: false,
                    className: 'bdp help-dialog layer_fixed',
                    template: `
                    <div class="bdp_list_search w5c-form">
                    <div class="dialog-header">
                        使用帮助
                        <span class="iconfont icon-close del_btn dialog-close" ng-click="closeThisDialog()"></span>
                    </div>
                    <ul class="file-list-help">
                        <li class='list-item-help' ng-repeat='data in fileDataList'>
                            <span class='file-name-help'>{{data.name}}</span> 
                            <div class='handle-box'>
                                <span class='iconfont icon-download' ng-click='downloadHelpDoc(data)'></span>
                            </div>
                        </li>
                    </ul>
                    <div class="dialog-btn">
                        <div class="btn_bg" ng-click="closeThisDialog()">关闭</div>
                    </div>
                </div>                
                    `,
                    plain: true,
                    scope: $scope
                })
            })
        },
        controller: function ($scope) {
            var _helpHideList = $sessionStorage.get('helpHideList') || [];
            var _currentModule = $rootScope.currentModule;
            var _routeName = $state.current.name;
            if (_helpHideList.includes(_currentModule)) {
                $scope.isShow = false;
            } else if (_routeName.slice(_routeName.lastIndexOf('.') + 1) === 'apply' || (_currentModule == 'logistics' && 　$state.params.sideBarCode == "receive")) {
                //只在我的项目列表展示使用帮助(后勤管理页面在我的预警页面展示)
                $scope.isShow = true;
            }
            ProjectInterface.getInstrctionsList($scope.moduleCode).then(function (res) {
                $scope.fileDataList = res.data;
            }, function (err) {
                console.log(err);
            });
            $scope.downloadHelpDoc = function (data) {
                window.location.href = $config.file.DOWNLOAD + data.url;
            }
            $scope.isShowDialog = false;
            $scope.hideHelp = function (evt) {
                evt.stopPropagation();
                $scope.isShow = false;
                _helpHideList.push(_currentModule);
                $sessionStorage.set('helpHideList', _helpHideList);
            }

        }
    }
}
instructions.$inject = ['$compile', '$config', 'ngDialog', 'ProjectInterface', '$state', '$sessionStorage', '$rootScope'];