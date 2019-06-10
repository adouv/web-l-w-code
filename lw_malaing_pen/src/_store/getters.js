/** 
 * getters
 * 派生状态。也就是set、get中的get，有两个可选参数：state、getters分别可以获取state中的变量和其他的getters。
 * 外部调用方式：store.getters.personInfo()。就和vue的computed差不多；
 */
export default {
  name: state => {
    return state.name
  },
  age: state => {
    return state.age
  },
  other: state => {
    return `My name is ${state.name},I am ${state.age}.`
  },
  /**
   * 获取菜单
   */
  sidebarList: state => {
    return state.sidebarList
  },
  winList: state => {
    return state.winList
  },
  onList: state => {
    return state.onList
  },
  personList:state=>{
    return state.personList
  }
}
