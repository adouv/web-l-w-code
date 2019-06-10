export default function selectImageDirective(dialogsManager) {
    return {
        scope: {
            imgurl: '=',
            name: "="
        },
        restrict: 'A',
        link(scope, element, attrs) {
            element[0].onchange = function (e) {
                
                // scope.imgurl = null;
                // let url = '';
                // let elem = element[0];
                // if (navigator.userAgent.indexOf("MSIE")>=1) { // IE 
                //     url = elem.value; 
                // } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox 
                //     scope.name = elem.files.item(0).name;
                //     url = window.URL.createObjectURL(elem.files.item(0)); 
                // } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome
                //     scope.name = elem.files.item(0).name;
                //     url = window.URL.createObjectURL(elem.files.item(0)); 
                // } 
                // scope.imgurl = url;
                var elem = element[0];
                var files = e.target.files;
                var fileReader = new FileReader();

                var file = files[0];
                if (!/image\/\w+/.test(file.type)) {
                    dialogsManager.showMessage('上传文件格式不正确，请选择jpg、png、gif、jpeg格式的文件！', {
                        className: 'warning'
                    });
                    elem.value = '';
                    return false;
                } else {
                    fileReader.readAsDataURL(files[0]);
                    fileReader.onload = function (e) {
                        
                        scope.imgurl = this.result;
                        
                    };
                }
               
            }
        }
    }
}