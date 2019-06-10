// 最大上传文件大小
export const MAX_FILE_SIZE = 50;
export const COURSE_NAME = {
	UPLOADER_DISPLAY_PRE_STAGE: '课前',
	UPLOADER_DISPLAY_IN_STAGE: '课中',
	UPLOADER_DISPLAY_LAST_STAGE: '课后'
};
export const COURSE_NAME_UPLOAD = {
	UPLOADER_DISPLAY_PRE_STAGE: '课前材料',
	UPLOADER_DISPLAY_IN_STAGE: '上课课件',
	UPLOADER_DISPLAY_LAST_STAGE: '课后材料'
};
export const COURSE_STATUE = {
	COURSE_BEFORE: '0',
	COURSE_DURING: '1',
	COURSE_AFTER: '2'
};

export const LESSON_METHOD = {
	EXERCISE: '1',
	COURSEWARE: '0'
};

export const LESSON_NAME = {
	EXERCISE: '习题',
	COURSEWARE: '课件'
};

export interface RouterCourseWareParams {
	selectedGarden: string;
	selectedYear: string;
	selectedSemester: string;
	selectedWeek: string;
	selectedClass: string;
}
