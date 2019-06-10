/**
 * Created by lw-yf-025 on 2017/3/15.
 */

export default function routing($locationProvider,$stateProvider,$configProvider,w5cValidatorProvider,dialogsManagerProvider) {
    if(!$configProvider.$get().HOST){
        $locationProvider.html5Mode({enabled: true, requireBase: false });
    }
    let dialogsManager = dialogsManagerProvider.$get();
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: (elem,errorMessage)=>{
            if(elem[0]){
                angular.element(elem[0]).removeClass('error');
            }else if(errorMessage=='该选项不能为空'){
                dialogsManager.showMessage('存在必填项未填写，请填写后再提交！', { className: 'warning' });
                let scrollDom = document.querySelector('.main_content')||document.querySelector('.w5c-auto');
                if(scrollDom)scrollDom.scrollTop = elem.scrollTop + 'px';
            }
            return false;
        },
        removeError: true
    });
    
    $stateProvider.state('login',{
        url:'/login',
        template:require('./login/login.html'),
        controller:'loginCtrl',
        controllerAs:'login'
    }).state('entry',{
        url:'/entry',
        template:require('./login/entry.html'),
        controller:'entryCtrl',
        controllerAs:'entry'
    }).state('upload',{
        url:'/upload',
        template:require('./upload.html'),
        controller:function($scope){
            $scope.path = '/lwbdp-web/baseInfo/import';// 写到interface中
            $scope.submitData = (params)=>{
                angular.extend(params,this.data)
                console.log(params,this.data)
            }
            $scope.submitSuccess = (data)=>{
                console.log(data)
            }
        },
        controllerAs:'upload'
    })
}
routing.$inject = ['$locationProvider','$stateProvider','$configProvider','w5cValidatorProvider','dialogsManagerProvider'];
