/**
 * ElementService
 * 页面元素服务
 */
const ScreenSize = 768

export default {
    contentToggle($event, sidebarList) {
        let hasClass = this.bodyHasClass('sidebar-collapse')
        let windowWidth = window.innerWidth
        if (windowWidth < ScreenSize) {
            this.bodyRemoveClass('sidebar-open')
        }

        if (hasClass) {
            sidebarList.forEach(element => {
                element.isSubShow = false
            })
        }
    },
    /**
     * 左侧菜单收缩
     * @param {*} $event 事件
     * @param {*} ScreenSize 屏幕宽度
     */
    sidebarToggle($event) {
        let hasClass = this.bodyHasClass('sidebar-collapse') || this.bodyHasClass('sidebar-open')

        let windowWidth = window.innerWidth

        if (hasClass) {
            if (windowWidth > ScreenSize) {
                this.bodyRemoveClass('sidebar-collapse')
            } else {
                this.bodyRemoveClass('sidebar-open')
            }
        } else {
            if (windowWidth > ScreenSize) {
                this.bodyAddClass('sidebar-collapse')
            } else {
                this.bodyAddClass('sidebar-open')
            }
        }
    },
    /**
     * 判断body是否包含某个样式
     * @param {*} className 样式名称
     */
    bodyHasClass(className) {
        return document.body.className.indexOf(className) > -1
    },
    /**
     * 给body添加样式
     * @param {*} className 样式名称 
     */
    bodyAddClass(className) {
        let classList = document.body.className.split(' ')
        if (classList !== null) {
            classList.push(className)
        }
        document.body.className = classList.join(' ')
    },
    /**
     * 移除body的某个样式
     * @param {*} className 样式名称 
     */
    bodyRemoveClass(className) {
        let classList = document.body.className.split(' ')
        if (classList !== null) {
            document.body.className = classList
                .filter((value, index, array) => {
                    return value !== className
                })
                .join(' ')
        }
    },
    /**
     * 移除打印提示会话框
     *
     */
    removeLodopMessageDocument() {
        this.bodyRemoveClass("td-lodop-message");
    }
}