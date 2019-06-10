import { lwAntInstall } from './lwAnt/index';
import { lwNavInstall } from './lwNav/index';
import { LwTitleInstall } from './lwTitle/index';
import { lwCardInstall } from './lwCard/index';
import { LwSmallTitleInstall } from './lwSmallTitle/index';
/** 
 * 导出所有组件
 */
export const lwTemplateInstall = (Vue) => {
    lwAntInstall(Vue);
    lwNavInstall(Vue);
    LwTitleInstall(Vue);
    lwCardInstall(Vue);
    LwSmallTitleInstall(Vue);
}