export class MaterialItemDto {
	id: string;
	name: string;
	isSetMainAble: boolean;
	isMain: boolean;
	path: string;
	size: number;
	fileServer: number;


	constructor(id?: string, name?: string, isSetMainAble?: boolean, isMain?: boolean, path?: string, size?: number, fileServer?: number) {
		this.id = id;
		this.name = name;
		this.isSetMainAble = isSetMainAble;
		this.isMain = isMain;
		this.path = path;
		this.size = size;
		this.fileServer = fileServer;
	}
}
