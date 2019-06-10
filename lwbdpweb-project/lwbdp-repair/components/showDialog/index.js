import 'angular-popups';
import chooseFundNumber from './chooseFundNumber/chooseFundNumber.directive';
import repairType from './repairType/repairType.directive';
import outlayFrom from './editAudit/editAudit.directive';
export default angular.module('showDialog',['angular-popups'])
    .directive('chooseFundNumber',chooseFundNumber)
    .directive('repairType',repairType)
    .directive('outlayFrom',outlayFrom)
    .name;
