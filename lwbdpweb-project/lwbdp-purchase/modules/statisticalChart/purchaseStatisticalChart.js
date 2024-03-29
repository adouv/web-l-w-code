/**
 * Created by lw-yf-011 on 2017/6/23.
 */
import './statisticalChart.css'
import echarts from 'echarts';
export default class purchaseStatisticalChartCtrl {
    constructor($sessionStorage, SelectGarden, repairService, dialogsManager, $scope, $stateParams, ProjectInterface,purchaseService) {
        this.SelectGarden = SelectGarden;
        this.$sessionStorage = $sessionStorage;
        this.repairService = repairService;
        this.dialogsManager = dialogsManager;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.purchaseService = purchaseService;
        this.init();
    }

    init() {
        // 获取当前用户所在园区 
        this.currentGarden = this.$sessionStorage.get('currentGarden');
        this.account = this.$sessionStorage.get('account');
        // 被选中园区的id
        this.gardenIds = this.currentGarden.gardenId;
        // 被选中的园区列表(默认显示当前园区)
        this.selectedGarden = [this.currentGarden];
        // 只统计由我发起的项目
        this.isMyApply = false;
        // 判断进入那个阶段的储备库
        this.stage = this.$stateParams.stage;
        // 流程配置ID
        this.processConfigId = this.$stateParams.processConfigId;
        this.searchGardenIds = [];
        //初始化查询参数
        this.initParam();
        // 初始化折线图
        this.initChart();
        // 生成折线图
        this.getChart();
        // 根据屏幕宽度生成折线图
        this.resizeWidth();
    }

    initParam(){
        // 项目查询条件对象
        this.condition = {};
        this.condition.categoryList = [];
        this.condition.keywords = "";
    }

    // 选择园区
    chooseGarden() {
        if (!this.isMyApply) {
            // 查询园区列表,并默认选中当前用户的园区
            this.SelectGarden.dialog({ids: this.gardenIds}, garden => {
                this.gardenIds = garden.ids;

                this.selectedGarden = garden.gardenList;
                this.getChart();
            })
        }
    }

    // 初始化折线图
    initChart() {
        this.myChart = echarts.init(document.getElementById('mychart'));
        // 点击折线图上的点
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

    closeDialog(){
        this.applyList=[];
        this.showDialog=false;
        this.hasSearch = false;
    }

    // 生成折线图
    getChart() {
        var accountId = null;
        var gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        if(this.searchGardenIds&&this.searchGardenIds.length>0){
            accountId = null;
            gardenIds = this.searchGardenIds;
        }
        //TODO：wuh 第一个null是流程配置ID，第二个null是阶段名称
        this.ProjectInterface.getLineChart(this.processConfigId, this.stage, this.condition.categoryList, gardenIds, accountId,this.condition.applyYearStart,this.condition.applyYearEnd).then(res => {
            this.chartData = res.data;
            let names = [''],
                total = 0,
                values = [''];
            for (let key in this.chartData) {
                total += this.chartData[key].count;
                values.push(this.chartData[key].count);
                names.push(this.chartData[key].taskName);
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
                    name: '阶段',  //坐标轴名称
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

    //配置分页
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(this.selectedTaskKey, offset, size, (applyList, totalItems) => {
                    this.applyList = applyList;
                    this.hasSearch = true;
                    this.paginationConf.totalItems = totalItems;
                });
            }
        };
    }

    getMoreSearch(module) {
        this.purchaseService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            this.condition.keywords = '';
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            let isShowCancle = false;
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    isShowCancle = true;
                    break;
                }
            }
            this.isShowCancel = isShowCancle;
            this.searchGardenIds = this.condition.gardenIds
            this.getChart();
        },null,null,true);
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.condition.gardenIds = this.gardenIds;
        this.searchGardenIds = [];
        // this.paginationConf.onChange(0, 15);
        this.getChart();
    }

    // 查询列表
    getList(taskKey,offset, size, callback) {
        this.taskKey = taskKey;
        var accountId = null;
        var gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        if(this.searchGardenIds&&this.searchGardenIds.length>0){
            accountId = null;
            gardenIds = this.searchGardenIds;
        }
        this.ProjectInterface.getProjectLibrary(moduleAlias.PURCHASE, this.processConfigId, this.condition.proSta, this.stage,taskKey, gardenIds,this.condition.categoryList,  this.condition.keywords, offset, size , accountId,this.condition.applyYearStart,this.condition.applyYearEnd).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let waitdealcount = res.headers()['waitdealcount'];
            let finishcount = res.headers()['finishcount'];
            callback(res.data, totalItems, waitdealcount, finishcount);
        }, err => {
            let msg = err.data.error_description;
            this.dialogsManager.showMessage(msg, {
                className: 'error'
            });
        });
    }

    export(){
        var accountId = null;
        var gardenIds = this.gardenIds;
        if(this.isMyApply){
            accountId = this.account.accountId;
            gardenIds = this.currentGarden.gardenId;
        }
        if(this.searchGardenIds&&this.searchGardenIds.length>0){
            accountId = null;
            gardenIds = this.searchGardenIds;
        }
        this.ProjectInterface.exportCharExcel(moduleAlias.PURCHASE, this.processConfigId, gardenIds,this.stage,this.condition.categoryList,this.taskKey, accountId,this.condition.applyYearStart,this.condition.applyYearEnd);
    }
}
purchaseStatisticalChartCtrl.$inject = ['$sessionStorage', 'SelectGarden', 'repairService', 'dialogsManager', '$scope', '$stateParams', 'ProjectInterface','purchaseService'];
