import Vue from 'vue'
import {mapActions} from 'vuex'
/** 
 * 全局状态管理
*/
export default{
    setTabbar(status){
        this.SetShow(status);
    },
    ...mapActions(["SetShow"])
}