/**
 * @Author hejialin
 * @Description 父级表单（公用部分）
 */
export default class baseForm{
    constructor(){
        this.getFormData();
    }

    /**
     * 获取表单数据
     */
    getFormData(){
        if(this.isEdit===undefined){
            this.editForm = this.editForm||{};
            this.editForm.attachments = [];
        }
    }

    /**
     * 保存编辑的数据
     */
    saveAuditInfo(){
        this.$scope.$emit('formData',this.editForm);
        this.$scope.closeThisDialog();
    }
}
