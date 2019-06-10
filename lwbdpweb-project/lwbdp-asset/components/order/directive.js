/**
 * @Author hejialin
 * @Description 详情页指令
 */
import './detail.css';

class assetDetailCtrl {
    constructor(sidebarService, AssetApplyService, $stateParams, ProjectInterface, AssetInterface, $state, dialogsManager, ngDialog, $location, $scope,$config) {


        this.$state = $state;
        this.$scope = $scope;
        this.dialogsManager = dialogsManager;
        this.$location = $location;
        this.sidebarService = sidebarService;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.AssetApplyService = AssetApplyService;
        this.AssetInterface = AssetInterface;
        this.ngDialog = ngDialog;
        this.$config = $config;
        this.init();
    }

    init() {
        this.paramsInit();
        this.getApplyInfo();
        this.getCrumbList();
        // this.showImg();
        this.fileServerPicPrefix = this.$config.file.SHOWIMG;
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.export = {
            order: true,
            signature: true,
            evidence: true
        };
        this.index = -1;
        this.isDraft = false;
        this.projectId = this.$stateParams.id;
        this.isAll = this.getIsAll();
        this.isAudit = this.getIsAudit();
        this.isEditor = this.getIsEditor();
        !this.isEditor && this.getAttachment();
        this.sidebarId = this.$stateParams.sidebarId;
        this.flag = false;
        this.num = 1;
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getCrumbList(
            moduleAlias.ASSET,
            this.$stateParams.sidebarId, data => {
                this.crumbList = data;
                this.$scope.backUrl = data[data.length - 1].url;
            });
    }

    /**
     * 是否是编辑
     * @return {boolean}
     */
    getIsEditor() {
        return this.$state.current.name.split('.')[1] == 'editor';
    }

    /**
     * 获取详情附件
     */
    getAttachment() {
        this.ProjectInterface.getAttachment(this.$stateParams.id).then(res => {
            this.hasProject = res.data.hasProject === 'true';
            if (res.data.attachments && res.data.attachments[0]) {
                let attachments = this.getTypeAttachments(res.data.attachments);
                this.attachments = this.getNewAttachments(attachments);
            }
        });
    }

    /**
     * 获取带文件类型的附件
     * @param attachments
     * @return {{}}
     */
    getTypeAttachments(attachments) {
        let attachment = {};
        attachments.forEach(att => {
            attachment[att.type] = attachment[att.type] || [];
            attachment[att.type].push(att);
        });
        return attachment;
    }

    /**
     * 获取最新附件
     * @param attachments
     * @return {*}
     */
    getNewAttachments(attachments) {
        for (let type in attachments) {
            let timeAttachment = {},
                maxTime = 0;
            attachments[type].forEach(attachment => {
                if (timeAttachment[attachment.time]) {
                    timeAttachment[attachment.time].push(attachment);
                } else {
                    timeAttachment[attachment.time] = [attachment];
                }
                if (maxTime < attachment.time) {
                    maxTime = attachment.time;
                }
            });
            attachments[type] = timeAttachment[maxTime];
        }
        return attachments;
    }

    /**
     * 面包屑跳转
     * @param url
     */
    goJump(url) {
        this.$location.path(url);
    }

    goEdit(id, isEdit) {
        if (isEdit) {
            this.$state.go('asset.edit', { id: id, sidebarId: this.sidebarId });
        } else {
            this.$state.go('asset.formEdit', { id: id, sidebarId: this.sidebarId });
        }
    }

    /**
     * 是否是全单位收文
     * @return {boolean}
     */
    getIsAll() {
        return this.$stateParams.sidebarId.indexOf('all') > -1;
    }

    /**
     * 是否是审核页面
     * @return {boolean}
     */
    getIsAudit() {
        return this.$state.current.name.indexOf('form') > -1;
    }

    /**
     * 获取申请单详情
     */
    getApplyInfo() {
        this.AssetApplyService.getApplyOrder(
            this.$stateParams.id, data => {
                this.apply = data;
            });
        this.AssetInterface.getAssetAudit(this.$stateParams.id).then(res => {
            this.auditCondition = res.data;
            this.auditCondition.length === 8 ? this.isFinance = true : this.isFinance = false;
        });
    }

