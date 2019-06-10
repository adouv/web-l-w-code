import Vue from 'vue'

export default {
    getAccount() {
        let account = Vue.local.getItem("account");
        if (account) {
            account = JSON.parse(account);
        }
        return account;
    },
    getAccountId() {
        let account = this.getAccount();
        let accountId;
        if (account) {
            accountId = (account).accountId;
        }
        return accountId;
    },
    getGardenId() {
        let account = this.getAccount();
        let gardenId;
        if (account && account.gardens && account.gardens.length > 0) {
            gardenId = account.gardens[0].gardenId;
        }
        return gardenId;
    },
    getSelectClassId(){
        let classId = Vue.local.getItem('selectClassId');
        return classId
    },
    getSelectClassList(){
        let classList = Vue.local.getItem('classesArr');
        if (classList) {
            classList = JSON.parse(classList);
        }
        return classList;
    }
}