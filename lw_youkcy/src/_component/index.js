import { LwSelectNameInstall } from './lwSelectName';
import { LwParkLeftMenuInstall } from './lwParkLeftMenu';
import { LWStudentClassListInstall } from './lwStudentClassList';
import { LWParentSelectChildListInstall } from './lwParentSelectChild';
import { LwModalInstall } from './lwModal';
import { LWParentClassListInstall } from './lwParentClassList';
import { LwProgressInstall } from './lwProgress';
import { LWTeacherListInstall } from './lwParentTeacherList'
/**
 * 组件总入口
 * @param {*} Vue 实例
 */
export const ComponentInit = (Vue) => {
    LwSelectNameInstall(Vue);
    LwParkLeftMenuInstall(Vue);
    LWStudentClassListInstall(Vue);
    LWParentClassListInstall(Vue);
    LWParentSelectChildListInstall(Vue);
    LwModalInstall(Vue);
    LwProgressInstall(Vue);
    LWTeacherListInstall(Vue);
}