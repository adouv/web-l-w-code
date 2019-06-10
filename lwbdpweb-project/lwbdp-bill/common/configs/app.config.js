/**
 * Created by hejialin on 2016/10/26.
 */
import '../scripts/services/permission.service';
import '../scripts/filters/module.filter';
export default angular.module('lw.config', [
    'lw.filter',
    'lw.permission'
]).name;
