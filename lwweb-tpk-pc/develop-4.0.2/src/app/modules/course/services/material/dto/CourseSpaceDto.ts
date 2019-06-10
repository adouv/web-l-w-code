export class CourseSpaceDto {
	private _usedSpace: number;
	private _totalSpace: number;
	private _usedRatio: number;

	constructor(usedSpace: number, totalSpace: number) {
		this._usedSpace = usedSpace;
		this._totalSpace = totalSpace;
		if (this._usedSpace && this._totalSpace && this._totalSpace !== 0) {
			this._usedRatio = Math.round(this._usedSpace * 100 / this._totalSpace);
		} else {
			this._usedRatio = 0;
		}
	}


	get usedSpace(): number {
		return this._usedSpace;
	}

	set usedSpace(value: number) {
		this._usedSpace = value;
	}

	get totalSpace(): number {
		return this._totalSpace;
	}

	set totalSpace(value: number) {
		this._totalSpace = value;
	}

	get usedRatio(): number {
		return this._usedRatio;
	}

	set usedRatio(value: number) {
		this._usedRatio = value;
	}
}
