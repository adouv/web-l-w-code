/**
 * Created by hejialin on 2016/9/20.
 */
/**
 * 上拉刷新，下拉加载指令
 */
var plugins = angular.module('lw.plugin', []);
plugins.directive("lwLoadRefresh", ["serviceUtil", function (serviceUtil) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        template: '<div id="lwLoadRefresh">' +
        '<div ng-transclude></div>' +
        '<div id="pullUp" class="pullUp">' +
        '<p>' +
        '<em class="lineWhite"></em>&nbsp;' +
        '<span>下拉刷新</span>&nbsp;' +
        '<em class="lineWhite"></em>' +
        '</p>' +
        '<div class="loading">' +
        '<ul><li></li><li></li><li></li><li></li></ul>' +
        '</div>' +
        '</div>' +
        '</div>',
        link: function (scope, elem, attrs) {
            scope = scope.$parent;
            var wrapper = {
                init: function () {
                    var _this = this;
                    this.params = {};
                    scope.page = {};
                    scope.page.dataList = [];
                    _this.page = 1;
                    _this.getParams();
                    ((attrs.goInTo * 1) || !(attrs.isFirstLoad * 1)) && _this.getDatas({offset: 0});
                    _this.iscrollInit();
                    $("#lw-search").on("input propertychange", function () {
                        scope.page = {};
                        scope.page.dataList = [];
                        _this.search();
                    });
                },
                iscrollInit: function () {
                    var _this = this;
                    $.iscroll({
                        pullUp: "pullUp",//上拉滚动divId
                        wrapper: "lwLoadRefresh",//要出滚动条的最外层divId
                        pullDownFn: function (myScroll) {
                            _this.getDatas({offset: 0});
                            myScroll.refresh();
                        },
                        pullUpFn: function (myScroll) {
                            if (scope.page.haveNextPage) {
                                _this.getDatas({offset: _this.page * attrs.size});
                                _this.page += 1;
                                myScroll.refresh();
                            } else {
                                myScroll.refresh();
                                $.iscrollNull("pullUp");
                            }
                        }
                    });
                },
                getDatas: function (params) {
                    var _this = this;
                    params.size = attrs.size || 10;
                    var param = $.extend({}, params, this.params, scope.codition);
                    serviceUtil.requestServer(attrs.url, 'get', function (data, headers) {
                        var count = headers['x-record-count'];
                        Array.prototype.push.apply(scope.page.dataList, data.data);
                        scope.page = _this.setPage(scope.page.dataList, count);
                    }, param);
                },
                getParams: function () {
                    for (var attr in attrs['$attr']) {
                        this.params[attr] = attrs[attr];
                    }
                    delete this.params['url'];
                    delete this.params['id'];
                },
                setPage: function (list, totalCount) {
                    var _this = this, totalPage = Math.ceil(totalCount / attrs.size);
                    return {
                        page: wrapper.page,
                        size: attrs.size,
                        totalCount: totalCount,
                        totalPage: totalPage,
                        havePrevPage: _this.page > 0,
                        haveNextPage: totalPage > _this.page,
                        dataList: list
                    };
                },
                search: function () {
                    clearTimeout(scope.inputpagetime);
                    scope.inputpagetime = setTimeout(function () {
                        scope.codition = scope.condition;
                        wrapper.getDatas({offset: 0});
                    }, 1000);
                }
            };
            wrapper.init();
        }
    }
}]);

/**
 * 分页插件指令
 */
