export interface QualityCoursesModel {
	outlineTitle: string; // 大纲名称
	outlineId: string; // 大纲id
	id: string; // 精品课id
	name: string; // 精品课名称
	gradeName: string; // 年级
	className: string; // 班级
	subjectName: string; // 学科
	period: number; // 第几节
	week: number; // 周
	isShow: boolean; // 是否主视频
	duration: string; // 时长
	path: string; // 视频地址
	cover: string; // 封面地址
	source: number;  // 视频来源 0：录制，1：上传
	subjectCode: string;
}

