/**
 * Created by cuishiyong on 2018/1/9.
 */
import '../styles/normalmanage.css';
import '../styles/normalmanagetree.css';
tpk_normalmanage.controller('normalmanage.normal.ctrl',['$scope', '$state', '$stateParams', 'serviceUtil','Garden', 'lwUiModel',
    function($scope,$state,$stateParams,serviceUtil,Garden,lwUiModel){
        Garden.gardenToggle($scope);
        //console.log();
        $scope.gardenId = $stateParams.gardenId;
        $scope.dataType= "1";// 默认选中班级
        $scope.selectTreeData = [];
        $scope.peoples = [];
        $scope.normaltypes = [
            {
                id:1,
                name:'课堂直播',
            },
            {
                id:2,
                name:'课堂点播',
            },
            {
               id:3,
               name:'教学评价',
            },
            {
                id:4,
                name:'巡课权限',
            },
            {
                id:5,
                name:'全部评课',
            }
        ];
        $scope.normal = $scope.normaltypes[0];// 默认选中第一个
        // 选中常态课树形数据时
        $scope.nodeclick = function(selectData){
            $scope.selectTreeData = selectData;
            $scope.getAllotUser();
            // console.log(selectData);
        }
        // 常态课类型改变时
        $scope.changeNormal = function(){
            $scope.selectTreeData = [];
            $scope.peoples = [];
            $scope.getAllotUser();
            getTreeData((data)=>{
                $scope.$broadcast("toTreeDataChange", data)
            });
        }
        // 选择班级或者学科时触发数据更新
        $scope.dataTypeChange = function(){
            $scope.selectTreeData = [];
            $scope.peoples = [];
            getTreeData((data)=>{
                $scope.$broadcast("toTreeDataChange", data)
            });
        }
        $scope.deletePeople = function(people,index){
            lwUiModel.delete(function () {
                serviceUtil.requestServer('/tpk/permission/account/remove','post',function(){
                    $scope.getAllotUser();
                },{
                    mode:parseInt($scope.dataType),
                    gardenId:$scope.gardenId,
                    type:$scope.normal.id,
                    permissionIds:$scope.selectTreeData.join(','),
                    accountIds:people.accountId
                })
            })

        }
        // 获得常态课树形数据
        let getTreeData = (callback)=>{
            //$scope.selectTreeData = [];
            //$scope.peoples = [];
            serviceUtil.requestServer('/organization/permission/tree','get',callback,{
                mode:parseInt($scope.dataType),
                gardenId:$scope.gardenId,
            })
        }
        // 获得已分配的用户
        $scope.getAllotUser = ()=>{
            if($scope.selectTreeData.length == 0){
                if(!$scope.$$phase){
                    $scope.$apply(function(){
                        $scope.peoples = [];
                    });
                }
                return;
            }
            var gardenId = sessionStorage.getItem('gardenId');
            serviceUtil.requestServer('	/tpk/permission/account/list','post',(data)=>{
                $scope.peoples = data;
            },{
                type:$scope.normal.id,
                mode:parseInt($scope.dataType),
                gardenId:$scope.gardenId,
                permissionIds:$scope.selectTreeData.join(',')
            })
        }
        getTreeData((data)=>{
            $scope.$broadcast("toTreeDataChange", data)
        });
}]);