plugins.directive("lwPagination", ['serviceUtil', function (serviceUtil) {
    return {
        restrict: "E",
        replace: true,
        template: '<div id="lwPage" style="position: relative"></div>',
        link: function (scope, elem, attrs) {
            var page = {
                timer: null,
                init: function () {
                    var _this = this, attrs = arguments[0];
                    scope.condition = {};
                    this.params = {offset: 0, size: 15};
                    for (var attr in attrs['$attr']) {
                        this.params[attr] = attrs[attr];
                    }
                    delete this.params['url'];
                    delete this.params['id'];
                    this.getList(function (data) {
                        scope.datas = data.data;
                        _this.lwInitPage(data.data.totalRecord);
                    });
                    $("#lw-search").on("click", function () {
                        _this.searchKeyword();
                    });
                },
                getList: function (callback) {
                    var param = $.extend({}, scope.condition, this.params);
                    serviceUtil.requestServer(attrs.url, 'get', callback, param);
                },
                lwInitPage: function (itemCount) {
                    $("#lwPage").lwPage(itemCount, {
                        num_edge_entries: 0, //边缘页数
                        num_display_entries: 0, //主体页数
                        num_edge_entries: 5,
                        current_page: 0,
                        showGo: true,
                        showSelect: true,
                        items_per_page: param.size, //每页显示X项
                        prev_text: "上一页",
                        next_text: "下一页",
                        callback: lwLoadTemplate
                    });
                },
                lwLoadTemplate: function (pno, psize, callback) {
                    clearTimeout(this.timer);
                    this.params.size = psize;
                    this.params.offset = pno + 1;
                    this.timer = setTimeout(function () {
                        var startTime = $("#startTime").val();
                        var endTime = $("#endTime").val();
                        if (startTime || endTime) {
                            scope.condition.startTime = startTime;
                            scope.condition.endTime = endTime;
                        }
                        this.getList(function (data) {
                            scope.datas = data;
                            typeof callback === "function" && callback(data.data.totalRecord);
                        });
                    }, 200);
                },
                searchKeyword: function () {
                    var _this = this;
                    this.lwLoadTemplate(1, 15, function (itemcount) {
                        _this.lwInitPage(itemcount);
                    });
                }
            };
            page.init(attrs);
        }
    }
}]);

plugins.directive('lwPaging', ['serviceUtil', function (serviceUtil) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="lwpaging" ng-show="pagingShow">' +
        '<span id="paging-prev">&lt;上一页</span>' +
        '<span>{{paging.offset}}/{{totalPage}}</span>' +
        '<span id="paging-next">下一页&gt;</span>' +
        '</div>',
        link: function (scope, elem, attrs) {
            var paging = {
                init: function () {
                    _this = this;
                    scope.pagingShow = true;
                    scope.paging = {offset: 0, size: 10};
                    scope.condition = {offset: 0};
                    for (var attr in attrs['$attr']) {
                        scope.paging[attr] = attrs[attr];
                    }
                    delete scope.paging['url'];
                    delete scope.paging['ngShow'];
                    delete scope.paging['id'];
                    this.request(0);
                    this.$elem('#paging-prev').on('click', function () {
                        if (scope.paging.offset - 1) _this.request(-1);
                    })
                    this.$elem('#paging-next').on('click', function () {
                        if (scope.paging.offset < scope.totalPage) _this.request(1);
                    })
                    this.$elem('.lw-search').on('click', function () {
                        _this.searchKeyword();
                    })
                },
                $elem: function (dom) {
                    return angular.element(document.querySelector(dom));
                },
                searchKeyword: function () {
                    scope.paging.offset = 1;
                    _this.request(0);
                },
                request: function (num) {
                    scope.paging.offset += num;
                    var params = angular.extend({}, scope.condition, scope.paging);
                    serviceUtil.requestServer(attrs.url, 'get', function (data) {
                        if (data && data.data) {
                            scope.dataList = data.data.list;
                            scope.totalPage = data.data.totalPage;
                            scope.totalRecord = data.data.totalRecord;
                            scope.paging.offset = data.data.offset;
                            scope.pagingShow = !!data.data.totalRecord;
                        }
                    }, params)
                }
            };
            paging.init();
        }
    }
}]);


