export class FileUploaderOptionsExtend {

	private _directory: string;
	private _maxFileSize: number;
	private _allowedFileType: string[];


	constructor(directory?: string, maxFileSize?: number, allowedFileType?: string[]) {
		this._directory = directory;
		this._maxFileSize = maxFileSize;
		this._allowedFileType = allowedFileType;
	}


	get directory(): string {
		return this._directory;
	}

	set directory(value: string) {
		this._directory = value;
	}

	get maxFileSize(): number {
		return this._maxFileSize;
	}

	set maxFileSize(value: number) {
		this._maxFileSize = value;
	}

	get allowedFileType(): string[] {
		return this._allowedFileType;
	}

	set allowedFileType(value: string[]) {
		this._allowedFileType = value;
	}
}
