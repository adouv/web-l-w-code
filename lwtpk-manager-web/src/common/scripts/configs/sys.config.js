/**
 * Created by hejialin on 2017/1/5.
 */
window.sys_config = {
    "path":{
        "path": "/lwtpk-web",
        "basePath": "/lwtpk-web",
        "fileServer": "/lw-fileserver",
        "pic_prefix": "/fs/file/showPic?fileName=",
        "download_prefix": "/fs/file/download?fileName="
    },
    "auth2":{
        "isOAuth2": false,
        "auth2LoginUrl":"http://58.133.250.123/oauth2/authorize?clientId=8960605914&response_type=code&returnUrl=http://58.133.250.142/login",
        "auth2LogoutUrl":"http://58.133.250.123/Account/login?logoff=logoff&clientId=8960605914&returnUrl=http://58.133.250.142/login"
    },
    "modules":{
        "countModules":["noticeAccount","meetingnotice","internalMeetingNotice","carbooking","planSummaryTask","petitionLetter","repair","attendance","documentsend","document","schedule","report"]
    }
};