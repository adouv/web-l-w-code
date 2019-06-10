export enum FlowMethod {
	POST = 'POST',
	GET = 'GET'
}

export const FlowParamKey = {
	FILE: '$file',
	FILES: '$files',
	DATA: '$data',
	EVENT: '$event',
};

export const FlowEventKey = {
	FILE_SUCCESS: 'fileSuccess',
	FILE_PROGRESS: 'fileProgress',
	FILE_ADDED: 'fileAdded',
	FILES_ADDED: 'filesAdded',
	FILES_SUBMITTED: 'filesSubmitted',
	FILE_RETRY: 'fileRetry',
	FILE_REMOVED: 'fileRemoved',
	FILE_ERROR: 'fileError',
	UPLOAD_START: 'uploadStart',
	COMPLETE: 'complete',
	PROGRESS: 'progress',
	ERROR: 'error'
};

export const FlowEventParams = new Map<string, Array<string>>([
	[FlowEventKey.FILES_SUBMITTED, [FlowParamKey.FILES, FlowParamKey.EVENT]],
	[FlowEventKey.FILES_ADDED, [FlowParamKey.FILES, FlowParamKey.EVENT]],
	[FlowEventKey.FILE_SUCCESS, [FlowParamKey.FILE, FlowParamKey.DATA]],
	[FlowEventKey.FILE_ADDED, [FlowParamKey.FILE, FlowParamKey.EVENT]],
	[FlowEventKey.FILE_ERROR, [FlowParamKey.FILE, FlowParamKey.DATA]],
	[FlowEventKey.ERROR, [FlowParamKey.DATA, FlowParamKey.FILE]],
	[FlowEventKey.FILE_PROGRESS, [FlowParamKey.FILE]],
	[FlowEventKey.FILE_REMOVED, [FlowParamKey.FILE]],
	[FlowEventKey.FILE_RETRY, [FlowParamKey.FILE]],
	[FlowEventKey.UPLOAD_START, []],
	[FlowEventKey.COMPLETE, []],
	[FlowEventKey.PROGRESS, []]
]);

export abstract class FlowUploader {
	target: string; // 服务器路径
	autoUpload ? = false; // 是否自动上传
	singleFile ? = false;
	isDirectory ? = false;
	testChunks ? = false; // 是否是文件流的方式
	chunkSize?: number = 1024 * 1024 * 500; // 文件分成多个块，上传的单个块的大小
	forceChunkSize ? = false; // 强制所有文件块小于等于chunkSize
	simultaneousUploads ? = 1; // 同时上传数
	fileParameterName ? = 'file'; // 文件上传后端接收参数的名称
	query?: any = {}; // 上传携带的其他参数
	headers?: any = {}; // 上传headers中的信息
	withCredentials ? = false; // 是否使用CORS跨域
	method?: 'multipart' | 'octet'; // ?
	uploadMethod?: FlowMethod | Function = FlowMethod.POST; // 上传的http请求方式
	allowDuplicateUploads ? = false; // 同一个文件是否允许多次上传
	prioritizeFirstAndLastChunk ? = false;
	preprocess?: string | null = null;
	initFileFn?: Function;
	readFileFn?: Function;
	generateUniqueIdentifier?: Function | null;
	maxChunkRetries ? = 5; // 上传出错最大重试次数
	chunkRetryInterval ? = 1000; // 出错重试之前等待的时间
	progressCallbacksInterval ? = 500; // 进度回调之间的时间间隔
	speedSmoothingFactor ? = 0.1; // 平均上传速度
	successStatuses?: number[] = [200, 201, 202];
	permanentErrors?: number[] = [404, 415, 500, 501];
	attributes?: any = {}; // 上传文件input的属性
}

