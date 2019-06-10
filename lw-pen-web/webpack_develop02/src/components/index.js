import WinCloseComponent from './winClose'
import ToolsComponent from './tools'
import CollapseTreeComponent from './collapseTree'
import EllipticalPageComponent from './ellipticalPage'
import LibraryTemplateComponent from './libraryTemplate'
import SelectedPersonComponent from './selectedPerson'
import TreeComponent from './tree'
import PieChartComponent from './pieChart'
import LineChartComponent from './lineChart'
import AnswerChartComponent from './AnswerChart'
import modal from './modal/index';
import noteDraw from './noteDrwa/index';
import noteList from './noteList/index';
export default {
  init(Vue) {
    //Components
    Vue.use(WinCloseComponent);
    Vue.use(ToolsComponent);
    Vue.use(CollapseTreeComponent);
    Vue.use(EllipticalPageComponent);
    Vue.use(LibraryTemplateComponent);
    Vue.use(SelectedPersonComponent);
    Vue.use(TreeComponent);
    Vue.use(PieChartComponent);
    Vue.use(LineChartComponent);
    Vue.use(noteDraw);
    Vue.use(AnswerChartComponent);
    Vue.use(modal);
    Vue.use(noteList);
  }
}
