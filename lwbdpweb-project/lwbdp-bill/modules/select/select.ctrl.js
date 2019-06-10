var bdpWeb = angular.module('bdpWeb');
bdpWeb.controller('selectProjectCtrl', ['$scope', '$state', 'serviceUtil', '$stateParams','$config','DaoService',
    function ($scope, $state, serviceUtil, $stateParams,$config,DaoService) {
        $scope.condition ={};
        if(!$scope.returnProject){
            $scope.returnProject = null;
        }
        var setname,setids,setincomeamount,setpayoutamount,setavailableamount;
        //TODO 返回值 code
        DaoService.get($config.modules.GARDEN,'/garden/simple/group-strategy',{isUserControlStrategy:false}).then(function(data){
            $scope.gardens = angular.isArray(data.data)?data.data:null;
        });
        serviceUtil.requestServer('/dictionary/PROJECT_CATEGORY','get',function(data){
        	data  = data.dictionaryItems;
			data = angular.isArray(data)?data:null;
			var array = [];
			angular.forEach(data,function(v,k){
				if(v.parentCode == null){
					array.push(data[k]);
				}
			});
            $scope.projectTypeList = array;
        });
        $scope.setProject = {
            keyUp : function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.setProject.searchProject();
                }
            },
            searchProject: function (first) {
                $scope.isFirstp = first?first:false;
               setname = $scope.return_pname.split(".");
               setids = $scope.return_pid.split(".");
              if($scope.return_pincomeamount){
                setincomeamount = $scope.return_pincomeamount.split(".");
              }
              if($scope.return_ppayoutamount){
                setpayoutamount = $scope.return_ppayoutamount.split(".");
              }
              if($scope.return_pavailableamount){
                setavailableamount =$scope.return_pavailableamount.split(".");
              }
                if($scope.validate_proof){
                    $scope.condition.capitalNumberId = $scope.selectedCapitalNumber.id;
                }
                serviceUtil.requestServer('/old/project/condition', 'get', function (data) {
                    $scope.result_project = data;
                    for(var i= 0,len=data.length;i<len;i++){
                      if(data[i].id==$scope[setids[0]][setids[1]]){
                        data[i].checked = true;
                      }
                      if($scope.returnProject && data[i].id== $scope.returnProject.id){
						  data[i].checked = true;
					  }
                    }
                }, $scope.condition);
            },
            singleChoose : function(data){
                $scope.returnProject = data;
                data.checked = true;
            },
            delAll : function(){
                $scope.returnProject = null;
                for(var i in $scope.result_project){
                    $scope.result_project[i].checked = false;
                }
            },
            setProject : function(){
                var isArr = angular.isArray($scope.returnValue);
                if(!isArr && $scope.returnProject && $scope.returnProject.id){//对象
                    if($scope[setids[0]][setids[1]] != $scope.returnProject.id && $scope.selectedProjectContract &&$scope.selectedProjectContract.contractId){
                        $scope.selectedProjectContract.contractId = null;
                        $scope.selectedProjectContract.contractName= null;
                    }
                    $scope[setname[0]][setname[1]] = $scope.returnProject.name;
                    $scope[setids[0]][setids[1]] = $scope.returnProject.id;
                  if($scope.return_pincomeamount){
                    $scope[setincomeamount[0]][setincomeamount[1]] = $scope.returnProject.incomeAmount;
                  }
                  if($scope.return_ppayoutamount){
                    $scope[setpayoutamount[0]][setpayoutamount[1]] = $scope.returnProject.payoutAmount;
                  }
                  if($scope.return_pavailableamount){
                    $scope[setavailableamount[0]][setavailableamount[1]] = $scope.returnProject.availableAmount;
                  }
                }else{
                    $scope[setname[0]][setname[1]] = null;
                    $scope[setids[0]][setids[1]] = null;
                }
            },
            getNextType : function(){
                var param = {};
                param.dictionaryId = 'PROJECT_CATEGORY';
                param.parentId = $scope.condition.projectTypeId;
				param.gardenId = sessionStorage.getItem("gardenId");
                serviceUtil.requestServer('/dictionary/getByParentId','get',function(data){
                    $scope.projectItemTypeList = angular.isArray(data)?data:null;
                },param);
            }
        }

}]);

