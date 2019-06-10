import './style.css';
import echarts from 'echarts';
export default class disposeStaticsCtrl {
    constructor(AssetDictionaryInterface, SelectGarden, $scope, $sessionStorage, ProjectInterface, AssetInterface, $stateParams) {
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.SelectGarden = SelectGarden;
        this.$sessionStorage = $sessionStorage;
        this.ProjectInterface = ProjectInterface;
        this.AssetInterface = AssetInterface;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.init();
    }

    init() {
        let currentGarden = this.$sessionStorage.get('currentGarden');
        this.account = this.$sessionStorage.get('account');
        this.selectedGarden = [currentGarden];
        this.gardenIds = currentGarden.gardenId;
        this.getDirections();
        this.myChart = echarts.init(document.getElementById('mychart'));
        this.isMyApply = false;
        this.showDialog = false;
        this.selectedDirection = [];
        this.selectedName = [];
        this.selectedIds = [];
        this.originSelected = [];
        this.resizeWidth();
        this.title = "处置形式";
        //图表点击事件
        this.myChart.on('click', res => {
            let idx = res.dataIndex - 1;
            this.selectedTaskKey = this.chartData[idx].taskKey;
            this.DialogTitle = this.chartData[idx].taskName;
            this.showDialog = true;
            this.pageConfig();
            this.$scope.$apply();
        });
        window.onresize = (res => {
            if (!document.querySelector('#mychart')) {
                return false;
            }
            this.resizeWidth();
        });

    }

    resizeWidth() {
        let width = document.querySelector('#main_content').offsetWidth;
        width = width > 1050 ? width : 1050;
        this.myChart.resize({
            width: width
        });
    }

    //获取处置方向字典值
    getDirections() {
        this.defaultselectedDirection = [];

        this.AssetDictionaryInterface.getDisposeType().then(res => {
            this.directions = res.data;
            for (let val of this.directions) {
                this.defaultselectedDirection.push(val.id);
            }
            this.getChart(this.defaultselectedDirection);
        })
    }

