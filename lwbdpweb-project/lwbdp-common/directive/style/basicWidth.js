/**
 * @Author hejialin
 * @Description 表单验证指令
 */

export default class basicWidth {
    constructor() {
        this.scope = {
            watchChange: '='
        };
    }

    link(scope, elem, attr) {
        let bothWidth = () => {
            setTimeout(() => {
                if(document.querySelector('.table_box_right')){
                    let tableAbst = document.querySelector('#tableAbst').offsetWidth;
                    let tableBoxRight = document.querySelector('.table_box_right').offsetWidth;
                    elem[0].style.width = tableAbst + tableBoxRight + 40 + 'px';
                }
            }, 200)

        }
        scope.$watch('watchChange', (change) => {
            if (change) {
                bothWidth()
            }
        })

        setTimeout(() => {
            bothWidth()
        }, 0)

        angular.element(window).on('resize', () => {
            bothWidth()
        });
        angular.element(document.getElementById('normalscreen')).on('click', () => {
            bothWidth()
        })
        angular.element(document.getElementById('fullscreen')).on('click', () => {
            bothWidth()
        })
    }
}
