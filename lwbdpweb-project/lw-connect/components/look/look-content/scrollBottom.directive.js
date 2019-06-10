export default function scrollBottomDirective(){
    return {
        restrict : "AE",
        link($scope,elem,attrs){
            let listBox = document.querySelector("#content_list");
            let content = document.querySelector("#content");
            let timer = null,
            inputTimer = null;
            setTimeout(function(){
                listBox.scrollTop= listBox.scrollHeight;
            },5)
        }
    }
}