    //处置方向选中状态切换 
    checkDirection(event, data) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        let isCheck = event.target.checked;
        if (isCheck && this.selectedDirection.indexOf(data.id) == -1) {
            this.selectedDirection.push(data.id);
            this.selectedName.push(data.name);
        } else if (!isCheck && this.selectedDirection.indexOf(data.id) != -1) {
            let idx = this.selectedDirection.indexOf(data.id);
            this.selectedDirection.splice(idx, 1);
            this.selectedName.splice(idx, 1);
        }
    }

    //显示处置方向
    showDirections(event, isShow) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this.isShowDirections = isShow;
        this.selectedDirection = angular.copy(this.selectedIds);
    }

    saveSelected(event) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this.isShowDirections = false;
        this.selectedIds = this.selectedDirection.length > 0 ? this.selectedDirection : this.defaultselectedDirection;
        this.getChart(this.selectedIds);
        this.title = "";
        this.title = this.selectedName.join("；");
    }

    //X对勾
    cancelAllCheckBox() {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        for (let item of this.directions) {
            item.checked = false;
        }
        this.selectedDirection = [];
        this.selectedName = [];
    }

    //选园区
    chooseGarden() {
        if (!this.isMyApply) {
            this.SelectGarden.dialog({
                ids: this.gardenIds
            }, ($garden) => {
                this.gardenIds = $garden.ids;
                this.selectedGarden = $garden.gardenList;
                this.getChart(this.selectedDirection.length > 0 ? this.selectedDirection : this.defaultselectedDirection);
            });
        }
    }

    //配置分页
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getApplyList(this.selectedTaskKey, offset, size, (applyList, totalItems) => {
                    this.applyList = applyList;
                    this.paginationConf.totalItems = totalItems;
                });
            }
        };
    }

    stopPropagation(event) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
    }

    /**
     * 查询分页列表
     * @param taskKey 任务id
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getApplyList(taskKey, offset, size, callback) {
        // let param = {
        //     disposeTypes: (this.selectedDirection[0] ? this.selectedDirection : this.defaultselectedDirection).toString(),
        //     gardenIds: this.gardenIds,
        //     isMyApply: this.isMyApply,
        //     offset: offset,
        //     size: size
        // };
        let accountId = this.isMyApply ? this.account.accountId : null;
        let disposeTypes = (this.selectedDirection[0] ? this.selectedDirection : this.defaultselectedDirection);
        //moduleCode, processConfigId, projectStatus, stage, taskKey, gardenIds, categoryList, keywords, offset, size , accountId
        console.log(accountId);
        this.ProjectInterface.getProjectLibrary(moduleAlias.ASSET, this.$stateParams.processConfigId, null,this.$stateParams.stage, taskKey, this.gardenIds, disposeTypes, null ,offset , size , accountId).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }

    //生成,重置折线图
    getChart(directionsArr) {
        directionsArr = directionsArr || (this.selectedDirection[0] ? this.selectedDirection : this.defaultselectedDirection);
        var accountId = null;
        if(this.isMyApply){
            accountId = this.account.accountId;
        }
        this.ProjectInterface.getLineChart(this.$stateParams.processConfigId, this.$stateParams.stage, directionsArr, this.gardenIds, accountId).then(res => {
            this.chartData = res.data;
            let names = [''],
                total = 0,
                values = [''];
            for (var key in this.chartData) {
                total += this.chartData[key].count;
                values.push(this.chartData[key].count);
                names.push(this.chartData[key].taskName);
            }
            names.push('')
            this.numData = values;
            this.xData = names;
            this.totalNum = total;
            // 指定图表的配置项和数据
            this.option = {
                backgroundColor: '#fffff',
                //图标在容器中位置
                grid: {
                    top: '5%',
                    left: '0%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                //x轴
                xAxis: [{
                    type: 'category',
                    name: '阶段',
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    },
                    //X轴文字
                    axisLabel: {
                        onZero: false,
                        interval: 0,
                        formatter: function (val) {
                            //这一块是对下面的文字实现自动换行
                            var resule = val.split('');
                            if (resule.length > 5) {
                                for (var i = 1; i < resule.length; i++) {
                                    if (i % 4 == 0) {
                                        resule.splice(i, 0, "\n");
                                    }
                                }
                            }
                            resule = resule.join('');
                            return resule
                        },
                        textStyle: {
                            color: '#999999',
                            fontSize: 12
                        }
                    },
                    //分割线
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#dbe3ee',
                            type: 'dotted'
                        }
                    },
                    //X轴颜色
                    axisLine: {
                        lineStyle: {
                            color: '#786cec',
                            width: 2,
                        }
                    },
                    data: this.xData
                }],
                yAxis: [{
                    type: 'value',
                    name: '数量',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            color: '#999999',
                            fontSize: 14
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#786cec',
                            width: 2,
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#dbe3ee',
                            type: 'dotted'
                        }
                    },
                }],
                series: [{
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: true,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(120,108,236, 1)'
                                }, {
                                    offset: 0.43,
                                    color: 'rgba(120,108,236,0.68)'
                                },
                                {
                                    offset: 0.68,
                                    color: 'rgba(120,108,236,0.43)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,150,255,0.1)'
                                }
                            ], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 0
                        }
                    },

                    itemStyle: {
                        //修改小点样式
                        normal: {
                            label: {
                                show: true
                            },
                            color: '#786cec',
                            borderColor: 'rgba(120,108,236,0.2)',
                            borderWidth: 12
                        }
                    },
                    data: this.numData
                }, ]
            };
            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
        });
    }
}

disposeStaticsCtrl.$inject = ['AssetDictionaryInterface', 'SelectGarden', '$scope', '$sessionStorage', 'ProjectInterface', 'AssetInterface', '$stateParams']
