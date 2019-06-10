//import request from '@/utils/request'
import AuthService from "@/_services/auth.service"

export function login(username, password) {
  let params = {
      client_id: 1,
      client_secret: "123",
      scope: "read",
      grant_type: "password",
      type:'local',
      username: username,
      password: password
  }
  return AuthService.sign(params);
  // return request({
  //   url: '/lw-authz-server/oauth/token',
  //   method: 'post',
  //   data: {
  //     username,
  //     password,
  //     client_id: 1,
  //     client_secret: "123",
  //     scope: "read",
  //     grant_type: "password"
  //   }
  // })
}

export function getInfo(token) {
  return AuthService.getAuthInfo();
}

export function getModuleAdmin(adminId){
  let params = {
    adminId: adminId
  }
  return AuthService.getModuleAdmin(params);
}
export function logout() {
  
}
