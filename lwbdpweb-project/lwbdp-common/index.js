/**
 * @Author hejialin
 * @Description 描述
 */
import './styles/dialog.css';
import './styles/list-table.css'

import basicSetting from './basicSetting/index';
import sidebar from './components/sidebar/sidebar.directive';
import {bdpUploadFile,fileUploadRemove} from './components/fileupload/directive';
import sidebarService from './components/sidebar/sidebar.service';
import bdpInterface from './services/bdp.interface';
import workflow from './components/workflow/index';
import workflowInterface from './services/workflow.interface';
import projectInterface from './services/project.interface';
import ProjectService from './services/project.service';
import processAlias from  './services/bdp.config';
import basicConfigInterface from './services/bdp.basic.config.interface';
import workflowConfigInterface from './services/bdp.workflow.config.interface';
import picView from './components/picView/picView.directive';
import instructions from './components/instructions/instructions.directive';

import processConfigService from './basicSetting/pages/process.config.service';

//指令
import solidTree from  './directive/dialog/solidTree'
import flatTree from './directive/dialog/flatTree'
import Laydate from './components/laydate';
import compileHtml from './directive/compile/compile-html';
import downloadZip from './directive/download/zip/download.zip';
import auditForm from './components/audit/auditForm';
import importFile from './components/import/controller';
import formSubmitValid from './directive/form/valid/directive';
import {formUpload,fileBtn,fileSure,fileRemove} from './directive/form/upload/directive'
import autoWidth from './directive/style/autoWidth';
import neditorComponent from './components/neditor';
import {selectOptions,optionItem} from './components/selectOptions';
import tableWidth from './directive/style/tableWidth'
import basicWidth from './directive/style/basicWidth'
import permission from '../lw-client/src/app/permission.service'

window.moduleAlias = {
    ASSET:'asset',
    REPAIR:'repair',
    PURCHASE:'purchase'
};
export default angular.module('bdp.common',[basicSetting, workflow, permission])
    .service('bdpInterface',bdpInterface)
    .service('ProcessAlias',processAlias)
    .service('sidebarService',sidebarService)
    .service('WorkflowInterface', workflowInterface)
    .service('ProjectInterface', projectInterface)
    .service('ProjectService', ProjectService)
    .service('BasicConfigInterface', basicConfigInterface)
    .service('WorkflowConfigInterface', workflowConfigInterface)
    .directive('picView',picView)
    .directive('instructions',instructions)
    .service('ProcessConfigService', processConfigService)
    .directive('navSidebar',sidebar)
    .directive('bdpUploadFile',($compile)=>new bdpUploadFile($compile))
    .directive('solidTree',solidTree)
    .directive('auditForm',($compile,$controller)=>new auditForm($compile,$controller))
    .directive('flatTree',flatTree)
    .directive('selectOptions',($compile)=>new selectOptions($compile))
    .directive('downloadZip',($config)=>new downloadZip($config))
    .directive('compileHtml',($compile)=>new compileHtml($compile))
    .directive('importFile',($compile,$sessionStorage,$config)=>new importFile($compile,$sessionStorage,$config))
    .directive('lwLaydate',($filter)=>new Laydate($filter))
    .directive('formSubmitValid',(dialogsManager)=>new formSubmitValid(dialogsManager))
    .directive('formUpload',($compile,$sessionStorage,$config,OAuth2Token)=>new formUpload($compile,$sessionStorage,$config,OAuth2Token))
    .directive('fileBtn',()=>new fileBtn())
    .directive('fileSure',()=>new fileSure())
    .directive('autoWidth',()=>new autoWidth())
    .directive('tableWidth',()=>new tableWidth())
    .directive('basicWidth',()=>new basicWidth())
    .directive('neditorArea',($config)=>new neditorComponent($config))
    .directive('fileRemove',()=>new fileRemove())
    .directive('fileUploadRemove',()=>new fileUploadRemove())
    .name;
