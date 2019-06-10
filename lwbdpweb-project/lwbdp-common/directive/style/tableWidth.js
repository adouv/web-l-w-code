export default class tableWidth {

    constructor() {
        this.scope = {}
    }

    link(scope, ele, attr) {
        setTimeout(() => {
            let td = angular.element(ele[0]).find('td');
            let th = angular.element(document.getElementById('theadTh')).find('th');
            for (let i = 0; i < td.length; i++) {
                if (th[i].width) {
                    td[i].style.width = th[i].width
                }
            }
        }, 200)
        // setTimeout(() => {
        //     tableAutoWidth();
        // }, 200)
        // angular.element(window).on('resize', () => {
        //     tableAutoWidth()
        // });
    }
}