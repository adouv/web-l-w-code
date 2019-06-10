export class ClassSheetEntity {
	// 未备课
	public static NOT_PREPARE_LESSON = 0;
	// 备课中
	public static PREPAREING_LESSON = 1;
	// 已备课
	public static PREPARED_LESSON = 2;
	// 没有课
	public static NOT_LESSON = 3;


	// 列表显示结构
	private _name = '';
	private _state: number = ClassSheetEntity.NOT_LESSON;
	// 列表的具体数据
	private _data: any;
	private _enableSync: boolean;
	constructor(name?: string, state?: number, data?: any, enableSync?: boolean) {
		if (name) {
			this.name = name;
		}
		if (state) {
			this.state = state;
		}
		if (data) {
			this.data = data;
		}
		this.enableSync = enableSync;
	}


	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get state(): number {
		return this._state;
	}

	set state(value: number) {
		this._state = value;
	}

	get data(): any {
		return this._data;
	}

	set data(value: any) {
		this._data = value;
	}

	set enableSync(value: any) {
		this._enableSync  = value;
	}

	get enableSync() {
		return this._enableSync;
	}
}