bdpWeb.controller('selectUnitctrl', ['$scope', '$state', 'serviceUtil', '$stateParams',
    function ($scope, $state, serviceUtil, $stateParams) {
        $scope.condition1 ={};
        var setname,setids;
        if(!$scope.returnUnit){
            $scope.returnUnit = null;
        }
        $scope.setUnit = {
            keyUp : function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.setUnit.searchbuildUnit();
                }
            },
            singleChoose : function(data){
                $scope.returnUnit = data;
                data.checked =true;
            },
            delAll : function(){
                $scope.returnUnit = null;
				$scope[setids[0]][setids[1]] = null;
                for(var i in $scope.result_unit){
                    $scope.result_unit[i].checked = false;
                }
            },
            searchbuildUnit: function (first) {
                $scope.isFirstUnit = first?first:false;
                setname = $scope.return_uName.split(".");
                setids = $scope.return_uId.split(".");
                serviceUtil.requestServer('/buildUnit', 'get', function (data) {
                    $scope.result_unit = data;
                    for(var i= 0,len=data.length;i<len;i++){
                        if(data[i].id==$scope[setids[0]][setids[1]]){
                            data[i].checked = true;
                        }
						if($scope.returnUnit && data[i].id== $scope.returnUnit.id){
							data[i].checked = true;
						}
                    }
                }, $scope.condition1);
            },
            setUnit : function(){
                var isArr = angular.isArray($scope.returnValue);
                var setname = $scope.return_uName.split(".");
                var  setids = $scope.return_uId.split(".");
               if(!isArr && $scope.returnUnit && $scope.returnUnit.id){//对象
                    $scope[setname[0]][setname[1]] = $scope.returnUnit.name;
                    $scope[setids[0]][setids[1]] = $scope.returnUnit.id;
                }else{
                    $scope[setname[0]][setname[1]] = null;
                    $scope[setids[0]][setids[1]] = null;
                }
                $scope.result_unit = null;
            }
        }

}]);
bdpWeb.controller('selectContractctrl', ['$scope', '$state', 'serviceUtil', '$stateParams',
    function ($scope, $state, serviceUtil, $stateParams) {
        $scope.condition2 ={};
        var setname,setids;
        if(!$scope.returnContract){
            $scope.returnContract = null;
        }

        $scope.setContract = {
            keyUp : function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.setContract.searchContract();
                }
            },
            singleChoose : function(data){
                $scope.returnContract = data;
                data.checked = true;
            },
            delAll : function(data){
                $scope.returnContract = null;
				$scope[setids[0]][setids[1]] = null;
                for(var i in $scope.result_con){
                    $scope.result_con[i].checked = false;
                }
            },
            searchContract: function (first) {
                $scope.isFirstCon = first?first:false;
                $scope.condition2.projectId = $scope.selectedProject.id;
                setname = $scope.return_cname.split(".");
                setids = $scope.return_cid.split(".");
                serviceUtil.requestServer('/projectContract/project', 'get', function (data) {
                    if(data){
                        $scope.result_con = data;
                        for(var i= 0,len=data.length;i<len;i++){
                            if($scope[setids[0]][setids[1]]==data[i].id){
                                data[i].checked = true;
                            }
							if($scope.returnContract && data[i].id== $scope.returnContract.id){
								data[i].checked = true;
							}
                        }
                    }
                }, $scope.condition2);
            },
            setContract : function(){
                var isArr = angular.isArray($scope.returnValue);
                var setname = $scope.return_cname.split(".");
                var  setids = $scope.return_cid.split(".");
                if(!isArr && $scope.returnContract && $scope.returnContract.contractNo){//对象
                    $scope[setname[0]][setname[1]] = $scope.returnContract.contractName;
                    $scope[setids[0]][setids[1]] = $scope.returnContract.contractNo;
                }else{
                    $scope[setname[0]][setname[1]] = null;
                    $scope[setids[0]][setids[1]] = null;
                }
                $scope.result_con = null;
            }
        }
    }]);
