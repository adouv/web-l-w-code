export default {
    // userId,displayName,userInfo,//报错未定义
    getUserInfo(){
        return window.localStorage.getItem("userInfo");
    },
    getUserId(){
        return window.localStorage.getItem("userId");
    },
    getDisplayName(){
        return window.localStorage.getItem("displayName");
    },  
    getGardenId(){
        return window.localStorage.getItem("gardenId");
    }  
}