export default class basicLibraryInfoCtrl {
    constructor(ProjectInterface, $stateParams) {
        this.ProjectInterface = ProjectInterface;
        this.$stateParams = $stateParams;
        this.init();
    }
    init() {
        this.getList();
    }

    getList() {
        this.ProjectInterface.getApplicationDetail(moduleAlias.ASSET, this.$stateParams.id).then(res => {
            this.pageList = res.data;
        })
    }
}
basicLibraryInfoCtrl.$inject = ['ProjectInterface', '$stateParams'];