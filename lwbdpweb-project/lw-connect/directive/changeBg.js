export default function changeBgDirective(){
    return {
        restrict : 'AE',
        link (scope, element, attrs){
            element[0].onclick = function(){
                var siblings = this.parentNode.children;
                for(var i =0,len= siblings.length;i<len;i++) {
                    siblings[i].className = siblings[i].className.replace("active",'');
                }
                if(!this.className){
                    this.setAttribute("class","active")
                }else{
                    this.setAttribute("class", this.className+" active")
                }
            }
        }
    }
}