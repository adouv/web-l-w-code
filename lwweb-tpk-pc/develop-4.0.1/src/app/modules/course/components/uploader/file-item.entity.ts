export const PROGRESS = 0;
export const SUCCESS = 1;
export const FAILURE = 2;
// 文件上传
export const FILE_ITEM_TYPE_UPLOAD = '1';
// 文件下载
export const FILE_ITEM_TYPE_DOWNLOAD = '2';

// 最大上传文件大小
export const MAX_FILE_SIZE = 50;

const PROGRESS_MESSAGE = '进行中';
const SUCCESS_MESSAGE = '已完成';
const FAILURE_MESSAGE = '失败';


export class UploaderItemEntity {

	private _type: string;
	private _name: string;
	private _progress: number;
	private _state: number;
	private _index: number;
	private _msg: string;
	private _errorMsg: string;
	private _path: string;
	private _size: number;
	private _id: string;
	private _guid: string;


	constructor(type: string, name: string, progress: number, state: number, index: number, path?: string, size?: number, id?: string, guid?: string) {
		this._type = type;
		this._name = name;
		this._progress = progress;
		this._state = state;
		this._index = index;
		this._msg = this.getMsg(state);
		this._path = path;
		this._size = size;
		this._id = id;
		this._guid = guid;
	}


	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get path(): string {
		return this._path;
	}

	set path(value: string) {
		this._path = value;
	}

	get size(): number {
		return this._size;
	}

	set size(value: number) {
		this._size = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get progress(): number {
		return this._progress;
	}

	set progress(value: number) {
		this._progress = value;
	}

	get state(): number {
		return this._state;
	}

	set state(value: number) {
		this._state = value;
		this._msg = this.getMsg(value);
	}

	get index(): number {
		return this._index;
	}

	set index(value: number) {
		this._index = value;
	}

	get msg(): string {
		return this._msg;
	}

	set msg(value: string) {
		this._msg = value;
	}

	get errorMsg(): string {
		return this._errorMsg;
	}

	set errorMsg(value: string) {
		this._errorMsg = value;
	}

	get guid(): string {
		return this._guid;
	}

	set guid(value: string) {
		this._guid = value;
	}

	private getMsg(state: number): string {
		if (state === PROGRESS) {
			return PROGRESS_MESSAGE;
		} else if (state === SUCCESS) {
			return SUCCESS_MESSAGE;
		} else if (state === FAILURE) {
			return FAILURE_MESSAGE;
		} else {
			return '';
		}
	}
}
