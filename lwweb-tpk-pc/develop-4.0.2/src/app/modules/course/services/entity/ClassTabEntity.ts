export class ClassTabEntity {
	//选中
	public static SELECTED: number = 1;
	//未选中
	public static UNSELECTED: number = 0;
	//列表显示结构
	private _name: string;
	private _state: number;//0:课程时段，1：没有备课，2：备课中，3：完成备课
	//列表的具体数据
	private _data: any;

	constructor(name?: string, state?: number, data?: string) {
		if (name) {
			this._name = name;
		}
		if (state) {
			this._state = state;
		}
		if (data) {
			this._data = data;
		}
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


}
