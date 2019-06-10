import Vue from 'vue'

export default {
    getAccount() {
        let account = Vue.local.getItem("accountArr");
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
    getRoles() {
        let roles = Vue.local.getItem("roles");
        if (roles) {
            roles = JSON.parse(roles);
        }
        return roles;
    },
    getRolesAll() {
        let roles = Vue.local.getItem("rolesAll");
        if (roles) {
            roles = JSON.parse(roles);
        }
        return roles;
    },
}