import 'angular-popups';
import chooseKindReason from './chooseKindReason/chooseKindReason.directive';
import addConfig from './addAssetConfig/addAssetConfig.directive';
import dealDispose from './dealDispose/dealDispose.directive';
import auditAgeLimitCtrl from './yearLimit/auditAgeLimit';

import chooseRelationAsset from './chooseRelationAsset/chooseRelationAsset.directive';
import editAudit from './editAudit/editAudit.directive';
export default angular.module('showDialogModule', ['angular-popups'])
    .directive('chooseKindReason', chooseKindReason)
    .directive('addConfig', addConfig)
    .directive('dealDispose', dealDispose)
    .directive('editAudit', editAudit)
    .directive('chooseRelationAsset', chooseRelationAsset)
    .controller('auditAgeLimitCtrl', auditAgeLimitCtrl)
    .name;