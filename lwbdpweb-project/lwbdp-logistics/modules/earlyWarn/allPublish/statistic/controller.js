import './statistic.css'
import echarts from 'echarts';
export default class statisticCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, dialogsManager,lwGardenService,SelectGarden) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.dialogsManager = dialogsManager;
        this.gardenService = lwGardenService;
        this.SelectGarden = SelectGarden;
        this.init();
    }
    init(){
        // 获取当前用户所在园区
        this.currentGarden = this.$sessionStorage.get('currentGarden');
        this.account = this.$sessionStorage.get('account');
        // 被选中园区的id
        this.gardenIds = this.currentGarden.gardenId;
        // 被选中的园区列表(默认显示当前园区)
        this.selectedGarden = [this.currentGarden];
        // 只统计由我发起的项目
        this.isMyApply = false;
        //初始化查询参数
        this.initParams();
        // 初始化折线图
        this.initChart();
        // 生成折线图
        this.getChart();
        // 根据屏幕宽度生成折线图
        this.resizeWidth();
        //接收高级查询条件参数
        this.receiveChildData();
    }

    initParams(){
        // 项目查询条件对象
        this.condition = {};

    }

    receiveChildData(){
        this.$scope.$on("childCondition", (scope, data) => {
            this.condition = angular.copy(data);
            for (let key in data) {
                if (data[key] !== '' && (key != 'sideBarCode')) {
                    this.isShowCancel = true;
                    break;
                }
            }
            this.getChart();
        })
    }

    // 初始化折线图
    initChart() {
        this.myChart = echarts.init(document.getElementById('mychart'));
        // 点击折线图上的点
        this.myChart.on('click', res => {
            let idx = res.dataIndex - 1;
            this.selectedType = this.chartData[idx].id;
            this.DialogTitle = this.chartData[idx].name;
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

    // 生成折线图
    getChart() {
        let accountId = null;
        let gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        /**
         * urgencyLevel, gardenIds, publishStatus, accountId, startTime, endTime ,accountName
         */
        this.logisticsInterface.getChart(
            this.condition.urgencyLevel,
            gardenIds,
            this.condition.publishStatus,
            accountId,
            this.condition.startTime,
            this.condition.endTime,
            this.condition.accountName,
            this.condition.gardenName
        ).then(res => {
            this.chartData = res.data;
            let names = [''],
                total = 0,
                values = [''];
            for (let key in this.chartData) {
                total += this.chartData[key].count;
                values.push(this.chartData[key].count);
                names.push(this.chartData[key].name);
            }
            names.push('');
            this.numData = values;
            this.xData = names;
            this.totalNum = total;
            // 指定图表的配置项和数据
            this.option = {
                backgroundColor: '#fffff',
                // 折线图位置
                grid: {
                    top: '5%',
                    left: '0%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                // x轴设置
                xAxis: [{
                    type: 'category', //坐标轴类型,类目型,可以通过data设置数据
                    name: '预警类别',  //坐标轴名称
                    boundaryGap: false, //禁止坐标轴两侧留白
                    // 坐标轴是否显示刻度
                    axisTick: {
                        show: false
                    },
                    // 坐标轴刻度标签
                    axisLabel: {
                        // 刻度标签的显示间隔
                        interval: 0,
                        // 刻度标签的内容格式器
                        formatter: function (val) {
                            // 对下面的文字实现自动换行
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
                        // 刻度标签的字体样式
                        textStyle: {
                            color: '#999999',
                            fontSize: 12
                        }
                    },
                    // 坐标轴轴线
                    axisLine: {
                        lineStyle: {
                            color: '#786cec',
                            width: 2,
                        }
                    },
                    // 坐标轴分割线
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#dbe3ee',
                            type: 'dotted'
                        }
                    },
                    // 类目数据
                    data: this.xData
                }],
                // y轴设置
                yAxis: [{
                    type: 'value',
                    name: '数量',
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        // 刻度标签与轴线之间的距离
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
                // 图表设置
                series: [{
                    type: 'line',
                    smooth: true,   //平滑曲线展示
                    symbol: 'circle', //标记的图形:圆圈
                    symbolSize: 5, //标记的大小
                    showSymbol: true, //显示标记
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
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
                                }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 0
                        }
                    },
                    itemStyle: {
                        //修改小点样式
                        normal: {
                            label: {show: true},
                            color: '#786cec',
                            borderColor: 'rgba(120,108,236,0.2)',
                            borderWidth: 12
                        }
                    },
                    data: this.numData
                },]
            };
            // 使用刚指定的配置项和数据显示图表。
            this.myChart.setOption(this.option);
        })
    }

    // 根据屏幕宽度生成折线图
    resizeWidth() {
        let width = document.querySelector('.main_in').offsetWidth;
        width = width > 1050 ? width : 1050;
        this.myChart.resize(
            {width: width}
        );
    }

    // 选择园区
    chooseGarden() {
        if (!this.isMyApply) {
            // 查询园区列表,并默认选中当前用户的园区
            this.SelectGarden.dialog({ids: this.gardenIds}, garden => {
                this.gardenIds = garden.ids.toString();
                this.selectedGarden = garden.gardenList;
                this.getChart();
            })
        }
    }

    //配置分页
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(this.selectedType, offset, size, (noticeList, totalItems) => {
                    this.noticeList = noticeList;
                    this.paginationConf.totalItems = totalItems;
                });
            }
        };
    }

    // 查询列表
    getList(type ,offset, size, callback) {
        let accountId = null;
        let gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        /**
         * boxType, type, urgencyLevel, gardenIds, publishStatus, startTime, endTime, condition, keywords, gardenName, accountId, dealStatus, accountName, offset, size
         */
        this.logisticsInterface.getNoticeList(
            this.$stateParams.sideBarCode,
            type,
            this.condition.urgencyLevel,
            gardenIds,
            this.condition.publishStatus,
            this.condition.startTime,
            this.condition.endTime,
            null,
            null,
            null,
            accountId,
            null,
            this.condition.accountName,
            offset,
            size
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }

    getMoreSearch() {
        this.ngDialog.open({
            disableAnimation: true,
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../../../../components/search/search.html'),
            plain: true,
            controller: 'moreSearchCtrl',
            controllerAs: 'moreSearch',
            scope: this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast("parentCondition", this.condition);
                this.$scope.$broadcast("hideType", true);
            }
        })
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.condition.gardenIds = this.gardenIds;
        // this.paginationConf.onChange(0, 15);
        this.getChart();
    }

    goBack(){
        this.$state.go('logistics.warn.list',{sideBarCode:this.$stateParams.sideBarCode});
    }

    exportStatistic(){
        let accountId = null;
        let gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        this.logisticsInterface.exportNoticeExcel(
            this.$stateParams.sideBarCode,
            this.selectedType,
            this.condition.urgencyLevel,
            gardenIds,
            this.condition.publishStatus,
            this.condition.startTime,
            this.condition.endTime,
            this.getCondition(),
            accountId,
            this.condition.accountName
        )
    }

    /**
     * 判断查询条件
     */
    getCondition() {
        let condition = '';
        if (this.condition.startTime && this.condition.endTime) {
            condition += "发送时间:" + this.condition.startTime + "-" + this.condition.endTime + "；";
        }
        if (this.selectedGarden && this.selectedGarden.length > 0) {
            let name = "";
            this.selectedGarden.forEach(v => {
                name += v.gardenName||v.name + "；";
            })
            condition += "参统学校(机关):" + name;
        }
        if (this.condition.urgencyLevel) {
            condition += "紧急程度:" + this.condition.urgencyLevelName + "；";
        }
        if (this.condition.publishStatus) {
            condition += "发送状态:" + this.condition.publishStatusName + "；";
        }
        if (this.condition.accountName) {
            condition += "发送人:" + this.condition.accountName + "；";
        }
        return condition;
    }
}
statisticCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'dialogsManager','lwGardenService','SelectGarden'];
