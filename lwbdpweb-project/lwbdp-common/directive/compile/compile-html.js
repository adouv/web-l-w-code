/**
 * @Author hejialin
 * @Description 编译html指令
 */
export default class compileHtml{
    constructor($compile){
        this.replace = true;
        this.$compile = $compile;
        this.scope = {
            compileHtml:'='
        };
    }
    
    link(scope,elem,attrs){
        scope.$watch('compileHtml',template=>{
           if(template){
               if(/<[^>]+>/g.test(template)){
                   template = this.$compile('<div class="html-compile">'+template+'</div>')(scope.$parent);
               }
               elem.append(template);
           }
        });
    }
}