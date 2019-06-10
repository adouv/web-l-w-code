export default {
    // 单道题缺省页判断
    async getSingleDefaultPage() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.singleIsNull());
            resolve(result);
        });
    },
    // 多道题缺省页判断
    async getAllDefaultPage() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.allIsNull());
            resolve(result);
        });
    },
    // 报表头部信息
    async getReportTitle() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.PracticeResultTitle());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 仪表盘
    async getGaugeOrigins(reportType, type) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.AllDashBoardChartStatistics(reportType, type));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 漏斗图
    async getFunnelOrigins(reportType, type) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.AllFunnelFigureChartStatistics(reportType, type));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 气泡图
    async getPopOrigins(reportType, type) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.AllBubbleDiagramChartStatistics(reportType, type));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // table数据
    async getTable(status, type, change) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.TableChart(status, type, change));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 五彩琴键图
    async getBarOrigins(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.MultiDimensionalChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 复合柱形图
    async getMultiBarOrigin(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.MultiBarChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 线数走势图
    async getLineOirgins(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.LineChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 实力散点图
    async getPScatterOrigins(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.ScatterDiagramChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 雷达图
    async getRadarOrigins(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.RadarChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 认知指数
    async getPnBarOrigins(demotionType) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.CognitiveIndexChartStatistics(demotionType));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //试题维度 柱状图
    async getPracticeStatistics() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.OnePracticeStatistics());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //知识点维度 柱状图
    async getPracticeKnowledgeStatistics() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.OnePracticeKnowledgeStatistics());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //试题维度 基本答题结果汇总统计
    async getPracticeBaseInfo() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.OnePracticeBaseInfo());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //知识点维度 基本答题结果汇总统计
    async getPracticeKnowledgeBaseInfo() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.OnePracticeKnowledgeBaseInfo());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //学生答题结果汇总统计
    async getStudentOriginalStatistics() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.OnePracticeStudentOriginalStatistics());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //单道题结果 获取饼状图和柱状图
    async getOneQuestionClassStatistics() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.oneQuestionClassStatistics());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //单道题结果 获取表格数据
    async getOneQuestionOriginalRecordList(studentAnswer, studentScore, studentIsRight) {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.oneQuestionOriginalRecordList(studentAnswer, studentScore, studentIsRight));
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    //获取知识点详细得分统计表
    async getOnePracticeKnowledgeScoreStatistics() {
        return await new Promise((resolve, reject) => {
            let result = JSON.parse(lwmain.onePracticeKnowledgeScoreStatistics());
            if (result) {
                resolve(result);
            } else {
                reject('error')
            }
        });
    },
    // 试题维度笔迹回显
    async loadHistoryHandwritingForQuestion(exerciseId, questionId) {
        return await new Promise((resolve, reject) => {
            lw.loadHistoryHandwritingForQuestion(exerciseId, questionId);
        });
    },
    // 学生维度笔迹回显
    async loadHistoryHandwritingForStudent(exerciseId, studentId) {
        return await new Promise((resolve, reject) => {
            lw.loadHistoryHandwritingForStudent(exerciseId, studentId);
        });
    }

}