import Type from './mutation-type'
import {
  login,
  logout,
  getInfo,
  getModuleAdmin
} from '@/api/login'
import {
  setToken,
  removeToken,
  getToken
} from '@/utils/auth'
/** 
 * 
 */
export default {
  // 登录
  Login({
    commit
  }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login(username, userInfo.password).then(response => {
        setToken(response.access_token)
        localStorage.setItem('LWToken', response.access_token)
        commit(Type.SET_TOKEN, response.access_token)
        resolve()
      }).catch(error => {
        reject("请输入正确的用户名或密码！")
      })
    })
  },

  // 获取用户信息
  GetInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response
        localStorage.removeItem('accountArr')
        localStorage.setItem('accountArr', JSON.stringify(response));
        commit(Type.SET_NAME, data.displayName)
        commit(Type.SET_AVATAR, data.imgUrl)
        resolve(response)
        getModuleAdmin(data.accountId).then(res => {
          localStorage.removeItem('roles');
          localStorage.setItem('roles', JSON.stringify(res));
          commit(Type.SET_ROLES, res)
        })

      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取权限信息
  GetAdminInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getModuleAdmin(state.adminId).then(response => {
        const data = response
        //localStorage.setItem('accountArr', JSON.stringify(response));
        commit(Type.SET_ROLES, response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  LogOut({
    commit,
    state
  }) {
    commit(Type.SET_TOKEN, '')
    commit(Type.SET_ROLES, [])
    localStorage.clear()
    removeToken()
  },

  // 前端 登出
  FedLogOut({
    commit
  }) {
    return new Promise(resolve => {
      commit(Type.SET_TOKEN, '')
      removeToken()
      resolve()
    })
  }
}
