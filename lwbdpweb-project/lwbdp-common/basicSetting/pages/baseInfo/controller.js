import './baseInfoTemplate.css'
export default class baseInfoTemplateCtrl {
    constructor($scope,ngDialog,BaseInfoTemplateInterface) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.BaseInfoTemplateInterface = BaseInfoTemplateInterface;
        this.init();
    }
    init() {
        this.initParam();
        this.getModules();

        this.$scope.$on('names', (event,data)=> {
            this.getTitles(this.module);
        });
    }
    initParam(){
        this.visibleTitles = [];
        this.invisibleTitles = [];
    }

    /**
     * 获取所有的模块
     */
    getModules() {
        this.BaseInfoTemplateInterface.getModules().then(res => {
            this.modules = res.data;
            this.module = res.data[0];
            this.moduleCode = this.module.itemValue;
            this.moduleName = this.module.itemName;
            this.getTitles(res.data[0]);
        })
    }



    /**
     * 根据模块获取所有的头
     * @param module
     */
    getTitles(module) {
        this.moduleCode = module.itemValue;
        this.moduleName = module.itemName;
        this.BaseInfoTemplateInterface.getTitles(this.moduleCode).then(res => {
            this.titles = res.data;
            this.visibleTitles = [];
            this.invisibleTitles = [];
            this.getVisibleTitles(this.titles);
            this.getInvisibleTitles(this.titles);
        })

    }

    /**
     * 获取可见项
     * @param titles
     */
    getVisibleTitles(titles){
        for(let title of titles){
            if(title.visible){
                this.visibleTitles.push(title);
            }
        }

    }

    /**
     * 获取不可见项
     * @param titles
     */
    getInvisibleTitles(titles){
        for(let title of titles){
            if(!title.visible){
                this.invisibleTitles.push(title);
            }
        }
    }




    /**
     * 左箭头
     * @param titles
     * @param index 当前索引
     */
    toLeft(titles,index){
        let temp = titles[index];
        if(index==0){
            this.BaseInfoTemplateInterface.setMax(this.moduleCode,titles[index].id).then(()=>{
                titles.splice(0,1);
                titles.push(temp);
            });
        }else{
            titles[index] = titles[index-1];
            titles[index-1] = temp;
            this.BaseInfoTemplateInterface.exchange(titles[index].id, titles[index-1].id);
        }
    }

    /**
     * 右箭头
     * @param titles
     * @param index 当前索引
     */
    toRight(titles,index){
        let temp = titles[index];
        if((titles.length-1)==index){
            this.BaseInfoTemplateInterface.setMin(this.moduleCode,titles[index].id).then((res)=>{
                titles.pop();
                titles.unshift(temp);
            });
        }else{
            titles[index] = titles[index+1];
            titles[index+1] = temp;
            this.BaseInfoTemplateInterface.exchange(titles[index].id, titles[index+1].id);
        }

    }



    /**
     * 根据关键字检索
     * @param titles  要检索的所有
     * @param keyWords 关键字
     */
    search(titles,keyWords){
        keyWords = keyWords || '';
        for(let title of titles){
            if(title.name.indexOf(keyWords)<0){
                title.hidden = true;
            }else {
                title.hidden = false;
            }
        }

    }
    /*
    * 添加
    * */
    goAdd(){
        this.ngDialog.open({
            disableAnimation:true,
            closeByDocument: false,
            className: 'bdp layer_fixed_little',
            template: require('../../directives/baseInfo/addBaseInfo/addBaseInfo.html'),
            plain: true,
            controller: 'addBaseInfoCtrl',
            controllerAs: 'addBaseInfo',
            scope: this.$scope,
            onOpenCallback:()=>{
                this.$scope.$broadcast('module', this.moduleCode);
            }
        })
    }

    /*
   * 编辑
   * */
    goEdit(id,name){
        this.ngDialog.open({
            disableAnimation:true,
            closeByDocument: false,
            className: 'bdp layer_fixed_little',
            template: require('../../directives/baseInfo/editBaseInfo/editBaseInfo.html'),
            plain: true,
            controller: 'editBaseInfoCtrl',
            controllerAs: 'editBaseInfo',
            scope: this.$scope,
            onOpenCallback:()=>{
                this.$scope.$broadcast('module', {
                    moduleCode:this.moduleCode,
                    id:id,
                    name:name,
                    titles:this.titles
                });
            }
        })
    }

    /*
    * 批量管理
    * */
    batchManage(){
        this.ngDialog.open({
            disableAnimation:true,
            closeByDocument: false,
            className: 'bdp layer_fixed_little',
            template: require('../../directives/baseInfo/batchManage/batchManage.html'),
            plain: true,
            controller: 'batchManageCtrl',
            controllerAs: 'batchManage',
            scope: this.$scope,
            onOpenCallback:()=>{
                this.$scope.$broadcast('module', {
                    moduleCode:this.moduleCode,
                    moduleName:this.moduleName
                });
            }
        })
    }


    /**
     * 将可见项变成不可见项
     * @param title  要移除的元素
     * @param $index 索引
     * 不传参默认移除所有
     */
    toInvisible(title,$index){
        let toChangeTitles = [];
        if(!title){
            toChangeTitles = angular.copy(this.visibleTitles);
            this.invisibleTitles = this.invisibleTitles.concat(this.visibleTitles);
            this.visibleTitles = [];
        }else{
            this.visibleTitles.splice($index,1);
            this.invisibleTitles.push(title);
            toChangeTitles.push(title);
        }
        this.BaseInfoTemplateInterface.changeVisible(toChangeTitles,false);
        //this.changeVisible(this.visibleTitles,this.invisibleTitles,$index,false);
    }


    //TODO 这个方法提取完不起作用
    changeVisible(source,target,$index,visible){
        let toChangeTitles = [];
        if(!title){
            toChangeTitles = angular.copy(source);
            target = target.concat(source);
            source = [];
        }else{
            source.splice($index,1);
            target.push(source[$index]);
            toChangeTitles.push(title);
        }
        this.BaseInfoTemplateInterface.changeVisible(toChangeTitles,visible)
    }


    /**
     * 将不可见项变成可见项
     * @param title  要移除的元素
     * @param $index 索引
     * 不传参默认移除所有
     */
    toVisible(title,$index){
        let toChangeTitles = [];
        if(!title){
            toChangeTitles = angular.copy(this.invisibleTitles);
            this.visibleTitles = this.visibleTitles.concat(this.invisibleTitles);
            this.invisibleTitles = [];
        }else {
            this.invisibleTitles.splice($index,1);
            this.visibleTitles.push(title);
            toChangeTitles.push(title);
        }
        this.BaseInfoTemplateInterface.changeVisible(toChangeTitles,true)
    }



}
baseInfoTemplateCtrl.$inject = ['$scope','ngDialog','BaseInfoTemplateInterface'];
