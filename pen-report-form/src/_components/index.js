import { gaugeComponentInstall } from './gauge/index.js';
import { funnelComponentInstall } from './funnel/index.js';
import { popComponentInstall } from './pop/index.js';
import { studenInfoTableComponentInstall } from './studentTable/index.js';
import { pieChartComponentInstall } from './pieChart/index.js';
import { resultTableComponentInstall } from './resultTable/index.js';
import { lineChartComponentInstall } from './lineChart/index.js';
import { colorfulKeysChartComponentInstall } from './bar/index.js';
import { commonTopComponentInstall } from './commonTop/index.js';
import { multidimensionalBarComponentInstall } from './MultidimensionalBar/index.js';
import { lineComponentInstall } from './line/index.js';
import { powerScatterComponentInstall } from './powerScatter/index.js';
import { radarComponentInstall } from './radar/index.js';
import { positiveAndNegativeBarComponentInstall } from './PNBar/index.js';
import { allReportSelectComponentInstall } from './allReportSelect/index.js';
import { loadingComponentInsatll } from './loading/index.js';

export const ComponentInit = (Vue) => {
    gaugeComponentInstall(Vue);
    funnelComponentInstall(Vue);
    popComponentInstall(Vue);
    studenInfoTableComponentInstall(Vue);
    pieChartComponentInstall(Vue);
    resultTableComponentInstall(Vue);
    lineChartComponentInstall(Vue);
    colorfulKeysChartComponentInstall(Vue)
    commonTopComponentInstall(Vue);
    multidimensionalBarComponentInstall(Vue);
    lineComponentInstall(Vue);
    powerScatterComponentInstall(Vue);
    radarComponentInstall(Vue);
    positiveAndNegativeBarComponentInstall(Vue);
    allReportSelectComponentInstall(Vue);
    loadingComponentInsatll(Vue);
}