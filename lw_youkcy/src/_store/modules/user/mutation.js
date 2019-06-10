import Type from './mutation-type'
/** 
 * 
 */
export default {
    [Type.SET_TOKEN]: (state, token) => {
        state.token = token
    },
    [Type.SET_NAME]: (state, name) => {
        state.name = name
    },
    [Type.SET_AVATAR]: (state, avatar) => {
        state.avatar = avatar
    },
    [Type.SET_ROLES]: (state, roles) => {
        state.roles = roles
    }
}