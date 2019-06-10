var bdpWeb = angular.module('bdpWeb');
//选项目
bdpWeb.directive('selectProject', ['serviceUtil', '$timeout', function (serviceUtil, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./select.project.html'),
        link: function (scope, elem, attrs) {
            scope.income = scope.$parent.incomeType;
            scope.payout = scope.$parent.payoutType;
            scope.return_pname = attrs.named;
            scope.return_pid = attrs.ids;
            scope.return_pincomeamount = attrs.incomeamount;
            scope.return_ppayoutamount = attrs.payoutamount;
            scope.return_pavailableamount = attrs.availableamount;
            var project = $("#select-project"),
                selectBtn = $("#selectProject");
            selectBtn.on('focus', function () {
                selectBtn.attr("readOnly", true);
                $timeout(function () {
                    $('#back').show();
                }, 200)
            });
            selectBtn.on('blur', function () {
                selectBtn.attr("readOnly", false);
            });
            selectBtn.on('click', function (e) {
                e.stopPropagation();
                if (attrs.validate && !attrs.proof) {
                    return false;
                }
                $(".selectbox").parent().hide();
                project.show();
                if (attrs.proof) {
                    scope.validate_proof = attrs.proof;
                }
                var setname = attrs.named.split(".");
                var setids = attrs.ids.split(".");
                if (scope[setname[0]][setname[1]]) {
                    scope.returnProject = {};
                    scope.returnProject.name = scope[setname[0]][setname[1]];
                    scope.returnProject.id = scope[setids[0]][setids[1]];
                }
                scope.setProject.searchProject(1);
            });
        }
    }
}]);
//选单位
bdpWeb.directive('selectUnit', ['serviceUtil', '$timeout', function (serviceUtil, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./select.unit.html'),
        link: function (scope, elem, attrs) {
            scope.return_uName = attrs.named;
            scope.return_uId = attrs.ids;
            var project = $("#select-unit"),
                selectBtn = $("#selectUnit");
            selectBtn.on('focus', function () {
                selectBtn.attr("readOnly", true);
                $timeout(function () {
                    $('#back').show();
                }, 500)
            });
            selectBtn.on('blur', function () {
                selectBtn.attr("readOnly", false);
            });
            selectBtn.on('click', function (e) {
                e.stopPropagation();
                $(".selectbox").parent().hide();
                project.show();
                var setname = attrs.named.split(".");
                var setids = attrs.ids.split(".");
                if (scope[setname[0]][setname[1]]) {
                    scope.returnUnit = {};
                    scope.returnUnit.name = scope[setname[0]][setname[1]];
                    scope.returnUnit.id = scope[setids[0]][setids[1]];
                }
                scope.setUnit.searchbuildUnit(1);
            });
        }
    }
}]);
//选资金文号
bdpWeb.directive('selectCapnum', ['serviceUtil', '$timeout', function (serviceUtil, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./select.num.html'),
        link: function (scope, elem, attrs) {
            scope.return_nName = attrs.named;
            scope.return_nId = attrs.ids;
            var project = $("#select-num"),
                selectBtn = $("#selectCapnum");
            selectBtn.on('focus', function () {
                selectBtn.attr("readOnly", true);
                $timeout(function () {
                    $('#back').show();
                }, 500)
            });
            selectBtn.on('blur', function () {
                selectBtn.attr("readOnly", false);
            });

            selectBtn.on('click', function (e) {
                e.stopPropagation();
                $(".selectbox").parent().hide();
                project.show();
                var setname = attrs.named.split(".");
                var setids = attrs.ids.split(".");
                if (scope[setname[0]][setname[1]]) {
                    scope.returnCapNum = {};
                    scope.returnCapNum.name = scope[setname[0]][setname[1]];
                    scope.returnCapNum.id = scope[setids[0]][setids[1]];
                }
                scope.setCapnum.searchCapnum(1);
            });
        }
    }
}]);
//选合同
bdpWeb.directive('selectContract', ['serviceUtil', '$timeout', function (serviceUtil, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./select.contract.html'),
        link: function (scope, elem, attrs) {
            scope.return_cname = attrs.named;
            scope.return_cid = attrs.ids;
            var conid = attrs.conid;
            var project = $("#select-contract"),
                selectBtn = $("#selectContract");
            selectBtn.on('focus', function () {
                selectBtn.attr("readOnly", true);
                if ($("#selectProject").val() !== '') {
                    $timeout(function () {
                        $('#back').show();
                    }, 500)
                }
            });
            selectBtn.on('blur', function () {
                selectBtn.attr("readOnly", false);
            });
            selectBtn.on('click', function (e) {
                e.stopPropagation();
                if (conid && scope[conid]) {
                    scope.selectedProject.id = scope[conid];
                }
                if (!scope.selectedProject.id) {
                    return false;
                }
                project.show();
                var setname = attrs.named.split(".");
                var setids = attrs.ids.split(".");
                if (scope[setname[0]][setname[1]]) {
                    scope.returnContract = {};
                    scope.returnContract.contractName = scope[setname[0]][setname[1]];
                    scope.returnContract.contractNo = scope[setids[0]][setids[1]];
                }
                scope.setContract.searchContract(1);
            });
        }
    }
}]);

