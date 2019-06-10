import updateLog from './updatelog.html';
export default function updateLogDirective(BasicConfigInterface) {
    return {
        restrict: "AE",
        replace: true,
        template: updateLog,
        scope: {
            
            closeClick: "&",
            data : "=",
            type : '='
        },
        link($scope,elem,attr) {
            $scope.typeName = attr.type ==='systype' ? '系统字典':'审批流程';
            $scope.id = $scope.data.id;
            $scope.name = $scope.data.name;
            $scope.clickEvent = function() {
                $scope.closeClick()
            }
             $scope.pageConfig = function(){
                $scope.showPage = true;
                $scope.paginationConf = {
                    onChange: (offset,size) => {
                        $scope.getList(offset,size,function(dataList,totalItems){
                            $scope.isSearch = $scope.keywords && $scope.keywords !=='' ? true : false;
                            $scope.dataList = dataList;
                            $scope.paginationConf.totalItems = totalItems;
                        });
                    }
                }
             }
            $scope.pageConfig();
            $scope.getList = function(offset,size,callback){
                let param = {
                    id : $scope.id,
                    offset : offset,
                    size : size,
                    keywords : $scope.keywords
                }
                if(attr.type ==='systype'){
                    BasicConfigInterface.getBaseConfiglog(param).then(res=>{
                        let totalItems = res.headers()['x-record-count'];
                        callback(res.data,totalItems);
                    })
                }else{
                    BasicConfigInterface.getProcessConfiglog(param).then(res=>{
                        let totalItems = res.headers()['x-record-count'];
                        callback(res.data,totalItems);
                    })
                }
                
            }
            $scope.search = function(){
                $scope.paginationConf.onChange();
            }
        }
    }
}
updateLogDirective.$inject=['BasicConfigInterface']