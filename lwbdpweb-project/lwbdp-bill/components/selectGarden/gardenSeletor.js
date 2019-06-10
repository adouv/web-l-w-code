/** @Author: wangly*/

;(function () {
    var curGardenId,selected;
    var settings = {
        selected: null,
        group: [],
        user: [],
        multi: true,
        url: globals.path + "/garden/gardentype/getGardenTypeJson",
        successFn: function () {
        }
    };
    var methods = {
        //默认执行方法
        init: function (options) {
            selected = options.selected;
            resetParams();
            // settings = $.extend({},settings, options);
            settings = $.extend({},settings, options);
            settings.selected = selected;
            bulidSelectBox(settings);
        }
    };

    function bulidSelectBox() {
        rewriteJsMethod();
        setSelectedToIds();
        //拼接字符串 构建html.并用layer弹出
        openDepartment(settings);
        // var user = settings.user;
        //构建树结构
        bulidZtreeBox(selected);
        //默认节点展开
        expandAll();
        //选项卡
        tissueSelected();
        //toComUser();
        commonUser = userJsonData();
        //绑定事件
        bindPageEvent();
        //显示树的第一个节点的值
        //toClickFirstTreeNode();
        //回显
        selected&&toSetSelectedUser(selected);
    }

    //弹窗
    function openDepartment(okFun) {
        var content = bulidHtml();
        $.layer.openHtml({
            title: "选择用户",
            content: content,
            width: "870px",
            height: "540px",
            ok: function () {
                var selectedUserJson = getSelectedUserJson();
                //保存常用用户
                saveCommonUser(selectedUserJson);
                //callback
                var _successFn = settings.successFn;
                typeof(_successFn) == "function" && _successFn(selectedUserJson);
            },
            cancel: function () {
                //callback
                var _cancelFn = settings.cancelFn;
                typeof(_cancelFn) == "function" && _cancelFn();
            }

        });
    }

    //保存常用用户
    function saveCommonUser(selectedUserJson) {
        var ids = null;
        var idAry = [];
        for (var i = 0; i < selectedUserJson.length; i++) {
            idAry.push(selectedUserJson[i].id);
        }
        ids = idAry.join(",");
        if (ids) {
            $.ajax({
                url: globals.path + "/common/useaccount/save?TOKEN="+sessionStorage.getItem('TOKEN'),
                data: {
                    ids: ids
                },
                success: function (data) {

                }
            });
        }
    }

    //重置参数
    function resetParams() {
        settings = {
            selected: [],
            group: [],
            user: [],
            multi: true,
            url: globals.path + "/garden/gardentype/getGardenTypeJson",
            successFn: function () {
            }
        };
        right_user_array = [];
    }


    //构建html
    function bulidHtml() {
        // 拼接字符 然后添加到person_select中
        var gardenBox = '<div>' +
            '<div class="choose-bd">' +
            '<div class="park-type">' +
            '<div class="perList">' +
            '<span class="perList_span">园区类型</span>' +
            '</div>' +
            '<div class="park-type-bd">' +
            //左侧
            '<div>' +
            ' <ul id="tree" class="ztree"></ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="choose-left fl">' +
            '<div class="perList">' +
            '<span class="perList_span">部门列表</span>' +
            '<span class="input_case">' +
            '<input type="text" class="perInput selectorBox_nameFilter" placeholder="请按姓名搜索"/>' +
            '<a href="javascript:void(0);" class="search_btn selectorBox_nameFilter_btn"></a>' +
            '</span>' +
            '</div>' +
            '<div class="perList_bd">' +
            //左-中间
            '<div class="section_list">' +
            '<div class="tissue-tit">' +
            '<span class="tissue-name cur" type="orginze">组织结构</span>' +
            '<span class="tissue-name" type="common">常用用户</span>' +
            '</div>' +
            '<div class="tissue-bd selectorBox_left" id="tissue-bd">' +
            ' <ul id="treeDemo" class="ztree cur con-users"></ul>' +
            ' <ul id="common-users" class="con-users">' +
            //'<dd class="user_con">管理员</dd>'+
            '</ul>' +
            '</div>' +
            '</div>' +
            //左-右侧
            '<div class="name_list selectorBox_center">' +
            '<p class="name_listP">姓名</p>' +
            '<ul class="name_list_con">' +
            '</ul>' +
            '</div> ' +
            '</div>' +
            '</div>' +
            '<div class="choose-center fl">' +
            '<span class="allLeft">&gt;&gt;</span><br>' +
            // '<span class="arrowLeft">&gt;</span><br>'+
            // '<span class="arrowRight">&lt;</span><br>'+
            '<span class="allRight">&lt;&lt;</span>' +
            '</div>' +
            //右侧
            '<div class="choose-right selectorBox_right">' +
            '<div class="perList">' +
            '<span class="perList_span">已选择</span>' +
            '</div>' +
            '<ul class="chooseRi_con"></ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        return gardenBox;
    }

    var userTmpl = '<li userId="{id}" userPinyin="{pinyin}" class="name_con {cur}">{name}</li>';
    var comUserTmpl = '<li userId="{id}" class="name_con {cur}">{displayName}</li>';
    //已经选中的id，用于判断不能重复添加，未使用selected这个类
    var right_user_array = new Array();

    //获取常用用户数据
    var commonUser = [];

    // 构建左侧树结构,请求数据
    function getZNodes(selected) {
        var zNodes = null;
        $.ajax({
            type: "POST",
            url: settings.url+'?TOKEN='+sessionStorage.getItem('TOKEN'),
            dataType: "json",
            async: false,
            success: function (data) {
                zNodes = data;
            }
        });
        return zNodes;
    }

    function bulidZtreeBox() {
        var setting = {
            view: {
                showIcon: false,  //不显示图标
                dblClickExpand: false
            },
            //简单数据模式
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick: beforeClick,
                onClick: zTreeOnClick
            }
        };
        var treeObj = $.fn.zTree.init($("#tree"), setting, getZNodes());
        $.post(globals.path + '/as/accountSelector/getCurrGarden?TOKEN='+sessionStorage.getItem('TOKEN'), function (gardenId) {
            var node = treeObj.getNodeByParam("id", gardenId);
            treeObj.selectNode(node, false);
            $("#" + node.tId).find("a").click();
        })

    }

    // 右侧树，请求数据
    function branchZNodes(id) {
        var zNodes = null;

        $.ajax({
            type: "POST",
            url: globals.path + '/as/accountSelector/buildJsonData?TOKEN='+sessionStorage.getItem('TOKEN')+ '&gardenId=' + id,
            dataType: "json",
            async: false,
            success: function (data) {
                zNodes = data;
            }
        });
        return zNodes;
    }

    // 构建右侧树状结构- 点击节点事件
    function zTreeOnClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        // var user = settings.user;
        var selected = settings.selected;
        var jsonData = branchZNodes(treeNode.id);
        curGardenId = treeNode.id;
        // var accountsJson = jsonData.accountsJson;
        var departmentsJson = jsonData.departmentsJson;
        right_user_array = right_user_array.concat(selected);
        //console.log(treeNode.id);  //获取点击的id
        var setting = {
            view: {
                showIcon: false,  //不显示图标
                dblClickExpand: false
            },
            //简单数据模式
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick: beforeClick1,
                onClick: toLoadUser
            }
        };

        // settings.user = accountsJson;
        $.fn.zTree.init($("#treeDemo"), setting, departmentsJson);
        rightExpandAll();
        //绑定事件
        bindPageEvent();
    }

    function beforeClick(treeId, treeNode, clickFlag) {
        if (treeNode.id.indexOf("type_") != -1) {
            return false;
        }
        return true;
    }

    function beforeClick1(treeId, treeNode, clickFlag) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        //return !treeNode.isParent;
    }

    //选项卡
    function tissueSelected() {
        $(document).on("click", ".tissue-name", function () {
            $(this).addClass('cur').siblings().removeClass("cur");
            $('.tissue-bd .con-users').removeClass('cur');
            $('.tissue-bd .con-users').eq($(this).index()).addClass('cur');
            var type = $(this).attr("type");
            if ("common" == type) {
                $('.name_list').addClass("none");
                $('.choose-left').width(320);
                $('.perList_bd').width(320);
                $('.section_list').width(100 + "%");
                $('.choose-right').width(260);
                $('.input_case ').css("display", "none");
                toComUser();
            } else {
                $('.name_list').removeClass("none");
                $('.input_case ').css("display", "inline-block");
                $('.choose-left').width(410);
                $('.perList_bd').width(410);
                $('.section_list').width(240);
                $('.choose-right').width(165);
            }
        });
    }

    // 判断左侧树节点全部展开
    function expandAll(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        zTree.expandAll(true);
    }

    // 判断右侧树节点全部展开
    function rightExpandAll(treeId, treeNode) {
        var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
        zTreeObj.expandAll(true);
    }

    //获取常用用户json数据
    function userJsonData() {
        var zNodes = null;
        $.ajax({
            type: "POST",
            url: globals.path + '/common/useaccount/getUseAccountJson?TOKEN='+sessionStorage.getItem('TOKEN'),
            dataType: "json",
            async: false,
            success: function (data) {
                zNodes = data;
            }
        });
        return zNodes;
    }

    //加载常用用户
    function toComUser(event, treeId, treeNode) {
        var loadIndex = $.layer.load();
        var groupId = settings.id;
        var userHtml = comUserHtml(groupId, commonUser);

        $(".selectorBox_left #common-users").html(userHtml);
        /*$(".selectorBox_left ul").on("click",".name_con",function(){
         $(this).addClass("selectorBox_cur").siblings().removeClass("selectorBox_cur");
         });*/
        $.layer.unload(loadIndex);
    }

    //获取常用用户html
    function comUserHtml(groupId, commonUser) {
        var userHtml = "";
        for (var i = 0; i < commonUser.length; i++) {
            var userItem = commonUser[i];
            var pid = settings.id;
            userHtml += $.nano(comUserTmpl, userItem);
        }
        return userHtml;
    }

    function toClickFirstTreeNode(treeId, treeNode) {
        var treeId = "treeDemo";
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObj.getNodes();
        if (nodes.length != 0) {
            var treeNode = nodes[0];
            treeObj.selectNode(treeNode);
            toLoadUser(null, treeId, treeNode);
        }
    }

    function getGroupTreeNodes(group) {
        for (var i = 0; i < group.length; i++) {
            var groupItem = group[i];
            //配置默认值
            groupItem.open = true;
            groupItem.nocheck = true;
        }
        return group;
    }

    //加载用户
    function toLoadUser(event, treeId, treeNode) {
        var loadIndex = $.layer.load();
        var groupId = treeNode.id;
        // var user = settings.user;
        // var userHtml = getUserHtml(groupId, user);
        var userHtml = getUserHtml2(curGardenId, groupId);
        $(".selectorBox_center ul").html(userHtml);
        $.layer.unload(loadIndex);
    }

    function getUserHtml(groupId, user) {
        var userHtml = "";
        for (var i = 0; i < user.length; i++) {
            var userItem = user[i];
            var pid = userItem["pId"] + "";//用户的组id，多个以逗号分隔
            var pidArray = pid.split(",");
            if (pidArray.contains(groupId)) {
                userHtml += $.nano(userTmpl, userItem);
            }
        }
        return userHtml;
    }

    function getUserHtml2(gardenId, groupId) {
        var userHtml = "";
        $.ajax({
            type: "POST",
            url: globals.path + '/as/accountSelector/getUserByGroupId?TOKEN='+sessionStorage.getItem('TOKEN')+'&groupId=' + groupId + "&gardenId=" + gardenId,
            dataType: "json",
            async: false,
            success: function (data) {}.then(data=>{
                // if (data.code == 0) {
                    for (var i = 0; i < data.length; i++) {
                        var userItem = data[i];
                        userItem.name = data[i].displayName;
                        userHtml += $.nano(userTmpl, userItem)
                    }
            },err=>{
                console.log("后台出错：" + data.msg);
            })
        });
        return userHtml;
    }

    //绑定事件
    function bindPageEvent() {
        var left = $("#common-users");
        var center = $(".selectorBox_center ul");
        var right = $(".selectorBox_right ul");
        //左右选择
        left.on("click", "li", function () {
            addUserToRight(this);
        });
        center.on("click", "li", function () {
            addUserToRight(this);
        });
        right.on("click", "li", function () {
            removeUserFromRight(this);
        });
        //shift选中
        left.shiftSelect();
        center.shiftSelect();
        right.shiftSelect();
        //左右点击按钮
        bindLeftRightBtn();
        //搜索框
        var nameFilterInput = $("input.selectorBox_nameFilter");
        nameFilterInput.on("keyup", function () {
            toAutoSearch(this);
        });
        $("a.selectorBox_nameFilter_btn").click(function () {
            toAutoSearch(nameFilterInput);
        });
    }

    function bindLeftRightBtn() {
        $(".choose-center .arrowLeft").on("click", function () {
            //添加
            $("#common-users>li.selectorBox_cur").each(function (index, domEle) {
                addUserToRight(domEle);
            });
            $(".selectorBox_center ul>li.selectorBox_cur").each(function (index, domEle) {
                addUserToRight(domEle);
            });
        });
        //全部添加
        $(".choose-center .allLeft").on("click", function () {
            //添加
            $("#common-users>li.selectorBox_cur").each(function (index, domEle) {
                addUserToRight(domEle);
            });
            $(".selectorBox_center ul>li").each(function (index, domEle) {
                addUserToRight(domEle);
            });
        });
        $(".choose-center .arrowRight").on("click", function () {
            //删除
            $(".selectorBox_right ul>li.selectorBox_cur").each(function (index, domEle) {
                removeUserFromRight(domEle);
            });
        });
        //全部移除
        $(".choose-center .allRight").on("click", function () {
            //删除
            $(".selectorBox_right ul>li").each(function (index, domEle) {
                removeUserFromRight(domEle);
            });
        });
    }


    function addUserToRight(userObj) {
        var result = validateIsToRight(userObj);
        if (!result) {
            return;
        }
        var rightDom = $(userObj).clone().removeClass("selectorBox_cur");
        $(".selectorBox_right ul").append(rightDom);
        pushArray(rightDom);
    }

    function removeUserFromRight(userObj) {
        $(userObj).remove();
        popArray(userObj);
    }


    //维护数组
    function popArray(userObj) {
        var id = $(userObj).attr("userId");
        var index = right_user_array.indexOf(id);
        right_user_array.splice(index, 1);
    }

    function pushArray(userObj) {
        var id = $(userObj).attr("userId");
        right_user_array.push(id);
    }

    //验证是否可以添加到右侧
    function validateIsToRight(userObj) {
        if (!settings.multi && right_user_array.length >= 1) {
            return false;
        }
        var id = $(userObj).attr("userId");
        return !right_user_array.contains(id);
    }


    //回显用户
    function toSetSelectedUser(selected) {
        var userHtml = "";
        console.log('----------------------'+selected)
        var ids = selected.join(",");
        $.ajax({
            url: globals.path + "/account/getAccountJsonByIds?TOKEN="+sessionStorage.getItem('TOKEN'),
            data: {
                id: ids
            },
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    var dataJson = eval("(" + data + ")");
                    for (var i = 0; i < dataJson.length; i++) {
                        userHtml += $.nano(userTmpl, dataJson[i]);
                    }
                    $(".selectorBox_right ul").html(userHtml);
                }
            }
        });
    }


    //设置延迟查询
    var timerObj = null;

    function toAutoSearch(inputObj) {
        if (timerObj != null) {
            clearTimeout(timerObj);
            timerObj = null;
        }
        timerObj = setTimeout(function () {
            // nameFilter(inputObj);
            queryAccount(inputObj);
        }, 500);
    }

    function queryAccount(inputObj) {
        var inputVal = $(inputObj).val();
        var filterVal = inputVal.replace(/\s/g,"").toLowerCase();//要搜索的值
        if (!filterVal) {
            //选中的树click
            var treeId = "treeDemo";
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var nodes = treeObj.getSelectedNodes();
            if (nodes.length != 0) {
                var treeNode = nodes[0];
                toLoadUser(null, treeId, treeNode);
            }
            return;
        }
        //全局搜索所有用户
        var userHtml = "";
        $.ajax({
            url: globals.path + "/as/accountSelector/queryByKeyword?TOKEN="+sessionStorage.getItem('TOKEN'),
            data: {
                keyword: filterVal
            },
            async: false,
            success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var userItem = data[i];
                        userItem.name = data[i].displayName;
                        userHtml += $.nano(userTmpl, userItem);
                    }
            }
        });0
        $(".selectorBox_center ul").html(userHtml);
    }

    function nameFilter(inputObj) {
        var inputVal = $(inputObj).val();
        var filterVal = inputVal.replaceAll(" ", "").toLowerCase();//要搜索的值
        if (!filterVal) {
            //选中的树click
            var treeId = "treeDemo";
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var nodes = treeObj.getSelectedNodes();
            if (nodes.length != 0) {
                var treeNode = nodes[0];
                toLoadUser(null, treeId, treeNode);
            }
            return;
        }
        //全局搜索所有用户
        var userHtml = "";
        var user = settings.user;
        for (var i = 0; i < user.length; i++) {
            var userItem = user[i];
            var name = userItem.name;
            var pinyin = userItem.pinyin;
            var fieldVal = name + pinyin;
            fieldVal = fieldVal.replaceAll(" ", "").toLowerCase();//用户的值

            if (fieldVal.indexOf(filterVal) >= 0) {
                userHtml += $.nano(userTmpl, userItem);
            }
        }
        $(".selectorBox_center ul").html(userHtml);
    }


    //得到选中的用户Json
    function getSelectedUserJson() {
        var userArray = new Array();
        $(".chooseRi_con li").each(function () {
            var user = {};
            user.id = $(this).attr("userId");
            user.pinyin = $(this).attr("userPinyin");
            user.name = $(this).text();
            userArray.push(user);
        });
        return userArray;
    }

    //将selected转换成id的集合
    function setSelectedToIds() {
        var selected = settings.selected;
        var selectedArray = new Array();
        if (selected) {
            for (var i = 0; i < selected.length; i++) {
                var selectedItem = selected[i];
                selectedArray.push(selectedItem["id"]);
            }
        }
        settings.selected = selectedArray;
    }

    //重写数组contains方法
    function rewriteJsMethod() {
        Array.prototype.contains = function (element) {
            var _this = this;
            var _length = _this.length;
            for (var i = 0; i < _length; i++) {
                if (_this[i] == element) {
                    return true;
                }
            }
            return false;
        };
        Array.prototype.indexOf = function (element) {
            var _this = this;
            var _length = _this.length;
            for (var i = 0; i < _length; i++) {
                if (_this[i] == element) {
                    return i;
                }
            }
            return -1;
        };
    }
    $.nano = function(template, data) {
        return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
            var keys = key.split("."), value = data[keys.shift()];
            $.each(keys, function () { value = value[this]; });
            return (value === null || value === undefined) ? "" : value;
        });
    };
    $.accountSelector = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {//如果没有制定的方法,直接使用init
            return methods.init.apply(this, arguments);
        } else {
            $.error('The method ' + method + ' does not exist in $.bulidSelectBox');
        }
    };
})(jQuery);