plugins.directive("lwPlupload", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            var fileType = "gif,jpg,png,bmp,jpeg,doc,docx,pdf,zip,xls,xlsx,rar,7z";
            $('.upload-file').on("click", ".remove-btn", function () {
                var atts = scope.data[attrs.scope];
                var index = $(this).parent().index();
                var file = $(this).parent().data('file');
                $(elem).plupload("remove", file);
                scope.$apply(function () {
                    for (var i = 0, len = atts.length; i < len; i++) {
                        if (atts[i].fileId == file) {
                            scope.data[attrs.scope].splice(i, 1);
                            break;
                        }
                    }
                })
            });
            $(elem).plupload({
                folder: "lwoa/" + attrs.lwPlupload + "/",//上传文件的存储路径
                hidden: false,//是否生成隐藏域，默认true，用于存储后台返回的文件路径，dom上必须有name属性
                multi: attrs.multi || false,//能传多个文件，还是单个，默认单选
                auto: true,//是否自动上传，默认true
                showFile: false,
                filters: {
                    mime_types: [{extensions: fileType}],
                    max_file_size: '102400kb',
                    prevent_duplicates: true
                },
                successFn: function (uploader, file, responseJson) {
                    if (scope.data) {
                        if (!scope.data[attrs.scope]) {
                            scope.data[attrs.scope] = [];
                        }
                    } else {
                        scope.data = {};
                        scope.data[attrs.scope] = [];
                    }
                    scope.$apply(function () {
                        scope.data[attrs.scope].push({
                            'name': responseJson.name,
                            'url': responseJson.path,
                            'fileId': file.id
                        });
                    })
                }
            });
        }
    }
});

plugins.directive('lwDownLoad', ['serviceUtil', function (serviceUtil) {
    return {
        scope: {},
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                serviceUtil.getConfig(function (data) {
                    var url = attrs.lwDownLoad, path = data.path;
                    window.location.href = path.fileServer + path.download_prefix + url;
                });
            });
        }
    }
}]);

plugins.directive('onLongPress', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $elm, $attrs) {
            $scope.longPress = 0;
            $elm.bind('touchstart', function (evt) {
                // evt.preventDefault();
                $scope.longPress = $timeout(function () {
                    $scope.$apply(function () {
                        $scope.$parent.$eval($attrs.onLongPress)
                    });
                }, 700);
            });
            $elm.bind('touchmove', removeTouch);
            $elm.bind('touchend', removeTouch);
            function removeTouch(evt) {
                // evt.preventDefault();
                $timeout.cancel($scope.longPress);
            }
        }
    };
}]);

/*最新分页*/
plugins.directive("lwPage", ['serviceUtil', function (serviceUtil) {
    return {
        restrict: "E",
        replace: true,
        template: '<div id="lwPage" style="position: relative"></div>',
        link: function (scope, elem, attrs) {
            scope.condition = {};
            var params = {offset: 0, size: 15};
            for (var attr in attrs['$attr']) {
                params[attr] = attrs[attr];
            }
            delete params['url'];
            delete params['id'];
            getList(function (data) {
                lw_initPage(data);
            });
            function lw_initPage(itemCount) {
                $("#lwPage").lwPage(itemCount, {
                    num_display_entries: 5, //主体页数
                    num_edge_entries: 5,
                    current_page: 0,
                    showGo: true,
                    showSelect: true,
                    items_per_page: params.size, //每页显示X项
                    prev_text: "前一页",
                    next_text: "后一页",
                    callback: lw_loadingTemplate
                });
            };
            $("#lw-search").on("click", function () {
                searchKeyword();
            });
            function searchKeyword() {
                params.offset = 0;
                getList(function (data) {
                    lw_initPage(data);
                });
            }
            scope.toSearch = searchKeyword;
            scope.pageSearch = searchKeyword;

            var timer = null;

            function lw_loadingTemplate(pno, psize, callback) {
                clearTimeout(timer);
                params.size = psize;
                params.offset = pno;
                timer = setTimeout(function () {
                    var startTime = $("#startTime").val();
                    var endTime = $("#endTime").val();
                    if (startTime || endTime) {
                        scope.condition.startTime = startTime;
                        scope.condition.endTime = endTime;
                    }
                    getList();
                }, 200);
            };
            function getList(callback) {
                var param = $.extend({}, scope.condition, params);
                serviceUtil.requestServer(attrs.url, 'get', param,function (data,headers) {
                    var total = headers['x-record-count'];
                    if(data.data){
                        scope.datas = data.data;
                    }
                    else{
                        scope.datas = data;
                    }
                    typeof callback === "function" && callback(total);
                });
            }
        }
    }
}]);