    /**
     * 导出pdf
     */
    exportPdf() {
        this.ProjectInterface.exportPdf(
            moduleAlias.ASSET,
            this.$stateParams.id,
            this.export.order,
            this.export.evidence,
            this.export.signature
        )
    }

    /**
     * 返回上一页
     */
    goBack() {
        history.back();
    }

    /**
     * 鼠标滑过出现小手
     */
    verification() {
        angular.element(document.querySelector(".hover")).addClass('JCYhover');
        angular.element(document.querySelectorAll(".trhover")).addClass('JCYtrhover');
    }

    /**
     * 点击使用年限出现弹窗
     */
    showYear() {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this.ngDialog.open({
            disableAnimation: true,
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../showDialog/yearLimit/auditAgeLimit.html'),
            plain: true,
            controller: 'auditAgeLimitCtrl',
            controllerAs: 'auditAgeLimit',
            scope: this.$scope,
            onOpenCallback: () => {
                console.log(52)
            }
        })
    }

    /**
     * 点击关闭
     */
    visibility(flag) {
        angular.element(document.querySelector("#infoPos")).css({
            "visibility": "hidden"
        });
        this.flag = false;
    }

    /*
    点击弹窗*/
    stopPropagation() {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
    }

    findAuditArea(id, idTarget) {
        let targetElement = angular.element(document.querySelector(id));
        angular.element(document.querySelector(idTarget)).removeClass('bor_dashed');
        let main_content = document.querySelector('.main_content');
        main_content.scrollTop = getAbsPoint(targetElement[0]).y;

        function getAbsPoint(e) {
            let x = e.offsetLeft;
            let y = e.offsetTop;
            while (e = e.offsetParent) {
                x += e.offsetLeft;
                y += e.offsetTop;
            }
            return { 'x': x, 'y': y };
        };
    }

    /**
     * 点击出现遮罩层
     */
    showImg(flag, index, detail) {

        this.flag = true;
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        if (this.index == -1 || this.index == index) {
            this.flag = !flag;
        }
        this.index = index;
        if (this.flag) {
            let taskID = document.querySelectorAll('.trhover'),
                tasked = document.querySelector("#infoPos");

            function getElementTop(elem) {
                var elemTop = elem.offsetTop; //获得elem元素距相对定位的父元素的top　　
                elem = elem.offsetParent; //将elem换成起相对定位的父元素　　
                while (elem != null) { //只要还有相对定位的父元素 
                    //获得父元素 距他父元素的top值,累加到结果中　　　
                    elemTop += elem.offsetTop;　　　　 //再次将elem换成他相对定位的父元素上;              　　　　
                    elem = elem.offsetParent;
                }
                return elemTop;
            }
            let Y = getElementTop(taskID[this.index]) + 40 - 22 - 88 + 'px';
            angular.element(document.querySelector("#infoPos")).css({
                "visibility": "visible",
                "position": "absolute",
                top: Y,
            })
        } else {
            angular.element(document.querySelector("#infoPos")).css({
                "visibility": "hidden"
            })
        }

        let originAttachment = this.apply.originalEvidenceList;
        let assetAttachment = this.apply.batchAssetEvidenceList;

        this.applyAttachments = this.apply.applyEvidenceList[0].attachmentList;
        this.originAttachments = this.getAttachments(originAttachment, detail.assetNo);
        this.assetAttachments = this.getAttachments(assetAttachment, detail.assetNo);
    }

    getAttachments(attachments, assetNo) {
        for (let data of attachments) {
            if (data.assetNos.indexOf(assetNo) > -1) {
                return data.attachmentList;
            }
        }
    }

}

assetDetailCtrl.$inject = ['sidebarService', 'AssetApplyService', '$stateParams', 'ProjectInterface', 'AssetInterface', '$state', 'dialogsManager', 'ngDialog', '$location', '$scope','$config'];
export default class assetProjectDetail {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.template = require('./detail.html');
        this.controller = assetDetailCtrl;
        this.controllerAs = 'assetDetail';
    }
}
