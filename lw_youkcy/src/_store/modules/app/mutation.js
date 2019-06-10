import Cookies from 'js-cookie'
import Type from './mutation-type'
/** 
 * 
 */
export default {
    [Type.TOGGLE_SIDEBAR]: state => {
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
    },
    [Type.CLOSE_SIDEBAR]: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 1)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    [Type.TOGGLE_DEVICE]: (state, device) => {
        state.device = device
    }
}