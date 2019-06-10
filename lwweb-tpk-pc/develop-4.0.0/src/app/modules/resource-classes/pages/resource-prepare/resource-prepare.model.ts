export const PROGRESS = 0;
export const SUCCESS = 1;
export const FAILURE = 2;

// 文件上传
export const FILE_ITEM_TYPE_UPLOAD = '1';
// 文件下载
export const FILE_ITEM_TYPE_DOWNLOAD = '2';

// 最大上传文件大小
export const MAX_FILE_SIZE = 50;

export const PROGRESS_MESSAGE = '进行中';
export const SUCCESS_MESSAGE = '已完成';
export const FAILURE_MESSAGE = '失败';

export interface UploaderItemModel {
	type: string;
	name: string;
	progress: number;
	state: number;
	index: number;
	msg?: string;
	errorMsg?: string;
	path?: string;
	size?: number;
	id?: string;
	guid?: string;
}

export interface CourseSpaceModel {
	usedSpace?: number;
	totalSpace?: number;
	usedRatio?: number;
}

export interface FileUploaderModel {
	directory?: string;
	maxFileSize?: number;
	allowedFileType?: string[];
}
