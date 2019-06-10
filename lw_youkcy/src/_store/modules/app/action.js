import Type from './mutation-type'
/** 
 * 
 */
export default {
    ToggleSideBar: ({ commit }) => {
        commit(Type.TOGGLE_SIDEBAR)
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
        commit(Type.CLOSE_SIDEBAR, withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
        commit(Type.TOGGLE_DEVICE, device)
    }
}