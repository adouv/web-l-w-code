/**
 * Created by lw-yf-011 on 2017/7/13.
 * 平面弹窗
 */
export default function flatTreeDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: `<div class="choose_box overflow_box_sml">
                        <div class="label_box" ng-repeat="data in list track by $index">
                            <input name="flatTree" type="{{inputType?inputType:'checkbox'}}" id="kind{{$index}}" class="{{inputType?inputType:'checkbox'}}_class" ng-click="checked($event,data)" ng-checked="data.checked">
                            <label for="kind{{$index}}">{{ data[listName]}}</label>
                        </div>
                   </div>`,
        scope: {
            list:'=',//初始化弹窗的数据
            typeName: '=',//选中的节点的名称
            typeId: '=',//选中的节点的id
            listName:'=',//弹窗数据中类似'name'的属性
            listId:'=',//弹窗数据中类似'id'的属性
            inputType:'='
        },
        link($scope, ele) {
            let id = $scope.listId,
                name = $scope.listName;
            /*
             * 初始化弹窗数据
             * */
            $scope.$watch('$scope.list',()=>{
                echoNode();
            });

            /*
             * 初始化时,对选中的节点进行回显
             * */
            let echoNode = () => {
                let checkedNodeArr = $scope.typeId ? $scope.typeId : '';
                for (let index in $scope.list) {
                    for (let checked in checkedNodeArr) {
                        if ($scope.list[index][id] === checkedNodeArr[checked]) {
                            $scope.list[index].checked = true;
                            checkedId.push($scope.list[index][id]);
                            checkedName.push($scope.list[index][name]);
                        }
                    }
                }
            };
            /*
             * 获取选中的节点名称及id
             * */
            let checkedId =  [];
            let checkedName = [];
            $scope.checked = (event, data) => {
                let checkbox = event.target;
                // 如果元素被选中且在数组中不存在,则添加
                if (checkbox.checked && checkedId.indexOf(data[id]) === -1) {
                    checkedId.push(data[id]);
                    checkedName.push(data[name]);
                }
                //如果元素未被选中且在数组中存在,则删除
                if (!checkbox.checked && checkedId.indexOf(data[id]) !== -1) {
                    checkedId.splice(checkedId.indexOf(data[id]), 1);
                    checkedName.splice(checkedName.indexOf(data[name]),1);
                }
                if(checkedName.length > 1){
                    $scope.typeName = checkedName.join('；')+"；";
                }else if(checkedName.length === 1){
                    $scope.typeName = checkedName.join('')+'；';
                }else if(checkedName.length === 0){
                    $scope.typeName = checkedName.join('')
                }
                $scope.typeId = checkedId;
                $scope.$emit('dialogData',{
                    name:$scope.typeName,
                    id:$scope.typeId
                })
            };
        }
    }
}
