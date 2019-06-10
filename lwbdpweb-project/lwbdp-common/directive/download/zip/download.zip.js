/**
 * @Author hejialin
 * @Description 打包下载
 */

export default class downloadZip{
    constructor($config){
        this.$config = $config;
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            downloadZip:'='
        }
    }
    
    link(scope,elem,attrs){
        let params = '?zipName='+attrs.zipName+'.zip';
        if(scope.downloadZip.length>0){
            scope.downloadZip.forEach(attachment=>{
                params += '&fileName='+attachment.url+'&name='+attachment.name;
            })
        }
        elem.on('click',()=>{
            location.href = this.$config.file.DOWNLOADZIP+params;
        })
    }
    
}