//选园区
bdpWeb.directive('selectGarden', ['serviceUtil', '$timeout', function (serviceUtil, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        template: require('./select.garden.html'),
        link: function (scope, elem, attrs) {
            console.log(scope)
            scope.returnName = attrs.named;
            scope.returnId = attrs.ids;
            scope.isCapitalnumber = attrs.showcapitalnumber;
            scope.isMulit = attrs.type ? attrs.type : 'single';
            scope.closeSelect = function () {
                scope.isCloseSelect = true
            }
            var project = $("#select-garden"),
                selectBtn = $(".selectGarden");
            if (!selectBtn.length) {
                selectBtn = $(".selectGarden");
                scope.twoSearch = true;
            }
            selectBtn.on('focus', function () {
                selectBtn.attr("readOnly", true);
                $timeout(function () {
                    $('#back').show();
                }, 500)
            });
            selectBtn.on('blur', function () {
                selectBtn.attr("readOnly", false);
            });
            
            $(elem).prev().on('click', function (e) {
                e.stopPropagation();
                project.show();
                var setname = attrs.named.split(".");
                var setids = attrs.ids.split(".");
                if (scope.returnValue) {
                } else {
                    if (scope[setids[0]][setids[1]]) {
                        scope.returnValue = {};
                        scope.returnValue.name = scope[setname[0]][setname[1]];
                        scope.returnValue.id = scope[setids[0]][setids[1]];
                    } else if (scope[setids[0]][setids[1]] && scope[setids[0]][setids[1]].indexOf(',') > -1) {
                        scope.returnValue = [];
                        var arr = scope[setids[0]][setids[1]].split(','),
                            arr2 = scope[setname[0]][setname[1]].split(';');
                        for (var i = 0, len = arr.length; i < len; i++) {
                            var a = {};
                            a.id = arr[i];
                            a.name = arr2[i];
                            scope.returnValue.push(a);
                        }
                    }
                }
            });
        }
    }
}]);


bdpWeb.directive('closeSelect', ['serviceUtil', function (serviceUtil) {
    return {
        link: function (scope, elem, attrs) {
            var id = attrs.type;
            /*$(".page").on('click',function(){
             for(var i = 0,len = $(".selectbox").length;i<len;i++){
             if(!$(".selectbox").eq(i).is(":hidden")){
             $(".selectbox").eq(i).hide();
             }
             }
             });*/
            $("#" + id).on("click", function (e) {
                e.stopPropagation();
                $('#back').hide();
            });
            elem.on("click", function () {
                $("#" + id).hide();
                if (id == 'select-num' && $("#searchProject").length > 0) {
                    $("#searchProject").click();
                }
            });
            // $(document).on('click',function(e){
            // 	e.stopPropagation();
            // 	if(!$(".selectbox").is(":hidden")){
            // 		$(".selectbox").hide();
            // 	}
            // })
        }
    }
}]);
