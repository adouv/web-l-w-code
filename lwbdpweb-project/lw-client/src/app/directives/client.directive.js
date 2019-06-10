/**
 * @Author hejialin
 * @Description 客户端指令
 */

class clientDrag {
    constructor(clientService) {
        this.replace = true;
        this.clientService = clientService;
    }

    link(scope, elem, attrs) {
        if(this.clientService.isClient()){
            let win = this.clientService.win;
            let $win = window;
            let $nav = elem[0];
            let dragging = false;
            let mouse_x, mouse_y;
            let win_x, win_y;
            $nav.onmousedown = function (e) {
                e = e.originalEvent || e;
                dragging = true;
                mouse_x = e.screenX;
                mouse_y = e.screenY;
                win_x = win.x;
                win_y = win.y;
            };
    
            $win.onmousemove = function (e) {
                if (!dragging) return;
                win.x = win_x + (e.screenX - mouse_x);
                win.y = win_y + (e.screenY - mouse_y);
            };
    
            $win.onmouseup = function () {
                dragging = false
            };
        }
    }
}

export default angular.module('client.directive', [])
    .directive('clientDrag', (clientService) => new clientDrag(clientService))
    .name
