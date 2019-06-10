import LwAddExerciseComponent from './index'
export const LwAddExerciseInstall = (Vue) => {
    const Constructor = Vue.extend(LwAddExerciseComponent);
    Vue.component('lw-add-exercise', Constructor);
}