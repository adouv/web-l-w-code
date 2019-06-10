/**
 * @Author hejialin
 * @Description 处置外置表单
 */
export default class disposeFrom{
    constructor(){
        this.restrict = 'E';
        this.replace = true;
        this.scope = {
            disposeData:'='
        };
    }
    
    link(scope,elem,attrs){
        console.log(scope.disposeData)
    }
    
}