bdpWeb.controller('selectNumctrl', ['$scope', '$state', 'serviceUtil', '$stateParams','$config','DaoService',
    function ($scope, $state, serviceUtil, $stateParams,$config,DaoService) {
        $scope.condition3 ={};
        var setname,setids,settotalamount,setavailableamount,setsourcetypename;
        //TODO 返回值 code
        DaoService.get($config.modules.GARDEN,'/garden/simple/group-strategy',{isUserControlStrategy:false}).then( function (data) {
			$scope.gardens = angular.isArray(data.data)?data.data.data:null;
		});
        if(!$scope.returnCapNum){
            $scope.returnCapNum = null;
        }
        $scope.setCapnum = {
            keyUp : function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.setCapnum.searchCapnum();
                }
            },
            singleChoose : function(data){
                $scope.returnCapNum = data;
            },
            delAll : function(){
                $scope.returnCapNum = null;
				$scope[setids[0]][setids[1]] = null;
                for(var i in $scope.result_cap){
                    $scope.result_cap[i].checked = false;
                }
            },
            searchCapnum: function (first) {
                $scope.isFirstCap = first?first:false;
                setname = $scope.return_nName.split(".");
                setids = $scope.return_nId.split(".");
                serviceUtil.requestServer('/capital', 'get', function (data) {
                  $scope.result_cap = data;
                  for(var i= 0,len=data.length;i<len;i++){
                    if($scope[setids[0]][setids[1]]==data[i].id){
                      data[i].checked = true;
                    }
					  if($scope.returnCapNum && data[i].id== $scope.returnCapNum.id){
						  data[i].checked = true;
					  }
                  }
                }, $scope.condition3);
            },
            setCapnum : function(){
                var isArr = angular.isArray($scope.returnValue);
                if(!isArr && $scope.returnCapNum && $scope.returnCapNum.id){//对象
                    $scope[setname[0]][setname[1]] = $scope.returnCapNum.name;
                    $scope[setids[0]][setids[1]] = $scope.returnCapNum.id;
                }else{
                    $scope[setname[0]][setname[1]] = null;
                    $scope[setids[0]][setids[1]] = null;
                }
            }
        };
    }]);

bdpWeb.controller('selectGardenctrl', ['$scope', '$state', 'serviceUtil', '$stateParams','DaoService','$config',
    function ($scope, $state, serviceUtil, $stateParams,DaoService,$config) {
        // $scope.condition ={};
        if(!$scope.returnValue){
            $scope.returnValue = null;
        }
        var originGardens = null;
        //TODO 返回值 code
        DaoService.get($config.modules.GARDEN,'/garden/simple/group-strategy',{isUserControlStrategy:false}).then( function (data) {
            $scope.isFirstGar = true;
            $scope.gardens = angular.isArray(data.data)?data.data:null;
            originGardens = angular.isArray(data.data)?data.data:null;
        });
        $scope.setGarden ={
            keyUp : function(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.setGarden.searchGarden();
                }
            },
            searchGarden: function () {
                $scope.isFirstGar = false;
                var arr = [];
				if ($scope.condition.keywords && $scope.condition.keywords != '') {
                    var word = $scope.condition.keywords;
                    for (var i = 0, len = originGardens.length; i < len; i++) {
                        if (originGardens[i].name.indexOf(word) != -1) {
                            arr.push(originGardens[i]);
                        }
                    }
                    $scope.gardens = arr;
                } else {
                    $scope.gardens = originGardens;
                }
            },
            singleChoose : function(data){
                $scope.returnValue = data;
                data.checked = true;
            },
            MulitChoose : function(data){
                if(!$scope.returnValue){
                    $scope.returnValue = [];
                }
				var idx = $scope.returnValue.indexOf(data);
				if(idx>-1){
					$scope.returnValue.splice(idx,1);
					return;
				}
                data.checked = true;
                $scope.returnValue.push(data);
            },
            delAll : function(){
                $scope.returnValue = null;
                for(var i in $scope.gardens){
                    $scope.gardens[i].checked = false;
                }
            },
            delOne : function(id,idx){
                var curIdx = null;
                $scope.returnValue.splice(idx, 1);
                for(var i = 0,len = $scope.gardens.length;i<len;i++){
                    if($scope.gardens[i].gardenId == id){
                        $scope.gardens[i].checked = false;
                    }
                }
            },
            setGarden : function(){
                var isArr = angular.isArray($scope.returnValue);
                var setname = $scope.returnName.split(".");
                var  setids = $scope.returnId.split(".");
                if(isArr && $scope.returnValue && $scope.returnValue.length>0){//数组
                    var nameList =[],idList=[];
                    for(var i =0,len = $scope.returnValue.length;i<len;i++){
                        nameList.push($scope.returnValue[i].gardenName);
                        idList.push($scope.returnValue[i].gardenId);
                    }
                    $scope[setname[0]][setname[1]] = nameList.join(";")+';';
                    $scope[setids[0]][setids[1]] = idList.toString();
                }else if(!isArr && $scope.returnValue && $scope.returnValue.gardenId){//对象
                    $scope[setname[0]][setname[1]] = $scope.returnValue.gardenName;
                    $scope[setids[0]][setids[1]] = $scope.returnValue.gardenId;
                }else{
                    $scope[setname[0]][setname[1]] = null;
                    $scope[setids[0]][setids[1]] = null;
                }
				if($scope.twoSearch&&$scope.condition){
					$scope.$parent.condition.gardenIdString = $scope.condition.gardenIdString;
				}
                $scope.result = null;
                if($scope.selectType == 'garden'){
                    $scope.gardens = null;
                }
            }
        }
    }]);
